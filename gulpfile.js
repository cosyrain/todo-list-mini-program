const {src,dest,series,watch} = require('gulp');

const sass = require('gulp-sass')
const rename = require('gulp-rename')

const filePath = './app.scss';

function scssTask() {
    return src(filePath)
        .pipe(sass())
        .pipe(rename((path)=>path.extname = '.wxss'))
        .pipe(dest('./'))
}

function watchTask() {
    watch(filePath,scssTask)
}

exports.default = series(scssTask,watchTask);
exports.build = scssTask;