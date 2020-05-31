<template >
  <div class="comment">
    <div class="comment-image">
      <v-avatar>
        <img :src="userAvatarPath(comment.profileImageUrl)" />
      </v-avatar>
    </div>
    <div class="comment-body">
      <h4>{{comment.name}}</h4>
      <span style="font-size:12px">
        {{
        this.$dateFormat(
        new Date(comment.createdAt).toLocaleString(),
        "dd.mm.yyyy hh:MM"
        )
        }}
      </span>
      <p>{{comment.content}}</p>
      <div>
        <span @click="showCommentForm = true">{{$t('comment')}}</span>
        <post-comment-form v-if="showCommentForm" @on-submit-comment="submitComment" />
      </div>

      <div v-if="comment.commentsCount > 0">
        <span @click="getComments()">{{$t('show-comments')}}</span>
        <div class="comments">
          <post-comment v-for="comm in comment.children" :comment="comm" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: { comment: Object },
  name: "PostComment",
  data: () => ({
    showCommentForm: false
  }),
  computed: {
    ...mapGetters({
      userAvatarPath: "usersModule/userAvatarPath"
    })
  },
  methods: {
    ...mapActions("post", ["getComments", "createPost"]),
    submitComment: function(comment) {
      if (comment.content) {
        this.createPost({
          content: comment.content,
          parentPostId: this.comment.id
        })
          .then(r => {
            if (!this.comment.children) this.comment.children = [];
            this.comment.children.unshift(r);
          })
          .catch(error => console.log("error posting comment", error));
      }
      this.showCommentForm = false;
    }
  }
};
</script>
<style scoped>
.comment {
  display: flex;
  margin: 30px 0;
}
.comment-image {
  margin-right: 20px;
}
.comment-body {
  display: flex;
  flex-direction: column;
}
</style>