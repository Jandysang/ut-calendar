import _ from 'lodash';

export const getType = value => Object.prototype.toString.call(value).slice(8, -1);
export const isObject = value => getType(value) === 'Object';

export const hasAny = (obj, props) => _.some(props, p => _.has(obj, p));

export const isDate = value => _.isDate(value) && !isNaN(value.getTime());