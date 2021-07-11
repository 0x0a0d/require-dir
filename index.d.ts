type BaseOptions = {
  /**
   * default is false
   */
  recurse?: boolean
}
type ToObjectOptions = {
  /**
   * default is true
   */
  removeSuffixFromKey?: boolean
  /**
   * default is true
   */
  keyCamelCase?: boolean
}

export type RequireDirOptions = BaseOptions & ToObjectOptions

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
