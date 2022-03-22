<template>
  <div class="ut-button">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ut-button',
  props: {
    type: String
  }
}
</script>

<style scoped>
  .ut-button {
      display: inline-block;
      padding: 3px 6px;
      background: #000;
      color: #fff;
  }
</style>