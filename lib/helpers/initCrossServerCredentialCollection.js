"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Initialize a cross-server credential collection given the dce-mango Collection class
 * @author Gabe Abrams
 * @param Collection the Collection class from dce-mango
 * @returns initialized logCollection
 */
var initCrossServerCredentialCollection = function (Collection) {
    return new Collection('CrossServerCredential', {
        uniqueIndexKey: 'key',
    });
};
exports.default = initCrossServerCredentialCollection;
//# sourceMappingURL=initCrossServerCredentialCollection.js.map