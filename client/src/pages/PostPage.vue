<template>
  <v-container>
    <v-row>
      <v-col>
        <post :post="post" />
        <post-comment-form @on-submit-comment="submitComment" />
        <div class="post-comments" v-if="comments">
          <template v-for="(comment,i) in comments">
            <post-comment :comment="comment" :key="i"></post-comment>
          </template>
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
    commentText: "",
    comments: [],
    post: null
  }),
  mounted: function() {
    this.getPost({ postId: this.$route.params.postId }).then(result => {
      this.posts = result;
      this.post = this.$_.find(this.posts, p => !p.parentPostId);
      var comments = this.$_.filter(
        this.posts,
        p => p.parentPostId === this.post.id
      );
      console.log("Unorted comments", comments);
      if (comments)
        this.comments = this.$_.orderBy(comments, ["cratedAt"], ["desc"]);
      console.log("Sorted comments", this.comments);
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
            this.comments.unshift(r);
          })
          .catch(error => console.log("error posting comment", error));
      }
    }
  }
};
</script>
<style scoped>
</style>