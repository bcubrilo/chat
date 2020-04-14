<template>
  <div
    v-if="message != null"
    :class="[message.isMine ? 'reverse' : '']"
    class="messaging-item layout row my-4"
    :key="message.uuId"
    :id="htmlDivId"
  >
    <v-avatar class="indigo mx-1" size="40">
      <img :src="userImageUrl" alt />
    </v-avatar>
    <div class="messaging--body layout column mx-2">
      <template v-if="message.isEmojiMessage">
        <div
          :value="true"
          :class="[
          message.isMine ? 'right' : 'white', 'emoji-message'
        ]"
          class="pa-2"
          v-html="message.content"
        />
      </template>
      <template v-else>
        <div
          :value="true"
          :class="[
          message.isMine ? 'primary white--text right' : 'white'
        ]"
          class="pa-2"
          v-html="message.content"
        />
      </template>

      <div
        class="caption px-2 text--secondary"
        v-if="message.createdAt != undefined"
        :class="[message.isMine ? 'right' : '']"
      >
        {{
        this.$dateFormat(
        new Date(message.createdAt).toLocaleString(),
        "dd.mm.yyyy hh:MM"
        )
        }}
      </div>
    </div>
    <v-spacer></v-spacer>
  </div>
</template>
<script>
import { mapState, mapGetters } from "vuex";
export default {
  props: {
    message: Object,
    userImageUrl: String
  },
  name: "ChatMessage",
  computed: {
    ...mapState({
      authUser: state => state.auth.user
    }),
    ...mapGetters({
      userAvatar: "chat/userAvatar"
    }),
    htmlDivId() {
      return "chat-message-" + this.message.uuId || "";
    }
  }
};
</script>
<style>
.right {
  text-align: right;
}
.message-emoji {
  width: 25px;
  height: auto;
}
.emoji-message .message-emoji {
  width: auto !important;
}
</style>
