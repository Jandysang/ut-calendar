const { path } = require('@vuepress/utils')

module.exports = {
    plugins: [
        [
            '@vuepress/register-components',
            {
                componentsDir: path.resolve(__dirname, '../../packages'),
                componentsPatterns: ['*/src/index.vue'],
                getComponentName: (filename) => {
                    let _name = path.trimExt(filename.replace(/\/src\/index.vue/gi, ''))
                    return 'ut-' + _name.toLowerCase()
                }
            },
        ],
    ],

}