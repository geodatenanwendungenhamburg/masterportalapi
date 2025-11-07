import ogcApiProcesses from "../../src/api/ogcApiProcesses";

describe("ogcApiProcesses.js", () => {
    const processUrl = "https://example.de",
        processId = "process-id",
        jobId = "job-id";

    function mockFetch (returnValue = {}) {
        global.fetch = jest.fn().mockImplementation(() => {
            return new Promise((resolve) => {
                resolve({
                    ok: true,
                    status: 200,
                    json: () => {
                        return returnValue;
                    }
                });
            });
        });
    }

    beforeEach(() => {
        if (global.fetch) {
            fetch.mockClear();
        }

        mockFetch();
    });

    describe("processList", () => {
        it("should return a process list", async () => {
            await ogcApiProcesses.processList(processUrl);

            expect(fetch).toHaveBeenCalledWith(`${processUrl}/processes`, {method: "GET"});
        });

        it("should return a process list with next link", async () => {
            const offsetProcessUrl = `${processUrl}/processes?offset=30`;

            await ogcApiProcesses.processList(offsetProcessUrl, true);

            expect(fetch).toHaveBeenCalledWith(offsetProcessUrl, {method: "GET"});
        });
    });

    describe("processDescription", () => {
        it("should return a process description", async () => {
            await ogcApiProcesses.processDescription(processUrl, processId);

            expect(fetch).toHaveBeenCalledWith(`${processUrl}/processes/${processId}`, {method: "GET"});
        });
    });

    describe("executeProcess", () => {
        it("should execute a process", async () => {
            const data = {
                attr: "test-attribute"
            };

            await ogcApiProcesses.executeProcess(processUrl, processId, data);

            expect(fetch).toHaveBeenCalledWith(`${processUrl}/processes/${processId}/execution`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: "{\"inputs\":{\"attr\":\"test-attribute\"}}"
            });
        });
    });

    describe("jobList", () => {
        it("should return a job list", async () => {
            await ogcApiProcesses.jobList(processUrl);

            expect(fetch).toHaveBeenCalledWith(`${processUrl}/jobs`, {method: "GET"});
        });

        it("should return a job list with next link", async () => {
            const offsetProcessUrl = `${processUrl}/jobs?offset=20`;

            await ogcApiProcesses.processList(offsetProcessUrl, true);

            expect(fetch).toHaveBeenCalledWith(offsetProcessUrl, {method: "GET"});
        });
    });

    describe("jobStatus", () => {
        it("should return a job status", async () => {
            await ogcApiProcesses.jobStatus(processUrl, jobId);

            expect(fetch).toHaveBeenCalledWith(`${processUrl}/jobs/${jobId}`, {method: "GET"});
        });
    });

    describe("cancelJob", () => {
        it("should cancle a job", async () => {
            await ogcApiProcesses.cancelJob(processUrl, jobId);

            expect(fetch).toHaveBeenCalledWith(`${processUrl}/jobs/${jobId}`, {method: "DELETE"});
        });
    });

    describe("jobResults", () => {
        it("should return job results in json format", async () => {
            await ogcApiProcesses.jobResults(processUrl, jobId);

            expect(fetch).toHaveBeenCalledWith(`${processUrl}/jobs/${jobId}/results?f=json`, {method: "GET"});
        });

        it("should return job results in html format", async () => {
            await ogcApiProcesses.jobResults(processUrl, jobId, "html");

            expect(fetch).toHaveBeenCalledWith(`${processUrl}/jobs/${jobId}/results?f=html`, {method: "GET"});
        });
    });

    describe("pollJobResults", () => {
        it("returns job results when status is successful", async () => {
            mockFetch({status: "successful", result: "It worked!"});

            const result = await ogcApiProcesses.pollJobResults(processUrl, jobId);

            expect(result).toEqual({result: "It worked!", status: "successful"});
            expect(fetch).toHaveBeenCalledWith(`${processUrl}/jobs/${jobId}`, {method: "GET"});
            expect(fetch).toHaveBeenCalledWith(`${processUrl}/jobs/${jobId}/results?f=json`, {method: "GET"});
        });

        it("throws error when status is failed", async () => {
            mockFetch({status: "failed"});

            await expect(ogcApiProcesses.pollJobResults(processUrl, jobId)).rejects.toThrow("Polling job job-id at https://example.de resulted in status \"failed\".");
        });

        it("throws error when status is dismissed", async () => {
            mockFetch({status: "dismissed"});

            await expect(ogcApiProcesses.pollJobResults(processUrl, jobId)).rejects.toThrow("Polling job job-id at https://example.de resulted in status \"dismissed\".");
        });

        it("throws error when polling times out", async () => {
            mockFetch({status: "running"});

            await expect(ogcApiProcesses.pollJobResults(processUrl, jobId, {timeout: 10, stallFor: 1})).rejects.toThrow(/timed out/);
        });
    });
});