export type RequireDirOptions = {
  /**
   * default is false
   */
  recurse?: boolean
  /**
   * default is true
   */
  removeSuffixFromKey?: boolean
  /**
   * default is true
   */
  keyCamelCase?: boolean
}

export type ScanDirOptions = {
  /**
   * default is false
   */
  recurse?: boolean
}

export function requireDir(dir: string, suffixes: string | string[], options?: RequireDirOptions): {
  [k: string]: any
}

export function scanDir(dir: string, suffixes: string | string[], options?: ScanDirOptions): string[]
