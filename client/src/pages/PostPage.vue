<template>
  <v-container>
    <v-row>
      <v-col>
        <post :post="postTree" />
        <post-comment-form @on-submit-comment="submitComment" />
        <div class="post-comments" v-if="postTree.children">
          <post-comment v-for="(comment,i) in postTree.children" :comment="comment" :key="i"></post-comment>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  name: "PostPage",
  data: () => ({
    postTree: Object,
    posts: [],
    showCommentSubmitButtons: false,
    commentText: ""
  }),
  mounted: function() {
    this.getPost({ postId: this.$route.params.postId }).then(result => {
      this.posts = result;
      var post = this.$_.find(this.posts, p => !p.parentPostId);
      if (post) this.buildPostTree(post, null);
    });
  },
  computed: {
    ...mapGetters({
      userAvatarPath: "usersModule/userAvatarPath"
    }),
    ...mapState({
      authUser: state => state.auth.user
    })
  },
  methods: {
    ...mapActions("post", ["getPost", "createPost"]),
    buildPostTree(post, parentPost) {
      if (!post.parentPostId) {
        this.postTree = post;
      } else {
        if (!parentPost.children) parentPost.children = [];
        parentPost.children.push(post);
      }
      var children = this.$_.filter(
        this.posts,
        p => p.parentPostId === post.id
      );
      console.log("Children", children);
      if (children) this.$_.forEach(children, p => this.buildPostTree(p, post));
    },
    submitComment: function(comment) {
      if (comment.content) {
        this.createPost({
          content: comment.content,
          parentPostId: this.postTree.id
        })
          .then(r => {
            var array = this.postTree.children;
            array.unshift(r);
            this.postTree.children = array;
          })
          .catch(error => console.log("error posting comment", error));
      }
    }
  }
};
</script>
<style scoped>
</style>