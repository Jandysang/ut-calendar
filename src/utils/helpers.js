// 补齐前缀
export const pad = (val, len, char = '0') => {
    val = val !== null && val !== undefined ? String(val) : '';
    len = len || 2;
    while (val.length < len) {
        val = `${char}${val}`;
    }
    return val;
};

// 生成GUID
/* eslint-disable no-bitwise */
export const createGuid = () => {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
};

// 页面和页面是否相同(是否是同一页面)
export const pageIsEqualToPage = (aPage, bPage) => {
    if (!aPage && bPage) return false;
    if (aPage && !bPage) return false;
    if (!aPage && !bPage) return true;
    return aPage.month === bPage.month && aPage.year === bPage.year;
};