# @cylution/require-dir

scan and require all files from input folder

## Install
```bash
npm i @cylution/require-dir
# Or
yarn add @cylution/require-dir 
```

## Usage
test tree:
```text
test
├── requireDir.test.js
└── services
    ├── a.service.js
    ├── b.service.js
    ├── c
    │   ├── d.service.js
    │   ├── e
    │   │   ├── excl-c.service.json
    │   │   └── f.service.js
    │   └── excl-b.xx.ts
    └── excl-a.serv.tsx
```

```js
// requireDir.test.js
const { requireDir, scanDir } = require('@cylution/require-dir')

scanDir('services', 'service.js', {
  recurse: true
})
/*
=> [
  "/path/to/test/services/a.service.js",
  "/path/to/test/services/b.service.js",
  "/path/to/test/services/c/d.service.js",
  "/path/to/test/services/c/e/f.service.js"
]
 */
requireDir('services', '.js', { // '.js' or 'js' is same result
  recurse: true,
  keyCamelCase:true,
  removeSuffixFromKey: true, // get key aService instead of aServiceJs
})
/*
=> {
  aService: 'a.service.js', // 'a.service.js' is exported from a.service.js
  bService: 'b.service.js',
  dService: 'd.service.js',
  fService: 'f.service.js'
}
 */
```

## Methods

### requireDir(dir, suffixes, options)
lookup and require all files in `dir`

name | required |type | description
---|---|---|---
dir|✅|`string` or `string[]`|target path(s)
suffixes|✅|`string` or `string[]`|acceptable suffix(es)
options|x|`requireDirOptions`|extra options. See below

#### requireDirOptions
name|type|description
---|---|---
recurse|`boolean`|default: `false`. Lookup all sub directories
removeSuffixFromKey|`boolean`|default: `true`. Do not include suffix to result object key
keyCamelCase|`boolean`|default: `true`. Change result object key to `camelCase` instead of `camel-case` or `camel.case`
esModuleImportDefaultFrom|`boolean`|default: `true`. If module was exported by `export default`, automatically import `.default`

### scanDir(dir, suffixes, options)
lookup and return all file's relative paths in `dir`

Note: `requireDir` use this method to scan files

name | required |type | description
---|---|---|---
dir|✅|`string`|target path
suffixes|✅|`string` or `string[]`|acceptable suffix(es)
options|x|`scanDirOptions`|extra options. See below

#### scanDirOptions
name|type|description
---|---|---
recurse|`boolean`|default: `false`. Lookup all sub directories
toObject|`ToObjectOptions`|default: `null`. Return object `{fileName: filePath}` instead of `filePath[]`

##### ToObjectOptions
name|type|description
---|---|---
removeSuffixFromKey|`boolean`|default: `true`. Do not include suffix to result object key
keyCamelCase|`boolean`|default: `true`. Change result object key to `camelCase` instead of `camel-case` or `camel.case`
