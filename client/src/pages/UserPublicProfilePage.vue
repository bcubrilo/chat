<template>
  <v-row v-if="user != undefined" style="padding:20px">
    <v-col cols="12">
      <h4 style="text-align:center">{{ user.name }}</h4>
      <p style="text-align:center">@{{ user.username }}</p>
    </v-col>

    <v-col lg="3" md="4" sm="12" xs="12">
      <v-img :src="userProfileImage(user)" />
    </v-col>
    <v-col lg="9" md="8" sm="12" xs="12">
      <router-link :to="{ name: 'user-posts', params: { username: user.username }}">{{$t('posts')}}</router-link>
      <div>
        <label class="label">{{$t('gender')}}</label>
        <span>{{ gender }}</span>
      </div>
      <div v-if="interestedGender.length > 0">
        <label class="label">{{$t('interested-in-gender')}}</label>
        <span>{{ interestedGender }}</span>
      </div>
      <div>
        <label class="label">{{$t('country')}}</label>
        {{ userCountryName }}
      </div>
      <div>
        <label class="label">{{$t('languages')}}</label>
        {{languages}}
      </div>
      <label class="label">{{$t('about-me')}}</label>
      <div v-if="user.description">{{ user.description }}</div>
      <div style="margin-top:20px;">
        <v-btn @click="sendMessage">
          <v-icon>message</v-icon>
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
const countryList = require("country-list");
import ISO6391 from "iso-639-1";
export default {
  name: "UserProfile",
  data: () => ({
    user: Object
  }),
  computed: {
    ...mapGetters({
      getByUsername: "usersModule/getByUsername",
      userAvatar: "usersModule/userAvatar",
      userProfileImage: "usersModule/userProfileImage"
    }),
    userCountryName() {
      if (this.user != undefined && this.user.countryCode != undefined) {
        return countryList.getName(this.user.countryCode);
      }
    },
    hasCountry() {
      return this.user != undefined && this.user.countryCode != undefined;
    },
    gender() {
      if (this.user != undefined) {
        return this.user.gender === "M" ? "Male" : "Female";
      }
    },
    interestedGender() {
      if (this.user !== undefined) {
        var res = "";
        switch (this.user.interestedInGender) {
          case "M":
            res = "Male";
            break;
          case "F":
            res = "Female";
            break;
          case "B":
            res = "Male and Female";
            break;
          default:
            break;
        }
        return res;
      }
    },
    languages() {
      var langs = "";

      if (this.user.languageCode && this.user.languageCode.length > 0) {
        var languageCodes = this.user.languageCode.split(",");
        var tmp = ISO6391.getLanguages(languageCodes);
        langs = this.$_.map(tmp, "name").join(", ");
      }
      return langs;
    }
  },
  mounted: function() {
    let user = this.getByUsername(this.$route.params.username);
    if (user === undefined) {
      this.getUserByUsername({
        username: this.$route.params.username
      });
    }
    user = this.getByUsername(this.$route.params.username);
    this.user = user;
  },
  methods: {
    ...mapActions("usersModule", ["getUserByUsername"]),
    sendMessage() {
      if (this.user != undefined)
        this.$router.push({
          name: "chat",
          params: { peerUsername: this.user.username }
        });
    }
  }
};
</script>
<style scoped>
.profile-detail {
  padding: 10px 0;
}
.label {
  display: block;
  font-size: 12px;
  color: darkgrey;
  margin: 10px 0;
}
</style>
