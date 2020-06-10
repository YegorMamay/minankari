"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = require("react-dom");

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}

var App = function App() {
    return _react.default.createElement("div", null, "Hello world!");
};

(0, _reactDom.render)(_react.default.createElement(App, null), document.querySelector("#bwpf"));