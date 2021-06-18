delete require.cache[__filename]

const fs = require('fs')
const path = require('path')

function getParentPath(dir) {
  if (!path.isAbsolute(dir)) {
    const myObj = {}
    Error.captureStackTrace(myObj)
    const stacks = myObj.stack.split(/\s*\n\s*/)
    const re = /^at \S+ \((.*?):\d+:\d+\)$/
    const stack = stacks.slice(3).find(stack => re.test(stack)) || stacks[2] || ''
    const m = stack.match(re)
    if (m != null) {
      const [, reqFilename] = m
      const parentPath = path.dirname(reqFilename)
      dir = path.resolve(parentPath, dir)
    }
  }
  return dir
}
/**
 * require dir
 * @param {string} dir
 * @param {string|string[]} suffixes
 * @returns {Object}
 */
function requireDir(dir, suffixes = '.js') {
  if (!Array.isArray(suffixes)) {
    suffixes = [suffixes.replace(/^\.+/, '')]
  } else {
    suffixes.map(suffix => suffix.replace(/^\.+/, ''))
  }
  dir = getParentPath(dir)
  return fs.readdirSync(dir)
    .filter(file => {
      return suffixes.some(suffix => file.endsWith(`.${suffix}`))
    })
    .reduce((v, file) => {
      const key = file.substr(0, file.indexOf('.'))
      v[key] = require(path.resolve(dir, file))
      return v
    }, {})
}
exports.requireDir = requireDir
