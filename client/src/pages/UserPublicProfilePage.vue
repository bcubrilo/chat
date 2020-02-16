<template>
  <v-row v-if="user != undefined" style="padding:20px">
    <v-col cols="12">
      <h4 style="text-align:center">{{ user.name }}</h4>
      <p style="text-align:center">@{{ user.username }}</p>
    </v-col>
    <v-row>
      <v-col cols="4">
        <v-img :src="userProfileImage(user)" />
      </v-col>
      <v-col cols="8">
        <v-col cols="6">
          <span>{{$t('gender')}}: {{ gender }}</span>
        </v-col>
        <v-col cols="6" v-if="interestedGender.length > 0">
          <span>{{$t('interested-in-gender')}}: {{ interestedGender }}</span>
        </v-col>
        <v-row>
          <v-col cols="1">
            <v-icon color="indigo">mdi-map-marker</v-icon>
          </v-col>
          <v-col cols="11">
            {{ userCountryName }}
          </v-col>
        </v-row>
        <v-row>
          <v-btn @click="sendMessage">
            <v-icon>message</v-icon>
          </v-btn>
        </v-row>
        <v-row v-if="user.description">
          <v-col cols="12">
            {{ user.description }}
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-row>
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
            getByUsername: "usersModule/getByUsername",
            userAvatar: "usersModule/userAvatar",
            userProfileImage:"usersModule/userProfileImage"
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
  </v-row></template
>
