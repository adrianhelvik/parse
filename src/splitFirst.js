function splitFirst(string, delimiter) {
  const index = string.indexOf(delimiter)

  if (index === -1)
    return [string]

  return [
    string.substring(0, index),
    string.substring(index+1, string.length),
  ]
}

export default splitFirst
