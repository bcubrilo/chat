<template>
  <div v-if="user != undefined" style="padding:20px">
    <template v-if="!$vuetify.breakpoint.smAndDown">
      <v-layout row>
        <v-flex lg4 class="white">
          <v-img src="/images/test-user-image.jpg" height="390" />
        </v-flex>
        <v-flex lg8 style="padding:20px">
          <div class="profile-detail">
            <h4 style="text-align:center">
              {{user.name}}
              <v-icon color="blue">gender-male</v-icon>
              <template v-if="user.gender === 'M'">
                <v-icon color="blue">gender-male</v-icon>
              </template>
              <template v-else>
                <v-icon color="pink">gender-female</v-icon>
              </template>
            </h4>
            <p style="text-align:center">@{{user.username}}</p>
          </div>
          <template v-if="gender != undefined">
            <v-divider />
            <v-row>
              <v-col cols="6">
                <span>Gender: {{ gender }}</span>
              </v-col>
              <v-col cols="6" v-if="interestedGender.length > 0">
                <span>Interested in gender: {{interestedGender }}</span>
              </v-col>
            </v-row>
          </template>

          <template v-if="hasCountry">
            <v-divider></v-divider>
            <div class="profile-detail">{{userCountryName}}</div>
          </template>
          <v-divider></v-divider>
          <div class="profile-detail">
            <v-icon @click="sendMessage">message</v-icon>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex sm12>
          <p class="text-justify">{{user.description}}</p>
        </v-flex>
      </v-layout>
    </template>
    <template v-else>
      <v-card>
        <v-img src="/images/test-user-image.jpg" height="200px" />
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <h4 style="text-align:center">{{user.name}}</h4>
                <p style="text-align:center">@{{user.username}}</p>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item>
            <v-list-item-content>
              <template v-if="gender != undefined">
                <v-row>
                  <v-col cols="6">
                    <span>Gender: {{ gender }}</span>
                  </v-col>
                  <v-col cols="6" v-if="interestedGender.length > 0">
                    <span>Interested in gender: {{interestedGender }}</span>
                  </v-col>
                </v-row>
              </template>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item v-if="hasCountry">
            <v-list-item-icon>
              <v-icon color="indigo">mdi-map-marker</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{userCountryName}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />

          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>
                <v-icon>message</v-icon>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item v-if="user.description != null">
            <v-list-item-content>{{user.description}}</v-list-item-content>
          </v-list-item>
        </v-list>
      </v-card>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
const countryList = require("country-list");
export default {
  name: "UserProfile",
  data: () => ({
    user: Object
  }),
  computed: {
    ...mapGetters({
      getByUsername: "usersModule/getByUsername"
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
    ...mapActions("userModule", ["getUserByUsername"]),
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
</style>