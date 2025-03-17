"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Initialize a log collection given the dce-mango Collection class
 * @author Gabe Abrams
 * @param Collection the Collection class from dce-mango
 * @returns initialized logCollection
 */
var initLogCollection = function (Collection) {
    return new Collection('Log', {
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
    });
};
exports.default = initLogCollection;
//# sourceMappingURL=initLogCollection.js.map