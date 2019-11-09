<template>
  <div v-if="user != undefined" style="padding:20px">
    <template v-if="!$vuetify.breakpoint.smAndDown">
      <v-layout row>
        <v-flex lg4 class="white">
          <v-img src="/images/test-user-image.jpg" height="390" />
        </v-flex>
        <v-flex lg8 style="padding:20px">
          <div class="profile-detail">
            <h4>
              {{user.name}}
              <v-icon color="blue">gender-male</v-icon>
              <template v-if="user.gender === 'M'">
                <v-icon color="blue">gender-male</v-icon>
              </template>
              <template v-else>
                <v-icon color="pink">gender-female</v-icon>
              </template>
            </h4>
          </div>
          <v-divider></v-divider>
          <div class="profile-detail">Drzava</div>
          <v-divider />
          <div class="profile-detail">Jezici</div>
          <v-divider></v-divider>
          <div class="profile-detail">
            <v-icon>message</v-icon>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex sm12>
          <p class="text-justify">
            There are many variations of passages of Lorem Ipsum available, but the
            majority have suffered alteration in some form, by injected humour, or
            randomised words which don't look even slightly believable. If you are
            going to use a passage of Lorem Ipsum, you need to be sure there isn't
            anything embarrassing hidden in the middle of text. All the Lorem Ipsum
            generators on the Internet tend to repeat predefined chunks as necessary,
            making this the first true generator on the Internet. It uses a dictionary of
            over 200 Latin words, combined with a handful of model sentence structures, to
            generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition,
            injected humour, or non-characteristic words etc.
          </p>
        </v-flex>
      </v-layout>
    </template>
    <template v-else>
      <v-card>
        <v-img src="/images/test-user-image.jpg" height="200px" />
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title v-text="user.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>country</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider />
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>languages</v-list-item-title>
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
        </v-list>
      </v-card>
    </template>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "UserProfile",
  data: () => ({
    user: Object
  }),
  computed: {
    ...mapGetters({
      getByUsername: "usersModule/getByUsername"
    })
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
    ...mapActions("userModule", ["getUserByUsername"])
  }
};
</script>
<style scoped>
.profile-detail {
  padding: 10px 0;
}
</style>