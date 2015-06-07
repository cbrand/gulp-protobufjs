# [gulp](https://github.com/wearefractal/gulp)-protobufjs
[Downloads](https://npmjs.org/package/gulp-protobufjs)

> Converts protobuf files utilizing the [protobufjs](https://github.com/dcodeIO/ProtoBuf.js/) library.

## Install

Install with [npm](https://npmjs.org/package/gulp-protobufjs).

```
npm install --save-dev gulp-protobufjs
```

## Examples

```js
var gulp = require('gulp');
var gulpprotobuf = require('gulp-protobufjs');

gulp.task('default', function () {
  return gulp.src('file.proto')
    .pipe(gulpprotobuf())
    .pipe(gulp.dest('out/'));
});
```

## API

`gulpprotobuf(options)`
* `options`:
    * `input`: (default `protobuf`) Input format. Can be either `protobuf` or `json`
    * `target`: (default `commonjs`) Output format. Can be `amd`, `commonjs`, `js`, `json` or `proto`.
    * `path`: Optional path to specify where the base path for the proto imports is.
    * `encoding` (default `utf-8`) Encoding which should be used to parse the input files.

## License

[MIT](http://en.wikipedia.org/wiki/MIT_License) @ Christoph Brand
