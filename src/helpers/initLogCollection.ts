// Import dce-mango
import { Collection as MangoCollection } from 'dce-mango';


/**
 * Initialize a log collection given the dce-mango Collection class
 * @author Gabe Abrams
 * @param Collection the Collection class from dce-mango
 * @returns initialized logCollection
 */
const initLogCollection = (Collection: typeof MangoCollection) => {
  return new Collection(
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
