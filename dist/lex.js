'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _trace = require('@adrianhelvik/trace');

var _trace2 = _interopRequireDefault(_trace);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Lexer = function () {
  function Lexer(_ref) {
    var source = _ref.source,
        syntax = _ref.syntax;

    _classCallCheck(this, Lexer);

    this.source = source;
    this.syntax = syntax;
  }

  _createClass(Lexer, [{
    key: 'lex',
    value: function lex() {
      this.tokens = [];
      this.index = 0;

      outer: while (this.index < this.source.length) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this.syntax.lex[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var _ref2 = _step.value;

            var _ref3 = _toArray(_ref2);

            var type = _ref3[0];
            var regex = _ref3[1];

            var flags = _ref3.slice(2);

            (0, _assert2.default)(typeof type === 'string', 'Type must be a string');
            (0, _assert2.default)(regex instanceof RegExp, 'Pattern must be a RegExp instance');
            var substring = this.source.substring(this.index);
            var m = substring.match(regex);
            if (!m) continue;
            if (m.index !== 0) continue;
            if (!m[0].length) continue;
            if (!flags.includes('ignore')) this.tokens.push({
              index: this.index,
              value: m[0],
              type: type
            });
            this.index += m[0].length;
            continue outer;
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        throw Error((0, _trace2.default)(this.source, this.index, 'Invalid syntax'));
      }
    }
  }]);

  return Lexer;
}();

exports.default = function (_ref4) {
  var source = _ref4.source,
      syntax = _ref4.syntax;

  var lexer = new Lexer({ source: source, syntax: syntax });
  lexer.lex();
  return lexer.tokens;
};