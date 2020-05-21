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
    <v-row v-if="posts">
      <v-col lg="6" md="12" sm="12" xs="12" v-for="(post, i) in posts" :key="i">
        <post :post="post" />
      </v-col>
    </v-row>
    <post-form mode="add"></post-form>
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
    searchPhrase: "",
    addPostDialog: false,
    postModel: {
      title: "",
      content: ""
    }
  }),
  computed: {
    ...mapState({
      mostRecentUsers: state => state.usersModule.mostRecentUsers,
      searchedUsers: state => state.usersModule.searchedUsers,
      posts: state => state.post.posts
    }),
    searchForPeopleLabel: function() {
      return this.$t("search-for-people");
    }
  },
  mounted: function() {
    if (this.mostRecentUsers == null) {
      this.getMostRecentUsers();
    }
    this.getRecentPosts();
  },
  created() {
    this.$emit("update:layout", LandingLayout);
  },
  methods: {
    ...mapActions("usersModule", ["getMostRecentUsers", "search"]),
    ...mapActions("post", ["getRecentPosts"]),
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
