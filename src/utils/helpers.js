import _ from 'lodash';
import { isObject } from './tool';

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

// 判断是不是一个有值的数组
export const arrayHasItems = array => _.isArrayLikeObject(array) && array.length;

export const mixinOptionalProps = (source, target, props) => {
    const assigned = [];
    props.forEach(p => {
        const name = p.name || p.toString();
        const mixin = p.mixin;
        const validate = p.validate;
        if (Object.prototype.hasOwnProperty.call(source, name)) {
            const value = validate ? validate(source[name]) : source[name];
            target[name] = mixin && isObject(value) ? { ...mixin, ...value } : value;
            assigned.push(name);
        }
    });
    return {
        target,
        assigned: assigned.length ? assigned : null,
    };
};

export function hash(str) {
    let hashcode = 0;
    let i = 0;
    let chr;
    if (str.length === 0) return hashcode;
    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hashcode = (hashcode << 5) - hashcode + chr;
        hashcode |= 0; // Convert to 32bit integer
    }
    return hashcode;
}

export const addPages = ({ month, year }, count) => {
    const incr = count > 0 ? 1 : -1;
    for (let i = 0; i < Math.abs(count); i++) {
        month += incr;
        if (month > 12) {
            month = 1;
            year++;
        } else if (month < 1) {
            month = 12;
            year--;
        }
    }
    return {
        month,
        year,
    };
};

export const pageIsValid = page => !!(page && page.month && page.year);
export const pageIsBeforePage = (page, comparePage) => {
    if (!pageIsValid(page) || !pageIsValid(comparePage)) return false;
    if (page.year === comparePage.year) return page.month < comparePage.month;
    return page.year < comparePage.year;
  };

export const pageIsAfterPage = (page, comparePage) => {
    if (!pageIsValid(page) || !pageIsValid(comparePage)) return false;
    if (page.year === comparePage.year) return page.month > comparePage.month;
    return page.year > comparePage.year;
  };