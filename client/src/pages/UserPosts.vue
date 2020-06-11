<template>
  <v-container>
    <v-row>{{$t('posts')}} {{authUser.name}}</v-row>
    <v-row v-if="posts">
      <v-col lg="6" md="12" sm="12" xs="12" v-for="(post, i) in posts" :key="i">
        <post :post="post" :clickable="true" />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "UserPosts",
  data: () => ({
    posts: []
  }),
  mounted() {
    this.getUserPosts({ username: this.$route.params.username }).then(
      r => (this.posts = r)
    );
  },
  computed: {
    ...mapState({
      authUser: state => state.auth.user
    })
  },
  methods: {
    ...mapActions("post", ["getUserPosts"])
  }
};
</script>