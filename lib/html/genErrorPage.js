"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Import dce-reactkit
var dce_reactkit_1 = require("dce-reactkit");
/**
 * Generate a static error page
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param [opts.title=An Error Occurred] title of the error box
 * @param [opts.description=An unknown server error occurred. Please contact support.]
 *   a human-readable description of the error
 * @param [opts.code=ReactKitErrorCode.NoCode] error code to show
 * @param [opts.pageTitle=opts.title] title of the page/tab if it differs from
 *   the title of the error
 * @returns html of the page
 */
var genErrorPage = function (opts) {
    var _a, _b, _c, _d;
    if (opts === void 0) { opts = {}; }
    var title = ((_a = opts.title) !== null && _a !== void 0 ? _a : 'An Error Occurred');
    var pageTitle = ((_b = opts.pageTitle) !== null && _b !== void 0 ? _b : title);
    var description = ((_c = opts.description) !== null && _c !== void 0 ? _c : 'An unknown server error occurred. Please contact support.');
    var code = ((_d = opts.code) !== null && _d !== void 0 ? _d : dce_reactkit_1.ReactKitErrorCode.NoCode);
    return "\n<head>\n  <!-- Metadata -->\n  <meta\n    name=\"viewport\"\n    content=\"width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0\"\n  >\n\n  <!-- Title -->\n  <title>".concat(pageTitle, "</title>\n\n  <!-- Bootstrap -->\n  <link\n    rel=\"stylesheet\"\n    href=\"https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.1/css/bootstrap.min.css\"\n    integrity=\"sha512-siwe/oXMhSjGCwLn+scraPOWrJxHlUgMBMZXdPe2Tnk3I0x3ESCoLz7WZ5NTH6SZrywMY+PB1cjyqJ5jAluCOg==\"\n    crossorigin=\"anonymous\"\n    referrerpolicy=\"no-referrer\"\n  />\n  <script\n    src=\"https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.1/js/bootstrap.min.js\"\n    integrity=\"sha512-vyRAVI0IEm6LI/fVSv/Wq/d0KUfrg3hJq2Qz5FlfER69sf3ZHlOrsLriNm49FxnpUGmhx+TaJKwJ+ByTLKT+Yg==\"\n    crossorigin=\"anonymous\"\n    referrerpolicy=\"no-referrer\"\n  ></script>\n\n  <!-- FontAwesome -->\n  <link\n    rel=\"stylesheet\"\n    href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css\"\n    integrity=\"sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==\"\n    crossorigin=\"anonymous\"\n    referrerpolicy=\"no-referrer\"\n  />\n\n  <!-- Style -->\n  <style>\n    .DCEReactKit-pop-in {\n      animation-name: DCEReactKit-pop-in;\n      animation-duration: 0.5s;\n      animation-iteration-count: 1;\n      animation-timing-function: ease-out;\n      animation-fill-mode: both;\n\n      transform-origin: center;\n    }\n\n    @keyframes DCEReactKit-pop-in {\n      0% {\n        opacity: 0;\n        transform: scale(0.9);\n      }\n      100% {\n        opacity: 1;\n        transform: scale(1);\n      }\n    }\n\n    .DCEReactKit-slide-in {\n      animation-name: DCEReactKit-slide-in;\n      animation-duration: 1s;\n      animation-iteration-count: 1;\n      animation-timing-function: ease-out;\n      animation-fill-mode: both;\n      animation-delay: 0.2s;\n    }\n\n    @keyframes DCEReactKit-slide-in {\n      0% {\n        opacity: 0;\n        transform: translate(0, 0.3em);\n      }\n      100% {\n        opacity: 1;\n        transform: translate(0, 0);\n      }\n    }\n  </style>\n</head>\n\n<!-- Body -->\n<body class=\"bg-dark text-center pt-3 ps-3 pe-3\">\n  <!-- Alert -->\n  <div\n    class=\"DCEReactKit-pop-in alert alert-warning d-inline-block\"\n    style=\"width: 50em; max-width: 100%\"\n  >\n    <!-- Title -->\n    <h2>\n      <i class=\"me-1 fa-solid fa-triangle-exclamation\"></i>\n      ").concat(title, "\n    </h2>\n    <!-- Description -->\n    <div>\n      ").concat(description, "\n    </div>\n  </div>\n\n  <!-- Error Code -->\n  <div class=\"DCEReactKit-slide-in text-light\">\n    <strong>\n      Error Code:\n    </strong>\n    ").concat(code, "\n  </div>\n</body>\n  ");
};
exports.default = genErrorPage;
//# sourceMappingURL=genErrorPage.js.map