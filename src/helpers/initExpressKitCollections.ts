// Import dce-mango
import { Collection as MangoCollection } from 'dce-mango';

// Import dce-reactkit
import { Log } from 'dce-reactkit';

// Import shared types
import CrossServerCredential from '../types/CrossServerCredential';
import SelectAdmin from '../types/SelectAdmin';
import LogReviewerAdmin from '../types/LogReviewerAdmin';

/*------------------------------------------------------------------------*/
/* ------------------------- Collection Storage ------------------------- */
/*------------------------------------------------------------------------*/

// Variables to store collections
let logCollection: MangoCollection<Log>;
let crossServerCredentialCollection: MangoCollection<CrossServerCredential>;
let selectAdminCollection: MangoCollection<SelectAdmin>;
let logReviewerAdminCollection: MangoCollection<LogReviewerAdmin>;

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
 * Get the log collection after initialization
 * @author Gardenia Liu
 */
export const internalGetLogCollection = async () => {
  // Wait for collections to be initialized
  await collectionsInitialized;

  // Return the log collection
  return logCollection;
};

/**
 * Get the cross server credential collection after initialization
 * @author Gardenia Liu
 */
export const internalGetCrossServerCredentialCollection = async () => {
  // Wait for collections to be initialized
  await collectionsInitialized;

  // Return the cross server credential collection
  return crossServerCredentialCollection;
};

/**
 * Get the select admin collection after initialization
 * @author Gardenia Liu
 */
export const internalGetSelectAdminCollection = async () => {
  // Wait for collections to be initialized
  await collectionsInitialized;

  // Return the cross server credential collection
  return selectAdminCollection;
};

/**
 * Get the log reviewer admin collection after initialization
 * @author Yuen Ler Chow
 */
export const internalGetLogReviewerAdminCollection = async () => {
  // Wait for collections to be initialized
  await collectionsInitialized;

  // Return the log reviewer admin collection
  return logReviewerAdminCollection;
};

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
    // Create and store log collection
    logCollection = new Collection<Log>(
      'Log',
      {
        uniqueIndexKey: 'id',
        indexKeys: [
          'courseId',
          'context',
          'subcontext',
          'tags',
          'year',
          'month',
          'day',
          'hour',
          'type',
        ],
      },
    );
    // Create and store cross server credential collection
    crossServerCredentialCollection = new Collection<CrossServerCredential>(
      'CrossServerCredential',
      {
        uniqueIndexKey: 'key',
      },
    );
    // Create and store select admin collection
    selectAdminCollection = new Collection<SelectAdmin>(
      'SelectAdmin',
      {
        uniqueIndexKey: 'id',
      }
    )
    // Create and store log reviewer admin collection
    logReviewerAdminCollection = new Collection<LogReviewerAdmin>(
      'LogReviewerAdmin',
      {
        uniqueIndexKey: 'id',
      }
    )
    // Finished! Resolve the promise
    collectionsInitializedResolve();
  } catch (err) {
    return collectionsInitializedReject(err as Error);
  }
};

export default initExpressKitCollections;
