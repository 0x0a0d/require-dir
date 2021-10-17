import { readdirSync, statSync } from 'fs'
import { resolve } from 'path'
import { ToObjectOptions } from '../index'

export function targetScan(target: string, suffixes: string[], recurse: boolean): [fileName: string, filePath: string, suffix: string][] {
  return readdirSync(target)
    .reduce((files, fileName) => {
      const filePath = resolve(target, fileName)
      if (statSync(filePath).isDirectory()) {
        if (recurse) {
          files.push(...targetScan(filePath, suffixes, recurse))
        }
      } else {
        const suffix = suffixes.find(suffix => fileName.endsWith(suffix))
        if (suffix != null) {
          files.push([fileName, filePath, suffix])
        }
      }
      return files
    }, [] as [fileName: string, filePath: string, suffix: string][])
}

export function parseFileName(fileName: string, options: ToObjectOptions, suffix: string): string {
  if (options.removeSuffixFromKey) {
    fileName = fileName.substr(0, fileName.length - suffix.length)
    fileName = fileName.replace(/\.+$/g, '')
  }
  if (options.keyCamelCase) {
    fileName = fileName.replace(/[^a-z0-9]+([a-z0-9])/gi, (m0, m1) => m1.toUpperCase())
  }
  return fileName
}
