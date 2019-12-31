<template>
  <div
    v-if="message != null"
    :class="[message.userId == authUser.id ? 'reverse' : '']"
    class="messaging-item layout row my-4"
    :key="message.id"
    :id="htmlDivId"
  >
    <v-avatar class="indigo mx-1" size="40"></v-avatar>
    <div class="messaging--body layout column mx-2">
      <p
        :value="true"
        :class="[message.userId == authUser.id ? 'primary white--text' : 'white']"
        class="pa-2"
      >{{ message.content }}</p>
      <div class="caption px-2 text--secondary">{{ new Date(message.createdAt).toLocaleString() }}</div>
    </div>
    <v-spacer></v-spacer>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  props: {
    message: Object
  },
  name: "ChatMessage",
  computed: {
    ...mapState({
      authUser: state => state.auth.user
    }),
    htmlDivId() {
      return "chat-message-" + this.message != null ? this.message.id : "";
    }
  }
};
</script>