<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          append-icon="search"
          class="mx-4"
          flat
          hide-details
          label="Search for people"
          solo-inverted
          v-model="searchPhrase"
          @keyup.enter.native="searchAgain"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>Results</v-col>
    </v-row>
    <v-row>
      <v-col v-for="(user, i) in users" :key="i" cols="auto" lg="3" sm="6" xs="12">
        <user-card :user="user" :name="user.name" bottomNav="true" color="pink" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["keywords"],
  name: "Search",
  data: () => ({
    searchPhrase: "",
    isSearchActive: false,
    users: null
  }),
  computed: {
    ...mapState({
      searchedUsers: state => state.usersModule.searchedUsers
    })
  },
  mounted() {
    this.searchPhrase = this.keywords;
    this.searchUsers();
  },
  methods: {
    ...mapActions("usersModule", ["search"]),
    searchUsers() {
      this.isSearchActive = true;
      this.search({ phrase: this.searchPhrase }).then(r => {
        this.users = r;
      });
    },
    searchAgain() {
      this.$router.push({
        name: "search",
        params: { keywords: this.searchPhrase }
      });
      this.searchUsers();
    },
    sendMessage(username) {
      this.$router.push({ name: "chat", params: { peerUsername: username } });
    }
  }
};
</script>