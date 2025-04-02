import { Log, LogReviewerFilterState } from 'dce-reactkit';
import { Collection } from 'dce-mango';
/**
 * Get logs for the log reviewer interface
 * @author Yuen Ler Chow
 * @param opts object containing all arguments
 * @param opts.pageNumber the page number to retrieve (1-indexed)
 * @param opts.filters filter criteria for logs
 * @param opts.countDocuments if true, count number of documents matching
 *   filters and return num pages (not always required because if changing pages,
 *   we don't need to recount documents)
 * @param opts.logCollection MongoDB collection containing logs
 * @returns object with logs for the requested page and optionally total number of pages
 */
declare const getLogReviewerLogs: (opts: {
    pageNumber: number;
    filters: LogReviewerFilterState;
    countDocuments: boolean;
    logCollection: Collection<Log>;
}) => Promise<import("dce-mango/lib/types/PaginatedResponse").default<Log> | {
    numPages: number;
    items: Log[];
    currentPageNumber: number;
    perPage: number;
    hasAnotherPage: boolean;
}>;
export default getLogReviewerLogs;
