<template>
  <v-container class="fill-height pa-0 ma-0 fluid">
    <template v-if="!$vuetify.breakpoint.smAndDown">
      <v-layout row>
        <v-flex lg3 class="white">
          <chat-history></chat-history>
        </v-flex>
        <v-flex lg9 v-if="showChatRoom">
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
    // showChatRoom: false
  }),
  computed: {
    ...mapState({
      channels: state => state.chat.channels
    }),
    ...mapGetters({
      getChannelByUsername: "chat/getChannelByUsername",
      channelName: "chat/channelName",
      getByUsername: "usersModule/getByUsername"
    }),
    showChatHistory() {
      return this.$route.params.peerUsername == undefined;
    },
    showChatRoom() {
      return this.$route.params.peerUsername !== undefined;
    }
  },
  created() {
    let peerUsername = this.peerUsername;
    if (this.peerUsername) {
      var channel = this.getChannelByUsername(this.peerUsername);
      if (channel) {
        this.selectedChannel = channel;
      } else {
        var user = this.getByUsername(this.peerUsername);
        this.createTmpChannel(user);
        this.selectedChannel = this.getChannelByUsername(
          this.getByUsername(this.peerUsername)
        );
      }
    }
  },
  methods: {
    ...mapActions("chat", ["createTmpChannel"]),

    selectChannel(channelId) {
      console.log("selecting channel");
      this.selectedChannel = this.channels.find(c => {
        return c.id === channelId;
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
