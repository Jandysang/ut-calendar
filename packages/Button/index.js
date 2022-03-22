// 导入组件，组件必须声明 name
import UtButton from './src'

// 为组件提供 install 安装方法，供按需引入
UtButton.install = function (Vue) {
  Vue.component(UtButton.name, UtButton)
}

// 导出组件
export default UtButton