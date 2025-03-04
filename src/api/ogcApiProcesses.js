/**
 * This is an implementation of the interface to OGC API - Processes - Part 1: Core.
 * @module api/ogcApiProcesses
 * @see {@link https://ogcapi.ogc.org/processes|OGC API - Processes} for further information
 */

/**
 * Returns the url params for a DELETE request.
 * @returns {object} The url params for DELETE request.
 */
function fetchDeleteParams () {
    return {
        method: "DELETE"
    };
}

/**
 * Returns the url params for a GET request.
 * @returns {object} The url params for GET request.
 */
function fetchGetParams () {
    return {
        method: "GET"
    };
}

/**
 * Returns the url params for a POST request.
 * @param {object} body The request body.
 * @returns {object} The url params for poPOSTst request.
 */
function fetchPostParams (body) {
    return {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    };
}

/**
 * Returns the fetch params by request method.
 * @param {string} method The fetch method.
 * @param {object} body The request body.
 * @returns {object} The fetch params.
 */
function fetchParams (method, body) {
    const fetchParamsByMethod = {
        DELETE: fetchDeleteParams,
        GET: fetchGetParams,
        POST: fetchPostParams
    };

    return fetchParamsByMethod[method](body);
}
/**
 * Fetch the url with fetch api and catch errors.
 * @param {string} processUrl The process url.
 * @param {string} [method=GET] The fetch method.
 * @param {object} [body={}] The request body, only used if request-method is POST.
 * @returns {object} The response object.
 */
function fetchUrl (processUrl, method = "GET", body = {}) {
    return new Promise((resolve, reject) => {
        fetch(processUrl, fetchParams(method, body))
            .then(response => {
                const errorMessage = `Status code: ${response.status}.`;

                if (response.ok) {
                    return response.json();
                }
                else if (response.status === "400") {
                    throw new Error(`${errorMessage} The URL: ${response.url} is an bad request! Perhaps the status of the process or job is failure!`);
                }
                else if (response.status === "404") {
                    throw new Error(`${errorMessage} The URL: ${response.url} was not found!`);
                }

                throw new Error(`${errorMessage} The response of the URL: ${response.url} has an error occured!`);
            })
            .then(responseJson => resolve(responseJson))
            .catch(error => {
                reject(error);
            });
    });
}

/**
 * Retrieve the list of available processes.
 * @param {string} processUrl The process url.
 * @param {boolean} [nextLink=false] If processurl is a nextLink.
 * @returns {object[]} The process list.
 */
async function processList (processUrl, nextLink = false) {
    const url = nextLink ? processUrl : `${processUrl}/processes`,
        responseJson = await fetchUrl(url),
        nextLinkObject = responseJson?.links?.find(link => link.rel === "next");
    let processes = responseJson.processes;

    if (typeof nextLinkObject !== "undefined") {
        processes = processes.concat(await processList(nextLinkObject.href, true));
    }

    return processes;
}

/**
 * Retrieve the description of a process.
 * @param {string} processUrl The process url.
 * @param {string} processId The process id.
 * @returns {object} The process description.
 */
async function processDescription (processUrl, processId) {
    const url = `${processUrl}/processes/${processId}`,
        responseJson = await fetchUrl(url);

    return responseJson;
}

/**
 * Execute a process.
 * @param {string} processUrl The process url.
 * @param {string} processId The process id.
 * @param {object} data The data.
 * @returns {object} The response data.
 */
async function executeProcess (processUrl, processId, data) {
    const url = `${processUrl}/processes/${processId}/execution`,
        body = {
            inputs: data
        },
        responseJson = await fetchUrl(url, "POST", body);

    return responseJson;
}

/**
 * Retrieve the list of jobs.
 * @param {string} processUrl The process url.
 * @param {boolean} [nextLink=false] If processurl is a nextLink.
 * @returns {object[]} The job list.
 */
async function jobList (processUrl, nextLink = false) {
    const url = nextLink ? processUrl : `${processUrl}/jobs`,
        responseJson = await fetchUrl(url),
        nextLinkObject = responseJson?.links?.find(link => link.rel === "next");
    let jobs = responseJson.jobs;

    if (typeof nextLinkObject !== "undefined") {
        jobs = jobs.concat(await jobList(nextLinkObject.href, true));
    }

    return jobs;
}

/**
 * Retrieve the status of a job.
 * @param {string} processUrl The process url.
 * @param {string} jobId The job id.
 * @returns {object} The job status.
 */
async function jobStatus (processUrl, jobId) {
    const url = `${processUrl}/jobs/${jobId}`,
        responseJson = await fetchUrl(url);

    return responseJson;
}

/**
 * Cancel a job execution, remove a finished job.
 * @param {string} processUrl The process url.
 * @param {string} jobId The job id.
 * @returns {object} The canceled job status.
 */
async function cancelJob (processUrl, jobId) {
    const url = `${processUrl}/jobs/${jobId}`,
        responseJson = await fetchUrl(url, "DELETE");

    return responseJson;
}

/**
 * Retrieve the result(s) of a job.
 * @param {string} processUrl The process url.
 * @param {string} jobId The job id.
 * @param {string} [format=json] The result format can be `html` or `json`.
 * @returns {object} The job dismissed status.
 */
async function jobResults (processUrl, jobId, format = "json") {
    const url = `${processUrl}/jobs/${jobId}/results?f=${format}`,
        responseJson = await fetchUrl(url);

    return responseJson;
}

export default {
    processList,
    processDescription,
    executeProcess,
    jobList,
    cancelJob,
    jobStatus,
    jobResults
};
