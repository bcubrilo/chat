<template>
  <v-layout>
    <v-row>
      <v-col md="4">
        <v-img
          :src="profileImageUrl"
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
                  v-model="uploadedImage"
                  accept="image/png, image/jpeg, image/bmp"
                  label="Choose image file"
                />
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn
                  color="primary"
                  :disabled="uploadImageButtonDisabled"
                  text
                  @click="uploadImage"
                >Upload</v-btn>
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
const countryList = require("country-list");

export default {
  name: "UserProfilePage",
  data: () => ({
    imageUrl:
      "http://localhost:3030/images/53_a95dcc73e6d09630f7ddba20de9e879f.jpg",
    showEditDescription: false,
    profileDescription: "",
    showImageUploadDialog: false,
    uploadedImage: null,
    gender: "M",
    countries: [],
    userCountry: { code: "", name: "" }
  }),
  computed: {
    ...mapState({
      authUser: state => state.auth.user,
      profile: state => state.userProfile.profile
    }),
    profileImageUrl() {
      if (this.profile != null)
        return "http://localhost:3030/images/" + this.profile.profileImageUrl;
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
      const data = new FormData();
      data.append("file", this.uploadedImage);
      this.uploadProfileImage(data).then(() => console.log("OK"));
      this.showImageUploadDialog = false;
      this.uploadedImage = null;
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
    }
  },
  mounted: function() {
    this.getProfile();
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