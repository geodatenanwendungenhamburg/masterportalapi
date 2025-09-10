declare namespace _default {
    export { processList };
    export { processDescription };
    export { executeProcess };
    export { jobList };
    export { cancelJob };
    export { jobStatus };
    export { jobResults };
}
export default _default;
/**
 * Retrieve the list of available processes.
 * @param {string} processUrl The process url.
 * @param {boolean} [nextLink=false] If processurl is a nextLink.
 * @returns {object[]} The process list.
 */
declare function processList(processUrl: string, nextLink?: boolean): object[];
/**
 * Retrieve the description of a process.
 * @param {string} processUrl The process url.
 * @param {string} processId The process id.
 * @returns {object} The process description.
 */
declare function processDescription(processUrl: string, processId: string): object;
/**
 * Execute a process.
 * @param {string} processUrl The process url.
 * @param {string} processId The process id.
 * @param {object} data The data.
 * @returns {object} The response data.
 */
declare function executeProcess(processUrl: string, processId: string, data: object): object;
/**
 * Retrieve the list of jobs.
 * @param {string} processUrl The process url.
 * @param {boolean} [nextLink=false] If processurl is a nextLink.
 * @returns {object[]} The job list.
 */
declare function jobList(processUrl: string, nextLink?: boolean): object[];
/**
 * Cancel a job execution, remove a finished job.
 * @param {string} processUrl The process url.
 * @param {string} jobId The job id.
 * @returns {object} The canceled job status.
 */
declare function cancelJob(processUrl: string, jobId: string): object;
/**
 * Retrieve the status of a job.
 * @param {string} processUrl The process url.
 * @param {string} jobId The job id.
 * @returns {object} The job status.
 */
declare function jobStatus(processUrl: string, jobId: string): object;
/**
 * Retrieve the result(s) of a job.
 * @param {string} processUrl The process url.
 * @param {string} jobId The job id.
 * @param {string} [format=json] The result format can be `html` or `json`.
 * @returns {object} The job dismissed status.
 */
declare function jobResults(processUrl: string, jobId: string, format?: string): object;
