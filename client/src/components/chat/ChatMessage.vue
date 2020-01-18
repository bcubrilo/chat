<template>
  <div
    v-if="message != null"
    :class="[message.userId == authUser.id ? 'reverse' : '']"
    class="messaging-item layout row my-4"
    :key="message.id"
    :id="htmlDivId"
  >
    <v-avatar class="indigo mx-1" size="40">
      <img :src="userAvatar(message.channelId, message.userId)" alt />
    </v-avatar>
    <div class="messaging--body layout column mx-2">
      <p
        :value="true"
        :class="[
          message.userId == authUser.id ? 'primary white--text' : 'white'
        ]"
        class="pa-2"
      >
        {{ message.content }}
      </p>
      <div class="caption px-2 text--secondary">
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
    message: Object
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
      return "chat-message-" + this.message != null ? this.message.id : "";
    }
  }
};
</script>
