import { Collection as MangoCollection } from 'dce-mango';
import { Log } from 'dce-commonkit';
import CrossServerCredential from '../types/CrossServerCredential';
import SelectAdmin from '../types/SelectAdmin';
import LogReviewerAdmin from '../types/LogReviewerAdmin';
/**
 * Get the log collection after initialization
 * @author Gardenia Liu
 */
export declare const internalGetLogCollection: () => Promise<MangoCollection<Log>>;
/**
 * Get the cross server credential collection after initialization
 * @author Gardenia Liu
 */
export declare const internalGetCrossServerCredentialCollection: () => Promise<MangoCollection<CrossServerCredential>>;
/**
 * Get the select admin collection after initialization
 * @author Gardenia Liu
 */
export declare const internalGetSelectAdminCollection: () => Promise<MangoCollection<SelectAdmin>>;
/**
 * Get the log reviewer admin collection after initialization
 * @author Yuen Ler Chow
 */
export declare const internalGetLogReviewerAdminCollection: () => Promise<MangoCollection<LogReviewerAdmin>>;
/**
 * Initialize all collections required for expresskit
 * @author Gardenia Liu
 * @author Gabe Abrams
 * @param Collection the Collection class from dce-mango
 */
declare const initExpressKitCollections: (Collection: typeof MangoCollection) => void;
export default initExpressKitCollections;
