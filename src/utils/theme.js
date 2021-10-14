import _ from 'lodash';
import { isObject, hasAny } from './tool';

const targetProps = ['base', 'start', 'end', 'startEnd'];
const displayProps = [
    'class',
    'contentClass',
    'style',
    'contentStyle',
    'color',
    'fillMode',
];
const defConfig = {
    color: 'blue',
    isDark: false,
    highlight: {
        base: { fillMode: 'light' },
        start: { fillMode: 'solid' },
        end: { fillMode: 'solid' },
    },
    dot: {
        base: { fillMode: 'solid' },
        start: { fillMode: 'solid' },
        end: { fillMode: 'solid' },
    },
    bar: {
        base: { fillMode: 'solid' },
        start: { fillMode: 'solid' },
        end: { fillMode: 'solid' },
    },
    content: {
        base: {},
        start: {},
        end: {},
    },
};

export default class Theme {
    constructor(config) {
        Object.assign(this, defConfig, config);
    }

    // 将属性配置规范化为属性定义的结构
    normalizeAttr({ config, type }) {
        let rootColor = this.color;
        let root = {};
        // 获取规范化的根配置
        const normAttr = this[type];
        if (config === true || _.isString(config)) {
            // 为布尔或字符串指定默认颜色
            rootColor = _.isString(config) ? config : rootColor;
            // 设置默认根目录
            root = { ...normAttr };
        } else if (isObject(config)) {
            if (hasAny(config, targetProps)) {
                // 混合目标配置
                root = { ...config };
            } else {
                // 混合显示配置
                root = {
                    base: { ...config },
                    start: { ...config },
                    end: { ...config },
                };
            }
        } else {
            return null;
        }
        // Fill in missing targets
        _.defaults(root, { start: root.startEnd, end: root.startEnd }, normAttr);
        // Normalize each target
        _.toPairs(root).forEach(([targetType, targetConfig]) => {
            let targetColor = rootColor;
            if (targetConfig === true || _.isString(targetConfig)) {
                targetColor = _.isString(targetConfig) ? targetConfig : targetColor;
                root[targetType] = { color: targetColor };
            } else if (isObject(targetConfig)) {
                if (hasAny(targetConfig, displayProps)) {
                    root[targetType] = { ...targetConfig };
                } else {
                    root[targetType] = {};
                }
            }
            // Set the theme color if it is missing
            if (!_.has(root, `${targetType}.color`)) {
                _.set(root, `${targetType}.color`, targetColor);
            }
        });
        return root;
    }
}