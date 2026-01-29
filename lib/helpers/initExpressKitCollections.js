"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLogCollection = exports.internalGetLogReviewerAdminCollection = exports.internalGetSelectAdminCollection = exports.internalGetCrossServerCredentialCollection = exports.internalGetLogCollection = void 0;
/*------------------------------------------------------------------------*/
/* ------------------------- Collection Storage ------------------------- */
/*------------------------------------------------------------------------*/
// Variables to store collections
var logCollection;
var crossServerCredentialCollection;
var selectAdminCollection;
var logReviewerAdminCollection;
// Promise that resolves when all collections are initialized
var collectionsInitializedResolve;
var collectionsInitializedReject;
var collectionsInitialized = new Promise(function (resolve, reject) {
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
var internalGetLogCollection = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Wait for collections to be initialized
            return [4 /*yield*/, collectionsInitialized];
            case 1:
                // Wait for collections to be initialized
                _a.sent();
                // Return the log collection
                return [2 /*return*/, logCollection];
        }
    });
}); };
exports.internalGetLogCollection = internalGetLogCollection;
/**
 * Get the cross server credential collection after initialization
 * @author Gardenia Liu
 */
var internalGetCrossServerCredentialCollection = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Wait for collections to be initialized
            return [4 /*yield*/, collectionsInitialized];
            case 1:
                // Wait for collections to be initialized
                _a.sent();
                // Return the cross server credential collection
                return [2 /*return*/, crossServerCredentialCollection];
        }
    });
}); };
exports.internalGetCrossServerCredentialCollection = internalGetCrossServerCredentialCollection;
/**
 * Get the select admin collection after initialization
 * @author Gardenia Liu
 */
var internalGetSelectAdminCollection = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Wait for collections to be initialized
            return [4 /*yield*/, collectionsInitialized];
            case 1:
                // Wait for collections to be initialized
                _a.sent();
                // Return the cross server credential collection
                return [2 /*return*/, selectAdminCollection];
        }
    });
}); };
exports.internalGetSelectAdminCollection = internalGetSelectAdminCollection;
/**
 * Get the log reviewer admin collection after initialization
 * @author Yuen Ler Chow
 */
var internalGetLogReviewerAdminCollection = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Wait for collections to be initialized
            return [4 /*yield*/, collectionsInitialized];
            case 1:
                // Wait for collections to be initialized
                _a.sent();
                // Return the log reviewer admin collection
                return [2 /*return*/, logReviewerAdminCollection];
        }
    });
}); };
exports.internalGetLogReviewerAdminCollection = internalGetLogReviewerAdminCollection;
/*------------------------------------------------------------------------*/
/* ----------------------- Public Collection Getters -------------------- */
/*------------------------------------------------------------------------*/
/**
 * Get the log collection. Resolves after the collection has been initialized
 * @author Yuen Ler Chow
 * @returns a promise that resolves with the log collection
 */
var getLogCollection = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: 
            // Wait for collections to be initialized
            return [4 /*yield*/, collectionsInitialized];
            case 1:
                // Wait for collections to be initialized
                _a.sent();
                // Return the log collection
                return [2 /*return*/, logCollection];
        }
    });
}); };
exports.getLogCollection = getLogCollection;
/*------------------------------------------------------------------------*/
/* -------------------------------- Main -------------------------------- */
/*------------------------------------------------------------------------*/
/**
 * Initialize all collections required for expresskit
 * @author Gardenia Liu
 * @author Gabe Abrams
 * @param Collection the Collection class from dce-mango
 */
var initExpressKitCollections = function (Collection) {
    try {
        // Create and store log collection
        logCollection = new Collection('Log', {
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
        // Create and store cross server credential collection
        crossServerCredentialCollection = new Collection('CrossServerCredential', {
            uniqueIndexKey: 'key',
        });
        // Create and store select admin collection
        selectAdminCollection = new Collection('SelectAdmin', {
            uniqueIndexKey: 'id',
        });
        // Create and store log reviewer admin collection
        logReviewerAdminCollection = new Collection('LogReviewerAdmin', {
            uniqueIndexKey: 'id',
        });
        // Finished! Resolve the promise
        collectionsInitializedResolve();
    }
    catch (err) {
        return collectionsInitializedReject(err);
    }
};
exports.default = initExpressKitCollections;
//# sourceMappingURL=initExpressKitCollections.js.map