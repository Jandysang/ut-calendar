import { defineAsyncComponent } from 'vue'

export const layoutComponents = {
  "404": defineAsyncComponent(() => import("/Users/sangyoutao/minespace/vue-cli-apps/utui/node_modules/@vuepress/theme-default/lib/client/layouts/404.vue")),
  "Layout": defineAsyncComponent(() => import("/Users/sangyoutao/minespace/vue-cli-apps/utui/node_modules/@vuepress/theme-default/lib/client/layouts/Layout.vue")),
}
