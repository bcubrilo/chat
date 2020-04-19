<template>
  <v-container grid-list-xl fluid>
    <v-row>
      <v-col sm="12">
        <v-text-field
          append-icon="search"
          flat
          hide-details
          :label="searchForPeopleLabel"
          solo-inverted
          v-model="searchPhrase"
          @keyup.enter.native="searchUsers"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col sm="12">
        <h5 v-if="isSearchActive">{{ $t("search-results") }}</h5>
        <h5 v-else>{{$t('recent-members')}}</h5>
      </v-col>
    </v-row>
    <v-row v-if="isSearchActive">
      <v-col sm="6" md="4" lg="3" v-for="(user, i) in searchedUsers" :key="i">
        <user-card :user="user" :name="user.name" bottomNav="true" color="pink" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col lg="3" sm="12" v-for="(user, i) in mostRecentUsers" :key="i">
        <user-card :user="user" :name="user.name" bottomNav="true" color="pink" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import DefaultLayout from "../layouts/DefaultLayout";
import LandingLayout from "../layouts/LandingLayout";
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
    }),
    searchForPeopleLabel: function() {
      return this.$t("search-for-people");
    }
  },
  mounted: function() {
    if (this.mostRecentUsers == null) {
      this.getMostRecentUsers();
    }
  },
  created() {
    this.$emit("update:layout", LandingLayout);
  },
  methods: {
    ...mapActions("usersModule", ["getMostRecentUsers", "search"]),
    searchUsers() {
      this.$router.push({
        name: "search",
        params: { keywords: this.searchPhrase }
      });
      // this.isSearchActive = true;
      // this.search({ phrase: this.searchPhrase });
    },
    sendMessage(username) {
      this.$router.push({ name: "chat", params: { peerUsername: username } });
    }
  }
};
</script>
