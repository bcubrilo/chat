<template>
  <v-dialog v-model="showDialog" persistent width="500">
    <template v-slot:activator="{ on }">
      <v-btn icon class="mr-3" v-on="on">
        <v-icon>edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline" primary-title>
        Upload new image
      </v-card-title>
      <v-card-text>
        <div v-if="message.length > 0" style="color:red">
          {{ message }}
        </div>
        <cropper
          v-if="image != null"
          classname="cropper"
          :src="image"
          @change="change"
          :stencil-props="{
            aspectRatio: 12 / 12
          }"
        ></cropper>
        <v-file-input
          v-model="uploadedImage"
          accept="image/png, image/jpeg, image/bmp"
          label="Choose image file"
          @change="imageChanged"
        />
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-btn color="primary" :disabled="image == null" text @click="save"
          >Save</v-btn
        >
        <v-btn color="primary" text @click="showDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { Cropper, RectangleStencil } from "vue-advanced-cropper";

export default {
  data: () => ({
    image: null,
    imageBase64: "",
    uploadedImage: null,
    showDialog: false,
    cropedImage: null,
    canvas: null,
    message: ""
  }),
  components: {
    Cropper,
    RectangleStencil
  },

  computed: {},
  methods: {
    imageChanged() {
      if (this.uploadedImage != null) {
        var reader = new FileReader();
        reader.onload = e => {
          this.image = e.target.result;
        };
        reader.readAsDataURL(this.uploadedImage);
      } else {
        this.image = null;
      }
    },
    save() {
      console.log("Save image", this.cropedImage);
      this.canvas.toBlob(blob => {
        if (blob.size > 150000) {
          this.message = "Max image size is 150KB, current size " + blob.size;
          return;
        }
        this.$emit("croped", blob);
        this.showDialog = false;
      });
    },
    change({ coordinates, canvas }) {
      this.canvas = canvas;
    }
  }
};
</script>
<style scoped>
.cropper {
  max-width: 500px;
  max-height: 400px;
}
</style>
