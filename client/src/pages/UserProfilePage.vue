<template>
  <v-layout>
    <v-row>
      <v-col md="4">
        <v-img :src="profileImageUrl" aspect-ratio="1"></v-img>
        <image-cropper @croped="uploadImage" />
        <v-dialog v-model="confirmDeleteImageDialog" max-width="290">
          <template v-slot:activator="{ on }">
            <v-btn icon class="mr-3" v-on="on">
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-text>Are you sure?</v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="green darken-1" text @click="confirmDeleteImageDialog = false">No</v-btn>

              <v-btn color="green darken-1" text @click="deleteImage">Yes</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col md="8">
        <div>
          <p>{{ authUser.name }}</p>
          <p>{{ authUser.email }}</p>
          <div v-if="profile != null">
            <v-radio-group row v-model="profile.gender" @change="genderChanged">
              <v-radio label="Masculine " value="M"></v-radio>
              <v-radio label="Feminine " value="F"></v-radio>
            </v-radio-group>

            <p>Intersted in gender</p>
            <v-radio-group
              row
              v-model="profile.interestedInGender"
              @change="interestedInGenderChanged"
            >
              <v-radio label="Masculine " value="M"></v-radio>
              <v-radio label="Feminine " value="F"></v-radio>
              <v-radio label="Both " value="B"></v-radio>
            </v-radio-group>
            <p>Country</p>
            <v-combobox
              v-model="userCountry"
              :items="countries"
              item-text="name"
              item-value="code"
              label="Select country"
              v-on:change="changedCountry"
            ></v-combobox>
            <div v-if="!showEditDescription">
              <p>{{ profile.description }}</p>
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
import AvatarCropper from "vue-avatar-cropper";
import { mapState, mapActions } from "vuex";
import { Cropper } from "vue-advanced-cropper";
import DefaultLayout from "../layouts/DefaultLayout";
const countryList = require("country-list");

export default {
  name: "UserProfilePage",
  components: { AvatarCropper },
  data: () => ({
    imageUrl:
      "http://localhost:3030/images/53_a95dcc73e6d09630f7ddba20de9e879f.jpg",
    showEditDescription: false,
    profileDescription: "",
    showImageUploadDialog: false,
    uploadedImage: null,
    gender: "M",
    countries: [],
    userCountry: { code: "", name: "" },
    userAvatar: undefined,
    avatarLabels: {
      submit: "Submit",
      cancel: "Cancel"
    },
    confirmDeleteImageDialog: false
  }),
  created() {
    this.$emit("update:layout", DefaultLayout);
  },
  computed: {
    ...mapState({
      authUser: state => state.auth.user,
      profile: state => state.userProfile.profile
    }),
    profileImageUrl() {
      if (this.profile != null)
        return (
          "http://localhost:3030/images/profiles/" +
          this.profile.profileImageUrl
        );
      else return "";
    },
    uploadImageButtonDisabled() {
      return this.uploadedImage == null;
    }
  },
  methods: {
    ...mapActions("userProfile", [
      "getProfile",
      "updateProfile",
      "uploadProfileImage",
      "deleteProfileImage"
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
    uploadImage(image) {
      console.log("Croped image:", image);
      const data = new FormData();
      data.append("file", image);
      this.uploadProfileImage(data).then(() => console.log("OK"));
    },
    genderChanged() {
      console.log("Gender " + this.profile.gender);
      this.updateProfile({
        field: "gender",
        value: this.profile.gender
      });
    },
    interestedInGenderChanged() {
      this.updateProfile({
        field: "interestedInGender",
        value: this.profile.interestedInGender
      });
    },
    changedCountry() {
      if (countryList.getName(this.profile.countryCode).length > 0) {
        this.updateProfile({
          field: "countryCode",
          value: this.userCountry.code
        });
      }
    },
    handleUploaded(resp) {
      this.userAvatar = resp.relative_url;
    },
    handleUploading(form, xhr) {
      const data = new FormData();
      data.append("file", form.image.currentSrc);
      console.log(form);
      console.log(this.uploadedImage);
      console.log(xhr);
      this.uploadProfileImage(form).then(() => console.log("OK"));
    },
    deleteImage() {
      this.confirmDeleteImageDialog = false;
      this.deleteProfileImage();
    }
  },
  mounted: function() {
    this.getProfile();
    if (this.profile != null)
      if (this.profile.countryCode.length > 0) {
        this.userCountry = {
          code: this.profile.countryCode,
          name: countryList.getName(this.profile.countryCode)
        };
      }
    this.countries = countryList.getData();
  }
};
</script>
