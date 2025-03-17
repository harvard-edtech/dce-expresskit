import { Collection as MangoCollection } from 'dce-mango';
/**
 * Initialize a cross-server credential collection given the dce-mango Collection class
 * @author Gabe Abrams
 * @param Collection the Collection class from dce-mango
 * @returns initialized logCollection
 */
declare const initCrossServerCredentialCollection: (Collection: typeof MangoCollection) => MangoCollection<{
    [k: string]: any;
}>;
export default initCrossServerCredentialCollection;
