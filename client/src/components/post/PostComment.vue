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
      <p style="margin-bottom:0">{{comment.content}}</p>
      <div>
        <span class="comment-button" @click="showCommentForm = true">{{$t('comment')}}</span>
        <post-comment-form v-if="showCommentForm" @on-submit-comment="submitComment" />
      </div>

      <div>
        <post-comment v-for="(comm,i) in myComments" :comment="comm" :key="i" />
        <span class="show-comments" v-if="comment.commentsCount >0" @click="showPostComments()">
          <template v-if="!showComments">
            <v-icon>mdi-menu-down</v-icon>
            {{$t('show-comments')}}
          </template>
          <template v-else>
            <v-icon>mdi-menu-up</v-icon>
            {{$t('hide-comments')}}
          </template>
        </span>
        <div class="comments" v-show="showComments">
          <post-comment v-for="(comm,i) in comments" :comment="comm" :key="i" />
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
    showCommentForm: false,
    comments: [],
    myComments: [],
    showComments: false,
    commentsLoaded: false
  }),
  computed: {
    ...mapGetters({
      userAvatarPath: "usersModule/userAvatarPath"
    })
  },
  methods: {
    ...mapActions("post", ["getPostComments", "createPost"]),
    submitComment: function(comment) {
      if (comment.content) {
        this.createPost({
          content: comment.content,
          parentPostId: this.comment.id
        })
          .then(r => {
            this.myComments.unshift(r);
          })
          .catch(error => console.log("error posting comment", error));
      }
      this.showCommentForm = false;
    },
    showPostComments() {
      this.showComments = !this.showComments;
      if (!this.commentsLoaded) {
        this.getPostComments({ postId: this.comment.id })
          .then(r => {
            try {
              console.log("i have some comments");
              var orderedComments = this.$_.orderBy(r, ["createdAt"], ["desc"]);
              this.$_.forEach(orderedComments, comment => {
                if (
                  this.$_.findIndex(this.myComments, c => c.id === comment.id) <
                  0
                )
                  this.comments.push(comment);
              });
            } catch (err) {
              console.log("Error => ", err);
            }
          })
          .catch(error => console.log("jbg", error));
        this.commentsLoaded = true;
      }
    }
  }
};
</script>
<style scoped>
.comment {
  display: flex;
  margin: 30px 10px;
}
.comment-image {
  margin-right: 20px;
}
.comment-body {
  display: flex;
  flex-direction: column;
}
.show-comments {
  margin-top: 10px;
  cursor: pointer;
}
.comment-button {
  cursor: pointer;
}
</style>