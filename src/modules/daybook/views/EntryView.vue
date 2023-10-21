<template>
  <template v-if="entry">
    <div class="entry-title d-flex justify-content-between p-2">
      <div>
        <span class="text-success fs-3 fw-bold">{{ day }}</span>
        <span class="m-1 fs-3">Mayo</span>
        <span span class="mx-2 fs-4 fw-lign"> {{ yearDay }}</span>
      </div>

      <div>
        <input v-show="false" type="file" @change="onSelectedImage" ref="imageSelector" />

        <button v-if="entry.id" @click="removeEntry()" class="btn btn-danger mx-2">
          Borrar
          <i class="fa fa-trash-alt"></i>
        </button>

        <button @click="onSelectImage" class="btn btn-primary">
          Subir foto
          <i class="fa fa-upload"></i>
        </button>
      </div>
    </div>
    <hr />

    <div class="d-flex flex-column px-3 h-75">
      <textarea v-model="entry.text" placeholder="¿Qué sucedió hoy?"></textarea>
    </div>

    <img v-if="entry.picture && !localImage" :src="entry.picture" alt="entry-picture" class="img-thumbnail" />

    <img v-if="localImage" :src="localImage" alt="entry-picture" class="img-thumbnail" />
  </template>

  <Fab icon="fa-save" @on:click="saveEntry()" />
</template>

<script>
import Swal from "sweetalert2";
import uploadImage from "../helper/uploadImage";
import { defineAsyncComponent } from "vue";
import { mapGetters, mapActions } from "vuex"; // computed
import getDayMonthYear from "../helper/getDayMonthYear";

export default {
  name: "EntryView",
  props: { id: { type: String, required: true } },
  components: {
    Fab: defineAsyncComponent(() => import("../components/FabComponent.vue")),
  },
  data() {
    return { entry: null, localImage: null, file: null };
  },
  computed: {
    ...mapGetters("journal", ["getEntryById"]),
    day() {
      const { day } = getDayMonthYear(this.entry.date);
      return day;
    },
    month() {
      const { month } = getDayMonthYear(this.entry.date);
      return month;
    },
    yearDay() {
      const { year } = getDayMonthYear(this.entry.date);
      return year;
    },
  },
  methods: {
    ...mapActions("journal", ["updateEntry", "createEntry", "deleteEntry"]),

    async saveEntry() {
      new Swal({ title: "Espere por favor", allowOutsideClick: false });
      Swal.showLoading();

      const picture = await uploadImage(this.file);
      this.entry.picture = picture;

      if (this.entry.id) {
        await this.updateEntry(this.entry);
      } else {
        const id = await this.createEntry(this.entry);

        this.$router.push({
          name: "entry",
          params: { id: id },
        });
      }

      this.file = null;
      Swal.fire("Guardado", "Entrada registrada con éxito", "success");
    },
    async removeEntry() {
      const { isConfirmed } = await Swal.fire({
        title: "¿Está seguro?",
        text: "Una vez borrado, no se puede recuperar",
        showDenyButton: true,
        confirmButtonText: "Si, estoy seguro",
      });

      if (isConfirmed) {
        Swal.fire({ title: "Espere por favor", allowOutsideClick: false });
        Swal.showLoading();

        this.deleteEntry(this.entry);
        await this.$router.push({ name: "no-entry" });

        Swal.fire("Eliminado", "", "success");
      }
    },
    loadEntry() {
      let entry;

      if (this.id === "new") {
        entry = {
          text: "",
          date: new Date().getTime(),
        };
      } else {
        entry = this.getEntryById(this.id);
        if (!entry) return this.$router.push({ name: "no-entry" });
      }

      this.entry = entry;
    },
    onSelectedImage(event) {
      const file = event.target.files[0];
      if (!file) {
        this.localImage = null;
        this.file = null;
        return;
      }

      this.file = file;

      const fr = new FileReader();
      fr.onload = () => (this.localImage = fr.result);
      fr.readAsDataURL(file);
    },
    onSelectImage() {
      this.$refs.imageSelector.click();
    },
  },
  created() {
    this.loadEntry();
  },
  // updated:
  watch: {
    // mira si cambia una prop
    id() {
      this.loadEntry();
    },
  },
};
</script>

<style lang="scss" scoped>
textarea {
  font-size: 20px;
  border: none;
  height: 100%;

  &:focus {
    outline: none;
  }
}

img {
  width: 200px;
  position: fixed;
  bottom: 150px;
  right: 20px;
  box-shadow: 0px 5px 10px rgba($color: #000000, $alpha: 0.2);
}
</style>
