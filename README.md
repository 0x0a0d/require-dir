# @cylution/require-dir

## Install
```bash
npm i @cylution/require-dir
# Or
yarn add @cylution/require-dir 
```

## Usage
```js
const { requireDir } = require('@cylution/require-dir')

requireDir('.', '.alias.js') // => {'file.alias.js': any}
```
