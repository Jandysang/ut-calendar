import toDate from 'date-fns-tz/toDate';

import _ from 'lodash';
import defaultLocales from './defaults/locales';
import { isObject, isDate } from './tool';

import { pad } from './helpers';

const PATCH_KEYS = {
    1: ['year', 'month', 'day', 'hours', 'minutes', 'seconds', 'milliseconds'],
    2: ['year', 'month', 'day'],
    3: ['hours', 'minutes', 'seconds', 'milliseconds'],
};

const daysInWeek = 7;

export function resolveConfig(config, locales) {
    // 获取检测到的区域设置字符串
    const detLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
    // 解析区域设置id
    let id;
    if (_.isString(config)) {
        id = config;
    } else if (_.has(config, 'id')) {
        id = config.id;
    }
    id = (id || detLocale).toLowerCase();
    const localeKeys = Object.keys(locales);
    const validKey = k => localeKeys.find(lk => lk.toLowerCase() === k);
    id = validKey(id) || validKey(id.substring(0, 2)) || detLocale;
    // 添加回退和扩展默认区域设置以防止重复更新循环
    const defLocale = { ...locales['en-IE'], ...locales[id], id };
    // 使用提供的配置分配或合并默认值
    config = isObject(config) ? _.defaultsDeep(config, defLocale) : defLocale;
    // 返回解析配置
    return config;
}

export default class Locale {
    constructor(config, { locales = defaultLocales, timezone } = {}) {
        const { id, firstDayOfWeek, masks } = resolveConfig(config, locales);
        this.id = id;
        this.daysInWeek = daysInWeek;
        this.firstDayOfWeek = _.clamp(firstDayOfWeek, 1, daysInWeek);
        this.masks = masks;
        this.timezone = timezone || undefined;
        this.dayNames = this.getDayNames('long');
        this.dayNamesShort = this.getDayNames('short');
        this.dayNamesShorter = this.dayNamesShort.map(s => s.substring(0, 2));
        this.dayNamesNarrow = this.getDayNames('narrow');
        this.monthNames = this.getMonthNames('long');
        this.monthNamesShort = this.getMonthNames('short');
        this.amPm = ['am', 'pm'];
        this.monthData = {};
    }

    getDayNames(length) {
        const dtf = new Intl.DateTimeFormat(this.id, {
            weekday: length,
            timeZone: this.timezone,
        });
        return this.getWeekdayDates(1).map(d => dtf.format(d));
    }

    getWeekdayDates(firstDayOfWeek = this.firstDayOfWeek) {
        const dates = [];
        const year = 2020;
        const month = 1;
        const day = 5 + firstDayOfWeek - 1;
        for (let i = 0; i < daysInWeek; i++) {
            dates.push(
                this.getDateFromParts({
                    year,
                    month,
                    day: day + i,
                    hours: 12,
                }),
            );
        }
        return dates;
    }

    getDateFromParts(parts) {
        if (!parts) return null;
        const d = new Date();
        const {
            year = d.getFullYear(),
            month = d.getMonth() + 1,
            day = d.getDate(),
            hours: hrs = 0,
            minutes: min = 0,
            seconds: sec = 0,
            milliseconds: ms = 0,
        } = parts;
        if (this.timezone) {
            const dateString = `${pad(year, 4)}-${pad(month, 2)}-${pad(day, 2)}T${pad(
                hrs,
                2,
            )}:${pad(min, 2)}:${pad(sec, 2)}.${pad(ms, 3)}`;
            return toDate(dateString, { timeZone: this.timezone });
        }
        return new Date(year, month - 1, day, hrs, min, sec, ms);
    }

    getMonthNames(length) {
        const dtf = new Intl.DateTimeFormat(this.id, {
            month: length,
            timezome: 'UTC',
        });
        return this.getMonthDates().map(d => dtf.format(d));
    }

    getMonthDates(year = 2000) {
        const dates = [];
        for (let i = 0; i < 12; i++) {
            dates.push(new Date(year, i, 15));
        }
        return dates;
    }

    normalizeDate(d, config = {}) {
        debugger;
        let result = null;
        let { type, fillDate } = config;
        const { mask, patch, time } = config;
        const auto = type === 'auto' || !type;
        if (_.isNumber(d)) {
            type = 'number';
            result = new Date(+d);
        } else if (_.isString(d)) {
            type = 'string';
            result = d ? this.parse(d, mask || 'iso') : null;
        } else if (isObject(d)) {
            type = 'object';
            result = this.getDateFromParts(d);
        } else {
            type = 'date';
            result = isDate(d) ? new Date(d.getTime()) : null;
        }

        if (result && patch) {
            fillDate = fillDate == null ? new Date() : this.normalizeDate(fillDate);
            const parts = {
                ...this.getDateParts(fillDate),
                ..._.pick(this.getDateParts(result), PATCH_KEYS[patch]),
            };
            result = this.getDateFromParts(parts);
        }
        if (auto) config.type = type;
        if (result && !isNaN(result.getTime())) {
            if (time) {
                result = this.adjustTimeForDate(result, {
                    timeAdjust: time,
                });
            }
            return result;
        }
        return null;
    }

    normalizeDates(dates, opts) {
        debugger;
        console.log(dates, opts);
    }

    // getDateParts(date, timezone = this.timezone) {
    //     debugger;
    //     console.log(date, timezone);
    // }
}