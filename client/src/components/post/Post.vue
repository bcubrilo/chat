<template>
  <v-card v-if="post">
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="userAvatarPath(post.profileImageUrl)"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title class="headline">{{post.name}}</v-list-item-title>
        <v-list-item-subtitle>
          {{this.$dateFormat(
          new Date(post.createdAt).toLocaleString(),
          "dd.mm.yyyy hh:MM"
          )}}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-card-text>{{post.content}}</v-card-text>
  </v-card>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: { post: Object },
  name: "Post",
  computed: {
    ...mapGetters({
      userAvatarPath: "usersModule/userAvatarPath"
    })
  }
};
</script>