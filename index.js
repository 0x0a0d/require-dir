delete require.cache[__filename]

const fs = require('fs')
const path = require('path')

// or simply module.parent.path
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
 * @param {string} dir
 * @param {string|string[]} suffixes
 * @param {import('./index').RequireDirOptions} [options={}]
 */
function requireDir(dir, suffixes = '.js', options = {}) {
  dir = getParentPath(dir)
  const files = scanDir(dir, suffixes, {
    recurse: options.recurse
  })
  return files.reduce((obj, filePath) => {
    let fileName = path.parse(filePath).base
    if (options.removeSuffixFromKey) {
      fileName = fileName.substr(0, fileName.length - suffixes.length)
      fileName = fileName.replace(/\.+$/g, '')
    }
    if (options.keyCamelCase) {
      fileName = fileName.replace(/[^a-z0-9]+([a-z0-9])/gi, (m0, m1) => m1.toUpperCase())
    }
    try {
      obj[fileName] = require(filePath)
    } catch (e) {
      console.error(e)
      throw new Error(`Could not require '${filePath}'`)
    }
    return obj
  }, {})
}
exports.requireDir = requireDir

/**
 * @param {string} dir
 * @param {string|string[]} suffixes
 * @param {import('./index').ScanDirOptions} [options={}]
 */
function scanDir(dir, suffixes = '.js', options = {}) {
  if (!Array.isArray(suffixes)) {
    suffixes = [suffixes]
  }
  dir = getParentPath(dir)
  return fs.readdirSync(dir)
    .reduce((files, file) => {
      const filePath = path.resolve(dir, file)
      if (fs.statSync(filePath).isDirectory()) {
        if (options.recurse) {
          files.push(...scanDir(filePath, suffixes, options))
        }
      } else if (suffixes.some(suffix => file.endsWith(suffix))) {
        files.push(filePath)
      }
      return files
    }, [])
}
exports.scanDir = scanDir
