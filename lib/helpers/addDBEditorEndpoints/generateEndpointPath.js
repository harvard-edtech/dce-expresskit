"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generates the endpoint path for the given collection name
 * @author Yuen Ler Chow
 * @param collectionName the name of the collection
 * @param [adminsOnly] true if the endpoint is for admins only
 * @returns the endpoint path
 */
var generateEndpointPath = function (collectionName, adminsOnly) {
    // Determine prefix based on whether the endpoint is for admins only
    var userPath = adminsOnly ? 'admin' : 'ttm';
    // Return the endpoint path
    return "/api/".concat(userPath, "/dce-reactkit/dbeditor/").concat(collectionName);
};
exports.default = generateEndpointPath;
//# sourceMappingURL=generateEndpointPath.js.map