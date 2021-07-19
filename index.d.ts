type BaseOptions = {
  /**
   * check all sub-dirs
   * @default true
   */
  recurse?: boolean
}
type ToObjectOptions = {
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

export type RequireDirOptions = BaseOptions & ToObjectOptions & {
  /**
   * detect if module is exported by `export default` and take prop `default`
   * @default true
   */
  esModuleImportDefaultFrom?: boolean
}

export type ScanDirOptions = BaseOptions

export type ScanDirToObjectOptions = BaseOptions & {
  toObject: ToObjectOptions | boolean
}

export function requireDir(dir: string, suffixes: string | string[], options?: RequireDirOptions): {
  [k: string]: any
}

export function scanDir(dir: string, suffixes: string | string[], options?: BaseOptions): string[]
export function scanDir(dir: string, suffixes: string | string[], options?: ScanDirToObjectOptions): {
  [k: string]: string
}
