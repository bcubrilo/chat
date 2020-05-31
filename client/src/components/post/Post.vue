<template>
  <div>
    <v-card v-if="post">
      <v-list-item>
        <v-list-item-avatar>
          <v-img :src="userAvatarPath(post.profileImageUrl)"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title class="headline">
            {{
            post.name
            }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{
            this.$dateFormat(
            new Date(post.createdAt).toLocaleString(),
            "dd.mm.yyyy hh:MM"
            )
            }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action v-if="authUser.username === post.username">
          <v-menu>
            <template v-slot:activator="{ on: menu }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn color="grey darken-1" dark v-on="{ ...tooltip, ...menu }" icon>
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <span>{{ $t("action") }}</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item @click="updatePost()">
                <v-list-item-title>{{ $t("change") }}</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title @click="deletePost()">
                  {{
                  $t("delete")
                  }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-action>
      </v-list-item>
      <v-card-text>
        <div class="post-content" @click="navigateToPost()">{{ post.content }}</div>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
export default {
  props: {
    post: {
      type: Object,
      default: null
    },
    showComments: { type: Boolean, default: false }
  },
  name: "Post",
  computed: {
    ...mapState({
      authUser: state => state.auth.user
    }),
    ...mapGetters({
      userAvatarPath: "usersModule/userAvatarPath"
    })
  },
  methods: {
    ...mapActions("post", ["delete"]),
    navigateToPost() {
      this.$router.push({ name: "post", params: { postId: this.post.id } });
    },
    deletePost() {
      this.delete({ postId: this.post.id });
    },
    updatePost() {
      this.$emit("update-post-action", {
        text: this.value,
        emojiMessage: this.emojiMessage
      });
    }
  }
};
</script>
<style scoped>
.post-content {
  cursor: pointer;
}
</style>