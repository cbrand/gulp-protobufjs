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
    * `ext` The file extension which should be set. Is being determined automatically if not given depending on the `target` configuration.
    * `noErrorReporting` (default `false`) Gulp ignores errors on the console for asynchronous operations. Because of that when an error occurs during processing it will be manually added to the console. If this is not wanted the flag disables it.
    * `showStack` (default `false`) Indication if the stack of an error should be printed to console or not. Per default this is off to keep the formatting in the command line clean. 

## License

[MIT](http://en.wikipedia.org/wiki/MIT_License) @ Christoph Brand
