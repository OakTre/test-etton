const {src, dest, series, watch, parallel} = require("gulp");
const sass = require("gulp-sass");
const prefixer = require("gulp-autoprefixer");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const notify = require("gulp-notify");
const webpack = require("webpack");
const webpackStream = require("webpack-stream");
const uglify = require("gulp-uglify-es").default;
const browserSync = require("browser-sync").create();
const pug = require("gulp-pug");
const sourcemaps = require("gulp-sourcemaps");
const imagemin = require("gulp-imagemin");
const svgSprite = require("gulp-svg-sprite");
const webp = require("gulp-webp");
const del = require("del");
const gcmq = require("gulp-group-css-media-queries");
const pugInclude = require("pug-include-glob");


const pugBuild = () => {
    return src("./src/pug/*.pug")
        .pipe(pug({ pretty: true, plugins: [pugInclude()] }))
        .pipe(dest('./app/'))
        .pipe(browserSync.stream());

};

const styles = () => {
    return src("./src/scss/style.scss")
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: "expanded"
        }).on("error", notify.onError()))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(prefixer({
            cascade: false,
            overrideBrowserslist: ['last 10 version'],
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(gcmq())
        .pipe(sourcemaps.write("."))
        .pipe(dest("./app/css/"))
        .pipe(browserSync.stream());
}

const scripts = () => {
    return src("./src/js/main.js")
        .pipe(webpackStream({
            output: {
                filename: "main.js",
            },
            module: {
                rules: [
                  {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [
                          ['@babel/preset-env', { targets: "defaults" }]
                        ]
                      }
                    }
                  }
                ]
              }
        }))
        .pipe(sourcemaps.init())
        .pipe(uglify().on("error", notify.onError()))
        .pipe(sourcemaps.write("."))
        .pipe(dest("./app/js"))
        .pipe(browserSync.stream());
}

const svgSprites = () => {
    return src("./src/img/sprite/*.svg")
        .pipe(svgSprite({
            mode: {
                stack: {
                    sprite: "../sprite.svg"
                }
            },
			shape: {
				transform: [
				  {
					svgo: {
					  plugins: [
						{
						  removeAttrs: {
							attrs: ['class', 'data-name', 'fill.*', 'stroke.*'],
						  },
						},
					  ],
					},
				  },
				],
			  },
        }))
        .pipe(dest("./app/img"))
}

const imgToApp = () => {
    return src("./src/img/**/*.{png,jpg,jpeg,svg}")
        .pipe(dest("./app/img/"))
}

const copySvg = () => {
    return src("./src/img/sprite/*.svg")
    .pipe(dest("./app/img/sprite"));
}

const copyFonts = () => {
    return src("./src/fonts/**")
    .pipe(dest("./app/fonts"));
}

const resourses = () => {
    return src("./src/resourses/**/*")
        .pipe(dest("./app/resourses"));
}

const clean = () => {
    return del(["./app/*"])
}

const watchFiles = () => {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });

    watch("./src/scss/**/*.scss", styles)
    watch("./src/pug/**/*.pug", pugBuild)
    watch("./src/img/**/*.{png,jpg,jpeg,svg}", imgToApp)
    watch("./src/img/sprite/*.svg", svgSprites)
    watch("./src/resourses/**", resourses)
    watch("./src/js/**/*.js", scripts)

}

exports.styles = styles;
exports.watchFiles = watchFiles;
exports.pugBuild = pugBuild;

exports.default = series(clean, parallel(pugBuild, scripts, imgToApp, svgSprites, copySvg, copyFonts, resourses), styles, watchFiles);

// build версия ---- gulp.build
const stylesBuild = () => {
    return src("./src/scss/style.scss")
        .pipe(sass({
            outputStyle: "expanded"
        }).on("error", notify.onError()))
        .pipe(rename({
            suffix: ".min"
        }))
        .pipe(prefixer({
            cascade: false
        }))
        .pipe(cleanCSS({
            level: 2
        }))
        .pipe(dest("./app/css/"))
}

const scriptsBuild = () => {
    return src("./src/js/main.js")
        .pipe(webpackStream({
            output: {
                filename: "main.js",
            },
            module: {
                rules: [
                  {
                    test: /\.m?js$/,
                    exclude: /node_modules/,
                    use: {
                      loader: 'babel-loader',
                      options: {
                        presets: [
                          ['@babel/preset-env', { targets: "defaults" }]
                        ]
                      }
                    }
                  }
                ]
              }
        }))
        .pipe(uglify().on("error", notify.onError()))
        .pipe(dest("./app/js"))

}
exports.build = series(clean, parallel(pugBuild, scriptsBuild, imgToApp, svgSprites, copySvg, copyFonts, resourses), stylesBuild, watchFiles);


// преобразовать изображения в wbp ---- gulp.toWebp
const toWebp = () => {
    return src("src/img/**/*.{png,jpg,jpeg}")
      .pipe(webp({ quality: 90 }))
      .pipe(dest("app/img/webp"));
};

// оптимизировать изображения ---- gulp.minifyImg
const minifyImg = () => {
    return src("src/img/**/*.{png,jpg,jpeg}")
        .pipe(imagemin([
            imagemin.optipng({ optimizationLevel: 3 }),
            imagemin.mozjpeg({ quality: 75, progressive: true }),
        ]))
        .pipe(dest('app/img'));
};

exports.webp = toWebp;
exports.minifyImg = minifyImg;
