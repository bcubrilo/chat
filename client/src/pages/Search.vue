<template>
  <v-container>
    <v-row>
      <v-col>
        <search-form
          :searchInProp="$route.params.searchIn"
          :keywordsProp="$route.params.keywords"
          :countryCodeProp="$route.params.countryCode"
          :dateFromProp="$route.params.dateFrom"
          :dateToProp="$route.params.dateTo"
          @on-search="search"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col>{{hasResults ? $t('results') : $t('no-results')}}</v-col>
    </v-row>
    <v-row v-if="searchIn==='users'">
      <v-col v-for="(user, i) in users" :key="i" cols="auto" lg="3" sm="6" xs="12">
        <user-card :user="user" :name="user.name" bottomNav="true" color="pink" />
      </v-col>
    </v-row>
    <v-row v-if="searchIn==='posts'">
      <v-col v-for="(post, i) in posts" :key="i" cols="auto" lg="4" sm="6" xs="12">
        <post :post="post" :clickable="true" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  props: ["keywords", "searchIn"],
  name: "Search",
  data: () => ({
    searchPhrase: "",
    isSearchActive: false,
    users: [],
    posts: [],
    hasResults: false
  }),
  computed: {
    ...mapState({
      searchedUsers: state => state.usersModule.searchedUsers
    })
  },
  mounted() {
    this.searchPhrase = this.keywords;
    this.search({
      searchIn: this.$route.params.searchIn,
      countryCode: this.$route.params.countryCode,
      keywords: this.$route.params.keywords,
      dateFrom: this.$route.params.dateFrom,
      dateTo: this.$route.params.dateTo
    });
  },
  watch: {
    $route(to, from) {
      //this.search();
    }
  },
  methods: {
    ...mapActions({
      searchPosts: "post/search",
      searchUsers: "usersModule/search"
    }),
    search(data) {
      this.$router.push({
        name: "search",
        params: {
          searchIn: data.searchIn,
          keywords: data.keywords,
          countryCode: data.countryCode,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo
        }
      });
      if (this.searchIn === "users") {
        this.users = [];
        this.searchUsers({
          keywords: data.keywords,
          countryCode: data.countryCode
        }).then(r => {
          this.users = r;
          this.hasResults = this.users && this.users.length > 0;
        });
      } else if (this.searchIn === "posts") {
        this.posts = [];
        this.searchPosts({
          keywords: data.keywords,
          dateFrom: data.dateFrom || "",
          dateTo: data.dateTo || ""
        })
          .then(r => {
            this.posts = r;
            this.hasResults = this.posts && this.posts.length > 0;
          })
          .catch(err => (this.posts = []));
      }
    },
    searchAgain() {
      this.$router.push({
        name: "search",
        params: { searchIn: this.searchIn, keywords: this.searchPhrase }
      });
      this.search();
    },
    sendMessage(username) {
      this.$router.push({ name: "chat", params: { peerUsername: username } });
    }
  }
};
</script>