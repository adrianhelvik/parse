'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function nodeToString(node) {
  var root = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (Array.isArray(node.nodes)) return nodeToString(node.nodes, false);
  if (Array.isArray(node)) return root ? '[' + node.map(function (node) {
    return nodeToString(node, false);
  }).join(', ') + ']' : node.map(function (node) {
    return nodeToString(node, false);
  }).join(', ');
  if (node.node) return nodeToString(node.node, false);
  if (node.value && node.type) return node.type + ' "' + node.value + '"';
  if (node.value) return '"' + node.value + '"';
  if (node.type) return node.type;
  console.log('???', node);
  throw Error('???');
}

exports.default = nodeToString;