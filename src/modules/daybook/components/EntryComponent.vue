<template>
  <div
    @click="$router.push({ name: 'entry', params: { id: 10 } })"
    class="entry-container mb-3 pointer p-2"
  >
    <!-- titulo -->
    <div class="entry-title d-flex">
      <span class="text-success fs-5 fw-bold">15</span>
      <span class="mx-1 fs-5">Julio</span>
      <span class="mx-2 fw-ligth">2021, Jueves</span>
    </div>

    <div class="entry-description">
      Aute officia consequat nostrud pariatur occaecat cupidatat labore officia
      id cillum deserunt quis quis. Labore reprehenderit cillum reprehenderit
      reprehenderit dolore excepteur mollit cillum minim officia dolor et.
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.entry-container {
  border-bottom: 1px solid #2c3e50;
  transition: 0.2s all ease-in;

  &:hover {
    background-color: lighten($color: rgb(100, 100, 100), $amount: 45);
    transition: 0.2s all ease-in;
  }
}

.entry-description {
  font-size: 12px;
}
</style>
