type Suffix = `${'.'|''}${string}`

export const requireDir: (dir: string, suffixes: Suffix | Suffix[]) => {
  [k: string]: any
}
