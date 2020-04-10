<template>
  <v-card class="chat-room">
    <v-toolbar card dense flat light class="white">
      <v-btn icon @click="$router.push({ name: 'chat' })">
        <v-icon color="text--secondary">keyboard_arrow_left</v-icon>
      </v-btn>
      <template v-if="selectedChannel != null">
        <v-avatar size="32" class="avatar-stack"></v-avatar>
      </template>
      <v-spacer />
      <v-toolbar-title>
        <h4 style="text-align:center">{{ channelName(channel) }}</h4>
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <vue-perfect-scrollbar class="chat-room--scrollbar grey lighten-5" ref="chatMessageContainer">
      <div class="text-center" style="margin-top:10px">
        <v-btn rounded color="primary" @click="loadOlderMessages">{{ $t("load-messages") }}</v-btn>
      </div>
      <v-card-text class="pa-3" v-if="selectedChannel != null">
        <template v-for="message in selectedChannel.messages">
          <chat-message
            :message="message"
            :userImageUrl="message.isMine ? myAvatar : peerImageUrl"
          />
        </template>
      </v-card-text>
    </vue-perfect-scrollbar>
    <v-card-actions>
      <chat-message-composer @on-submit-value="sendMessage" />
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import _ from "lodash";
export default {
  name: "ChatRoom",
  data: () => ({
    selectedChannel: null,
    messageModel: {
      content: "",
      channelId: 0,
      id: 0
    },
    olderMessagesLoading: false
  }),
  computed: {
    ...mapState({
      channels: state => state.chat.channels
    }),
    ...mapGetters({
      getChannelByUsername: "chat/getChannelByUsername",
      channelName: "chat/channelName",
      channelImage: "chat/channelImage",
      myAvatar: "userProfile/userAvatar"
    }),
    channel() {
      var channel = this.getChannelByUsername(this.$route.params.peerUsername);
      return channel;
    },
    peerUsername() {
      return this.$route.params.peerUsername;
    },
    peerImageUrl() {
      return this.channelImage(this.selectedChannel);
    }
  },
  watch: {
    $route(to, from) {
      this.selectedChannel = this.getChannelByUsername(
        this.$route.params.peerUsername
      );
    }
  },
  mounted() {
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
  updated() {
    if (!this.olderMessagesLoading) this.scrollToLastMessega();
  },
  methods: {
    ...mapActions("chat", [
      "saveMessage",
      "saveTmpChannel",
      "getChannelMessages"
    ]),
    sendMessage: function(message) {
      if (message) {
        if (this.channel.id == undefined || this.channel.id == 0) {
          var status = this.saveTmpChannel(this.channel);
          status.then(r => {
            let peer = this.channel.members.find(
              m => m.user.username != this.authUser.username
            );
            this.saveMessage({
              id: this.messageModel.id,
              channelId: this.channel.id,
              content: message.text,
              isEmojiMessage: message.emojiMessage
            });
          });
        } else {
          this.saveMessage({
            id: this.messageModel.id,
            channelId: this.channel.id,
            content: message.text,
            isEmojiMessage: message.emojiMessage
          });
        }
      }
    },
    scrollToLastMessega() {
      var ps = this.$refs.chatMessageContainer;
      var lastMsg = this.$el.querySelector(".messaging-item:last-child");
      var offset = lastMsg != undefined ? lastMsg.offsetTop : 0;

      if (ps != null) {
        this.$nextTick(() => {
          ps.$el.scrollTop = offset;
        });
      }
    },
    loadOlderMessages() {
      this.olderMessagesLoading = true;
      var lastMessageId =
        this.selectedChannel.messages != null &&
        this.selectedChannel.messages.length > 0
          ? this.selectedChannel.messages[0].id
          : 9999999999999;
      this.getChannelMessages({
        channelId: this.selectedChannel.id,
        lastMessageId: lastMessageId
      });
      _.delay(() => (this.olderMessagesLoading = false), 100);
    }
  }
};
</script>
<style scoped>
.chat-room {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 66px);
}
</style>
