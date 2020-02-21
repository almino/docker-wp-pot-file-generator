const { parse } = require('path')
const { src, dest, watch } = require('gulp')
const log = require('fancy-log')
const wpPot = require('gulp-wp-pot')
const filelog = require('gulp-filelog')

const dir = process.env.WATCHING_DIR || '${WATCHING_DIR}'
const domain = process.env.WP_DOMAIN || 'wordpress'
const mainFile = `${dir}/languages/${domain}.pot`
const glob = [`${dir}/**/*.php`, `!${dir}/vendor/**/*.php`]

function pot() {
    return src(glob)
        .pipe(filelog('Reading'))
        .pipe(wpPot({
            domain: domain,
            relativeTo: dir,
        }))
        .pipe(dest(mainFile))
        .on('end', () => log('POT file written to '
            + parse(mainFile).dir.replace(dir, '').substr(1)
            + '/' + parse(mainFile).base))
}

exports.pot = pot

exports.default = () => {
    pot()
    watch(glob).on('change', (path) => {
        log(`${path} changed!`)
        pot()
    }).on('ready', () => log('Watching PHP files…'))
}
