<template>
  <button class="btn btn-primary">
    <i @click="cg" :class="`fa fa-2x ${icon}`"></i>
    <!-- <i class="fa fa-bookmark" aria-hidden="true"></i> -->
  </button>
</template>

<script>
export default {
  props: { icon: { type: String, default: "fa-plus" } },
};
</script>

<style lang="scss" scoped>
button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 80px;
  height: 80px;
  border-radius: 100%;
}
</style>
