// Import dce-mango
import { Collection as MangoCollection } from 'dce-mango';

// Import dce-reactkit
import { Log } from 'dce-reactkit';

// Import shared types
import CrossServerCredential from '../types/CrossServerCredential';

/*------------------------------------------------------------------------*/
/* ------------------------- Collection Storage ------------------------- */
/*------------------------------------------------------------------------*/

// Variables to store collections
let logCollection: MangoCollection<Log>;
let crossServerCredentialCollection: MangoCollection<CrossServerCredential>;

// Promise that resolves when all collections are initialized
let collectionsInitializedResolve: (v?: unknown) => void;
let collectionsInitializedReject: (error: Error) => void;
const collectionsInitialized = new Promise((resolve, reject) => {
  collectionsInitializedResolve = resolve;
  collectionsInitializedReject = reject;
});

/*------------------------------------------------------------------------*/
/* ------------------------- Collection Getters ------------------------- */
/*------------------------------------------------------------------------*/

/**
 * TODO: ADD DOCS
 */
export const internalGetLogCollection = async () => {
  // Wait for collections to be initialized
  await collectionsInitialized;

  // Return the log collection
  return logCollection;
};

// TODO: create function for crossServerCredentialCollection

/*------------------------------------------------------------------------*/
/* -------------------------------- Main -------------------------------- */
/*------------------------------------------------------------------------*/

/**
 * Initialize all collections required for expresskit
 * @author Gardenia Liu
 * @author Gabe Abrams
 * @param Collection the Collection class from dce-mango
 */
const initExpressKitCollections = (Collection: typeof MangoCollection) => {
  try {
    // TODO: Create log collection, store it to the variable
    logCollection = ...copied from the function...;
    // TODO: Create cross server credential collection, store it to the variable
    crossServerCredentialCollection = ...copied from the function...;

    // Finished! Resolve the promise
    collectionsInitializedResolve();
  } catch (err) {
    return collectionsInitializedReject(err as Error);
  }
};

export default initExpressKitCollections;
