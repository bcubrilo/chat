<template>
  <v-container grid-list-xl fluid>
    <v-row>
      <v-col sm="12">
        <v-text-field
          append-icon="search"
          flat
          hide-details
          :label="$t('keywords')"
          solo-inverted
          v-model="searchPhrase"
          @keyup.enter.native="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div style="display: flex;flex-direction: row;">
          <span style="margin: 5px 20px 0 0;">{{$t('search-in')}}</span>
          <v-radio-group v-model="searchIn" row style="margin:0">
            <v-radio :label="$t('users')" value="users"></v-radio>
            <v-radio :label="$t('posts')" value="posts"></v-radio>
          </v-radio-group>
        </div>
      </v-col>
    </v-row>
    <v-row v-if="posts">
      <v-col lg="6" md="12" sm="12" xs="12" v-for="(post, i) in posts" :key="i">
        <post :post="post" @update-post-action="updatePost(post)" :clickable="true" />
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
    },
    editPostDialogVisible: false,
    searchIn: "users"
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
  mounted: function() {},
  created() {
    this.$emit("update:layout", LandingLayout);
    if (this.mostRecentUsers == null) {
      this.getMostRecentUsers();
    }
    this.getRecentPosts();
  },
  methods: {
    ...mapActions("usersModule", ["getMostRecentUsers"]),
    ...mapActions("post", ["getRecentPosts"]),

    search() {
      this.$router.push({
        name: "search",
        params: { searchIn: this.searchIn, keywords: this.searchPhrase }
      });
    },
    sendMessage(username) {
      this.$router.push({ name: "chat", params: { peerUsername: username } });
    },
    updatePost(post) {
      this.postModel = post;
      this.editPostDialogVisible = true;
    }
  }
};
</script>
