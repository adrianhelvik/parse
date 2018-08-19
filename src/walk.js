function walk(node, fn) {
  if (Array.isArray(node)) {
    for (const item of node)
      walk(item, fn)
  } else if (node && typeof node === 'object') {
    fn(node)
    if (node.node)
      walk(node.node, fn)
    if (node.nodes)
      walk(node.nodes, fn)
  }
}

export default walk
