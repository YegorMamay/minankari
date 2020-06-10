"use strict";

import path from "path";

import gulp from "gulp";

import sass from "gulp-sass";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import svgmin from "gulp-svgmin";
import rename from "gulp-rename";
import plumber from "gulp-plumber";
import svgstore from "gulp-svgstore";
import cleancss from "gulp-clean-css";
//import sourcemaps from 'gulp-sourcemaps';
import autoprefixer from "gulp-autoprefixer";
import webpack from "webpack-stream";

gulp.task("svg", () => {
  return gulp
    .src("assets/img/svg/*.svg")
    .pipe(plumber())
    .pipe(
      svgmin({
        plugins: [{ removeViewBox: false }, { removeUselessDefs: true }],
        js2svg: { pretty: false }
      })
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename({ basename: "sprite", extname: ".svg" }))
    .pipe(gulp.dest("assets/img"));
});

gulp.task("sass", () => {
  return (
    gulp
      .src("assets/sass/**/*.scss")
      .pipe(plumber())
      // .pipe(sourcemaps.init())
      .pipe(
        sass({
          outputStyle: "expanded", // nested, expanded, compact, compressed
          precision: 5,
          includePaths: ["assets/sass"],
          indentType: "space",
          indentWidth: 2,
          linefeed: "crlf",
          sourceComments: false
        }).on("error", sass.logError)
      )
      .pipe(autoprefixer({ cascade: false, grid: true }))
      // .pipe(sourcemaps.write('/'))
      .pipe(gulp.dest("./"))
  );
});

gulp.task("css", () => {
  return gulp
    .src("style.css")
    .pipe(plumber())
    .pipe(cleancss({ compatibility: "ie7", debug: true }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./"));
});

gulp.task("babel", () => {
  return gulp
    .src("assets/js/es6/**/*.js")
    .pipe(plumber())
    .pipe(
      babel({
        presets: ["@babel/preset-env", "@babel/react"]
      })
    )
    .pipe(
      uglify({
        mangle: false,
        compress: false,
        output: {
          beautify: true
        }
      })
    )
    .pipe(gulp.dest("assets/js"));
});

gulp.task("jsx", () => {
  return gulp
    .src("assets/js/jsx/**/*.jsx")
    .pipe(
      webpack({
        entry: path.resolve(__dirname, "./assets/js/jsx/index.jsx"),
        output: {
          filename: "bundle.js",
          path: path.resolve("assets", "js")
        },
        module: {
          rules: [
            {
              test: /\.(js|jsx)$/,
              exclude: /node_modules/,
              loader: "babel-loader",
              options: {
                presets: ["@babel/react", "@babel/preset-env"]
              }
            },
            {
              test: /\.css$/i,
              use: ["style-loader", "css-loader"]
            }
          ]
        }
      })
    )
    .pipe(gulp.dest("assets/js"));
});

gulp.task("js", () => {
  return gulp
    .src("assets/js/brainworks.js")
    .pipe(plumber())
    .pipe(
      uglify({
        mangle: false,
        compress: false
      })
    )
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./assets/js"));
});

gulp.task("jsx:watch", () => {
  gulp.watch("assets/js/jsx/**/*.jsx", gulp.series("jsx"));
});

gulp.task("watch", () => {
  gulp.watch("assets/img/svg/*.svg", gulp.series("svg"));
  gulp.watch("assets/sass/**/*.scss", gulp.series("sass"));
  gulp.watch("assets/js/es6/**/*.js", gulp.series("babel"));
});

gulp.task("default", gulp.parallel("css", "js"));
