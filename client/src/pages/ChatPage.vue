<template>
  <v-container class="fill-height pa-0 ma-0 fluid">
    <template v-if="!$vuetify.breakpoint.smAndDown">
      <v-layout row>
        <v-flex lg3 class="white">
          <chat-history></chat-history>
        </v-flex>
        <v-flex lg9>
          <chat-room></chat-room>
        </v-flex>
      </v-layout>
    </template>
    <template v-else>
      <v-layout column>
        <v-flex sm12 class="white" v-if="showChatHistory">
          <chat-history></chat-history>
        </v-flex>
        <v-flex sm12 v-if="showChatRoom">
          <chat-room></chat-room>
        </v-flex>
      </v-layout>
    </template>
  </v-container>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  props: ["peerUsername"],
  name: "ChatPage",
  data: () => ({
    selectedChannel: null
  }),
  computed: {
    ...mapState({
      channels: state => state.chat.channels
    }),
    ...mapGetters({
      getChannelByUsername: "chat/getChannelByUsername",
      channelName: "chat/channelName"
    }),
    showChatHistory() {
      return this.$route.params.peerUsername == undefined;
    },
    showChatRoom() {
      return this.$route.params.peerUsername !== undefined;
    }
  },
  mounted() {
    let peerUsername = this.peerUsername;
    if (this.peerUsername != undefined) {
      var channel = this.getChannelByUsername(this.peerUsername);
      if (channel != null && channel != undefined) {
        this.selectedChannel = channel;
      } else {
        this.createTmpChannel(this.peerUsername);
        this.selectedChannel = this.getChannelByUsername(this.peerUsername);
      }
    }
  },
  methods: {
    ...mapActions("chat", ["createTmpChannel"]),

    selectChannel(channelId) {
      this.selectedChannel = this.channels.find(c => {
        return c.id == channelId;
      });
    }
  }
};
</script>
<style scoped>
.messages-container {
  overflow-y: auto;
  overflow-x: hidden;
  height: calc(100vh - 18rem);
}
.message-composer {
  display: flex;
  height: 5rem;
  bottom: 0;
}
</style>