<template>
  <v-container grid-list-xl fluid>
    <v-layout row wrap>
      <v-flex sm12>
        <v-text-field
          append-icon="search"
          class="mx-4"
          flat
          hide-details
          label="Search for people"
          solo-inverted
          v-model="searchPhrase"
          @keyup.enter.native="searchUsers"
        ></v-text-field>
      </v-flex>
    </v-layout>
    <v-layout row wrap v-if="isSearchActive">
      <v-flex sm12>
        <h5>Search results</h5>
      </v-flex>
      <v-flex lg3 sm12 v-for="(user, i) in searchedUsers" :key="i">
        <user-card :user="user" :name="user.name" bottomNav="true" color="pink" />
      </v-flex>
    </v-layout>
    <v-layout row wrap v-else>
      <v-flex sm12>
        <h5>Recent members</h5>
      </v-flex>
      <v-flex lg3 sm12 v-for="(user, i) in mostRecentUsers" :key="i">
        <user-card :user="user" :name="user.name" bottomNav="true" color="pink" />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "HomePage",
  data: () => ({
    isSearchActive: false,
    searchPhrase: ""
  }),
  computed: {
    ...mapState({
      mostRecentUsers: state => state.usersModule.mostRecentUsers,
      searchedUsers: state => state.usersModule.searchedUsers
    })
  },
  mounted: function() {
    if (this.mostRecentUsers == null) {
      this.getMostRecentUsers();
    }
  },
  methods: {
    ...mapActions("usersModule", ["getMostRecentUsers", "search"]),
    searchUsers() {
      this.isSearchActive = true;
      this.search({ phrase: this.searchPhrase });
    },
    sendMessage(username) {
      console.log("Sending message to : " + username);
      this.$router.push({ name: "chat", params: { peerUsername: username } });
    }
  }
};
</script>