# @gmod/gff

[![Generated with nod](https://img.shields.io/badge/generator-nod-2196F3.svg?style=flat-square)](https://github.com/diegohaz/nod)
[![NPM version](https://img.shields.io/npm/v/@gmod/cram.svg?style=flat-square)](https://npmjs.org/package/@gmod/cram)
[![Build Status](https://img.shields.io/travis/GMOD/cram-js/master.svg?style=flat-square)](https://travis-ci.org/GMOD/cram-js) [![Coverage Status](https://img.shields.io/codecov/c/github/GMOD/cram-js/master.svg?style=flat-square)](https://codecov.io/gh/GMOD/cram-js/branch/master)

Read CRAM files with pure JavaScript.

* reads headers of CRAM files
* doesn't crash

## Install

    $ npm install --save @gmod/cram

## Usage

```js
const cram = require('@gmod/cram').default
// or in ES6 (recommended)
import {CramFile,IndexedCramFile} from '@gmod/cram'

const bareFile = new CramFile('http://example.com/my.cram')

const indexedFile = new IndexedCramFile('http://example.com/my.cram')
// above will assume the index is at http://example.com/my.cram.crai

const indexedFile2 = new IndexedCramFile(
  'http://example.com/my.cram',
  'http://example.com/my.cram.crai',
  )

```

## API

<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

## License

MIT © [Robert Buels](https://github.com/rbuels)
