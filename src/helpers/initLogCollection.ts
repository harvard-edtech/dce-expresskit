// TODO: delete this, instead copy "new Collection ... ); into initExpressKitCollections"

// Import dce-mango
import { Collection as MangoCollection } from 'dce-mango';

// Import dce-reactkit
import { Log } from 'dce-reactkit';

/**
 * Initialize a log collection given the dce-mango Collection class
 * @author Gabe Abrams
 * @param Collection the Collection class from dce-mango
 * @returns initialized logCollection
 */
const initLogCollection = (Collection: typeof MangoCollection) => {
  return new Collection<Log>(
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
};

export default initLogCollection;
