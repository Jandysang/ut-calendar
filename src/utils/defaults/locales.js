import _ from 'lodash';

const locales = {
    //  阿拉伯
    ar: { dow: 7, L: 'D/\u200FM/\u200FYYYY' },
    // 保加利亚
    bg: { dow: 2, L: 'D.MM.YYYY' },
    // 加泰罗尼亚
    ca: { dow: 2, L: 'DD/MM/YYYY' },
    // 中国
    'zh-CN': { dow: 2, L: 'YYYY/MM/DD' },
    // 中国台湾
    'zh-TW': { dow: 1, L: 'YYYY/MM/DD' },
    // 克罗地亚
    hr: { dow: 2, L: 'DD.MM.YYYY' },
    // 捷克
    cs: { dow: 2, L: 'DD.MM.YYYY' },
    // 丹麦
    da: { dow: 2, L: 'DD.MM.YYYY' },
    // 荷兰
    nl: { dow: 2, L: 'DD-MM-YYYY' },
    // 美国（英文）
    'en-US': { dow: 1, L: 'MM/DD/YYYY' },
    // 澳大利亚（英文）
    'en-AU': { dow: 2, L: 'DD/MM/YYYY' },
    // 加拿大（英文）
    'en-CA': { dow: 1, L: 'YYYY-MM-DD' },
    // 英国（英文）
    'en-GB': { dow: 2, L: 'DD/MM/YYYY' },
    // 爱尔兰（英文）
    'en-IE': { dow: 2, L: 'DD-MM-YYYY' },
    // 新西兰（英文）
    'en-NZ': { dow: 2, L: 'DD/MM/YYYY' },
    // 南非（英文）
    'en-ZA': { dow: 1, L: 'YYYY/MM/DD' },
    // 通过
    eo: { dow: 2, L: 'YYYY-MM-DD' },
    // 爱沙尼亚
    et: { dow: 2, L: 'DD.MM.YYYY' },
    // 芬兰
    fi: { dow: 2, L: 'DD.MM.YYYY' },
    // 法国
    fr: { dow: 2, L: 'DD/MM/YYYY' },
    // 加拿大（法语）
    'fr-CA': { dow: 1, L: 'YYYY-MM-DD' },
    // 瑞士（法语）
    'fr-CH': { dow: 2, L: 'DD.MM.YYYY' },
    // 德国
    de: { dow: 2, L: 'DD.MM.YYYY' },
    // 希伯来
    he: { dow: 1, L: 'DD.MM.YYYY' },
    // 印度尼西亚
    id: { dow: 2, L: 'DD/MM/YYYY' },
    // 意大利
    it: { dow: 2, L: 'DD/MM/YYYY' },
    // 日本
    ja: { dow: 1, L: 'YYYY年M月D日' },
    // 韩国
    ko: { dow: 1, L: 'YYYY.MM.DD' },
    // 拉脱维亚
    lv: { dow: 2, L: 'DD.MM.YYYY' },
    // 立陶宛
    lt: { dow: 2, L: 'DD.MM.YYYY' },
    // 马其顿
    mk: { dow: 2, L: 'D.MM.YYYY' },
    // 挪威
    nb: { dow: 2, L: 'D. MMMM YYYY' },
    nn: { dow: 2, L: 'D. MMMM YYYY' },
    // 波兰
    pl: { dow: 2, L: 'DD.MM.YYYY' },
    // 葡萄牙
    pt: { dow: 2, L: 'DD/MM/YYYY' },
    // 罗马尼亚
    ro: { dow: 2, L: 'DD.MM.YYYY' },
    // 俄罗斯
    ru: { dow: 2, L: 'DD.MM.YYYY' },
    // 斯洛伐克
    sk: { dow: 2, L: 'DD.MM.YYYY' },
    // 西班牙
    'es-ES': { dow: 2, L: 'DD/MM/YYYY' },
    // 墨西哥（西班牙语）
    'es-MX': { dow: 2, L: 'DD/MM/YYYY' },
    // 瑞典
    sv: { dow: 2, L: 'YYYY-MM-DD' },
    // 泰国
    th: { dow: 1, L: 'DD/MM/YYYY' },
    // 土耳其
    tr: { dow: 2, L: 'DD.MM.YYYY' },
    // 乌克兰
    uk: { dow: 2, L: 'DD.MM.YYYY' },
    // 越南
    vi: { dow: 2, L: 'DD/MM/YYYY' },
};
locales.en = locales['en-US'];
locales.es = locales['es-ES'];
locales.no = locales.nb;
locales.zh = locales['zh-CN'];

// 从缩写重新映射到直观的属性名称
_.toPairs(locales).forEach(([id, { dow, L }]) => {
    locales[id] = {
        id,
        firstDayOfWeek: dow,
        masks: { L },
    };
});
export default locales;
