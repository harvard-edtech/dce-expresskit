"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Generate a static info page
 * @author Gabe Abrams
 * @param opts object containing all arguments
 * @param opts.title title of the info box
 * @param opts.body a human-readable text body for the info alert
 * @returns the HTML for the info page
 */
var genInfoPage = function (opts) {
    var title = opts.title, body = opts.body;
    return "\n<head>\n  <!-- Metadata -->\n  <meta\n    name=\"viewport\"\n    content=\"width=device-width, height=device-height, initial-scale=1.0, minimum-scale=1.0\"\n  >\n\n  <!-- Title -->\n  <title>".concat(title, "</title>\n\n  <!-- Bootstrap -->\n  <link\n    rel=\"stylesheet\"\n    href=\"https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.1/css/bootstrap.min.css\"\n    integrity=\"sha512-siwe/oXMhSjGCwLn+scraPOWrJxHlUgMBMZXdPe2Tnk3I0x3ESCoLz7WZ5NTH6SZrywMY+PB1cjyqJ5jAluCOg==\"\n    crossorigin=\"anonymous\"\n    referrerpolicy=\"no-referrer\"\n  />\n  <script\n    src=\"https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.2.1/js/bootstrap.min.js\"\n    integrity=\"sha512-vyRAVI0IEm6LI/fVSv/Wq/d0KUfrg3hJq2Qz5FlfER69sf3ZHlOrsLriNm49FxnpUGmhx+TaJKwJ+ByTLKT+Yg==\"\n    crossorigin=\"anonymous\"\n    referrerpolicy=\"no-referrer\"\n  ></script>\n\n  <!-- FontAwesome -->\n  <link\n    rel=\"stylesheet\"\n    href=\"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css\"\n    integrity=\"sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==\"\n    crossorigin=\"anonymous\"\n    referrerpolicy=\"no-referrer\"\n  />\n\n  <!-- Style -->\n  <style>\n    .DCEReactKit-pop-in {\n      animation-name: DCEReactKit-pop-in;\n      animation-duration: 0.5s;\n      animation-iteration-count: 1;\n      animation-timing-function: ease-out;\n      animation-fill-mode: both;\n\n      transform-origin: center;\n    }\n\n    @keyframes DCEReactKit-pop-in {\n      0% {\n        opacity: 0;\n        transform: scale(0.9);\n      }\n      100% {\n        opacity: 1;\n        transform: scale(1);\n      }\n    }\n  </style>\n</head>\n\n<!-- Body -->\n<body class=\"bg-dark text-center pt-3 ps-3 pe-3\">\n  <!-- Alert -->\n  <div\n    class=\"DCEReactKit-pop-in alert alert-info d-inline-block\"\n    style=\"width: 50em; max-width: 100%\"\n  >\n    <!-- Title -->\n    <h2>\n      <i class=\"me-1 fa-solid fa-circle-info\"></i>\n      ").concat(title, "\n    </h2>\n    <!-- Body -->\n    <div>\n      ").concat(body, "\n    </div>\n  </div>\n</body>\n  ");
};
exports.default = genInfoPage;
//# sourceMappingURL=genInfoPage.js.map