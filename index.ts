/* eslint-disable import/first */
delete require.cache[__filename]

import path from 'path'
import { parseFileName, targetScan } from './src/utils'

type Suffix = string|string[]
type BaseOptions = {
  /**
   * check all sub-dirs
   * @default false
   */
  recurse?: boolean
}
export type ToObjectOptions = {
  /**
   * remove suffix from result object key
   * @default true
   */
  removeSuffixFromKey?: boolean
  /**
   * convert file name to camel case
   * @example sample-file-name -> sampleFileName
   * @default true
   */
  keyCamelCase?: boolean
}

type RequireDirOptions = BaseOptions & ToObjectOptions & {
  /**
   * detect if module is exported by `default` and take prop `default`
   * @default true
   */
  esModuleImportDefaultFrom?: boolean
}

// or simply module.parent.path
function getParentPath(): string {
  const myObj = {}
  Error.captureStackTrace(myObj)
  const stacks = (myObj as Pick<Error, 'stack'>).stack.split(/\s*\n\s*/)
  const re = /^at \S+ \((.*?):\d+:\d+\)$/
  const stack = stacks
    // 1. getParentPath()
    // 2. scanDir() or requireDir()
    // 3. caller()
    .slice(3)
    .find(stack => re.test(stack)) || stacks[2] || ''
  const m = stack.match(re)
  if (m != null) {
    const [, reqFilename] = m
    return path.dirname(reqFilename)
  }
}

export function scanDir(dir: string, suffixes: Suffix, options?: BaseOptions): string[]
export function scanDir(dir: string, suffixes: Suffix, options?: BaseOptions & { toObject: ToObjectOptions | boolean }): { [k: string]: string }
export function scanDir(dir: string, suffixes: Suffix = '.js', options : BaseOptions & { toObject?: ToObjectOptions | boolean } = {}): string[]|{ [k: string]: string } {
  suffixes = ([] as string[]).concat(suffixes)
  if (!path.isAbsolute(dir)) {
    const parentPath = getParentPath()
    dir = path.join(parentPath, dir)
  }
  const files = targetScan(dir, suffixes, options.recurse)

  if (options.toObject) {
    const toObject = Object.assign({
      keyCamelCase: true,
      removeSuffixFromKey: true,
    }, options.toObject)

    return files
      .reduce((obj, [fileName, filePath, suffix]) => {
        fileName = parseFileName(fileName, toObject, suffix)
        obj[fileName] = filePath
        return obj
      }, {})
  } else {
    return files.map(([, filePath]) => filePath)
  }
}

export function requireDir<T = any>(targetScan: string|string[], suffixes: Suffix = '.js', options: RequireDirOptions = {}): Record<string, T> {
  const {
    esModuleImportDefaultFrom = true,
    keyCamelCase = true,
    recurse = false,
    removeSuffixFromKey = true,
  } = options

  const parentPath = getParentPath()

  return [].concat(targetScan).reduce((result, dir) => {
    dir = path.join(parentPath, dir)

    const files = scanDir(dir, ([] as string[]).concat(suffixes), {
      recurse,
      toObject: {
        removeSuffixFromKey,
        keyCamelCase,
      },
    })
    return Object.entries(files).reduce((obj, [key, filePath]) => {
      if (obj[key]) {
        console.warn(`Duplicate key will be ignored: ${key}`)
        return obj
      }
      try {
        obj[key] = require(filePath)
        if (esModuleImportDefaultFrom && obj[key].__esModule && obj[key].default !== undefined) {
          obj[key] = obj[key].default
        }
      } catch (e) {
        console.error(e)
        throw new Error(`Could not require '${filePath}'`)
      }
      return obj
    }, result)
  }, {})
}
