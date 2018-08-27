function nodeToString(node, root = true) {
  if (Array.isArray(node.nodes))
    return nodeToString(node.nodes, false)
  if (Array.isArray(node))
    return root
      ? '[' + node.map(node => nodeToString(node, false)).join(', ') + ']'
      : node.map(node => nodeToString(node, false)).join(', ')
  if (node.node)
    return nodeToString(node.node, false)
  if (node.value && node.type)
    return `${node.type} "${node.value}"`
  if (node.value)
    return `"${node.value}"`
  if (node.type)
    return node.type
  console.log('???', node)
  throw Error('???')
}

export default nodeToString
