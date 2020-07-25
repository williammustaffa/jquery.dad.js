const minify = require("@node-minify/core");
const uglifyJS = require("@node-minify/uglify-js");
const fs = require("fs");

fs.copyFile("./demo/scripts/jquery.dad.js", "./dist/jquery.dad.js", (err) => {
  if (err) throw err;

  minify({
    compressor: uglifyJS,
    input: "./demo/scripts/jquery.dad.js",
    output: "./dist/jquery.dad.min.js",
    options: {
      warnings: true,
      mangle: true,
      output: {},
      compress: true,
    },
    callback: function (err, min) {
      console.log("Finished building.");
    },
  });
});
