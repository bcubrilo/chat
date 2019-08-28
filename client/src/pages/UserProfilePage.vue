<template>
  <v-layout>
    <v-row>
      <v-col md="4">
        <v-img
          :src="imageUrl"
          aspect-ratio="1"
          class="grey lighten-2"
          max-width="500"
          max-height="300"
        />
        <div class="text-center">
          <v-dialog v-model="showImageUploadDialog" persistent width="300">
            <template v-slot:activator="{ on }">
              <v-btn color="red lighten-2" dark v-on="on">Change Image</v-btn>
            </template>
            <v-card>
              <v-card-title class="headline" primary-title>Upload new image</v-card-title>
              <v-card-text>
                <v-file-input
                  v-model="uploadedImage1"
                  accept="image/png, image/jpeg, image/bmp"
                  label="Choose image file"
                />
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn color="primary" text @click="uploadImage">Upload</v-btn>
                <v-btn color="primary" text @click="showImageUploadDialog = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
      </v-col>
      <v-col md="8">
        <div>
          <p>{{authUser.name}}</p>
          <p>{{authUser.email}}</p>
          <div v-if="profile != null">
            <div v-if="!showEditDescription">
              <p>{{profile.description}}</p>
              <v-btn @click="editDescription">Edit</v-btn>
            </div>

            <div v-else>
              <v-textarea outlined v-model="profileDescription"></v-textarea>
              <v-btn @click="showEditDescription = !showEditDescription">Cancel</v-btn>
              <v-btn @click="updateDescription">Save</v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "UserProfilePage",
  data: () => ({
    imageUrl: "https://picsum.photos/id/11/500/300",
    showEditDescription: false,
    profileDescription: "",
    showImageUploadDialog: false,
    uploadedImage: {
      path: null,
      content: null
    },
    uploadedImage1: null
  }),
  computed: {
    ...mapState({
      authUser: state => state.auth.user,
      profile: state => state.userProfile.profile
    })
  },
  methods: {
    ...mapActions("userProfile", [
      "getProfile",
      "updateProfile",
      "uploadProfileImage"
    ]),
    updateDescription() {
      this.updateProfile({
        field: "description",
        value: this.profileDescription
      });
      this.showEditDescription = false;
    },
    editDescription() {
      this.showEditDescription = true;
      this.profileDescription =
        this.profile != null ? this.profile.description : "";
    },
    uploadImage() {
      console.log(this.uploadedImage1);
      const data = new FormData();
      data.append("file", this.uploadedImage1);
      console.log(data);
      this.uploadProfileImage(data).then(() => console.log("OK"));
    }
  },
  mounted: function() {
    this.getProfile();
  }
};
</script>