<template>
  <v-card class="chat-room">
    <v-toolbar card dense flat light class="white chat-toolbar">
      <div style="display:flex;flex:auto">
        <v-btn icon @click="$router.push({ name: 'chat' })">
          <v-icon color="text--secondary">keyboard_arrow_left</v-icon>
        </v-btn>
      </div>
      <v-spacer />
      <v-toolbar-title style="display:flex;flex:auto">
        <h4 style="text-align:center">
          <router-link
            class="user-profile-link"
            :to="{ name: 'user-profile', params: { username: peerUsername }}"
          >{{ channelName(channel) }}</router-link>
        </h4>
      </v-toolbar-title>
      <v-spacer />
      <div style="display:flex;flex:auto;flex-direction: row-reverse;">
        <v-dialog v-model="deleteChatDialog" max-width="300px">
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon color="text--secondary">delete</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title>{{$t('delete-chat')}}</v-card-title>
            <v-divider />
            <v-card-text>{{$t('delete-chat-question')}}</v-card-text>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn color="red" text @click="deleteSelectedChannel()">{{$t('yes')}}</v-btn>
              <v-btn color="blue" text @click="deleteChatDialog = false">{{$t('no')}}</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-toolbar>
    <vue-perfect-scrollbar
      class="chat-room--scrollbar grey lighten-5 messages-area"
      ref="chatMessageContainer"
    >
      <div class="text-center" style="margin-top:10px">
        <v-btn icon large @click="loadOlderMessages">
          <v-icon large>mdi-cached</v-icon>
        </v-btn>
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
    olderMessagesLoading: false,
    deleteChatDialog: false
  }),
  computed: {
    ...mapState({
      channels: state => state.chat.channels,
      authUser: state => state.auth.user
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
    console.log("User =>", this.$route.query.user);
    if (this.peerUsername != undefined) {
      var channel = this.getChannelByUsername(this.peerUsername);
      if (channel) {
        this.selectedChannel = channel;
        this.updateSeenMessages();
      } else {
        this.createTmpChannel(this.$route.query.user);
        this.selectedChannel = this.getChannelByUsername(this.peerUsername);
      }
    }
  },
  updated() {
    if (!this.olderMessagesLoading) this.scrollToLastMessega();
  },
  created() {
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === "chat/receiveMessage") {
        this.updateSeenMessages();
      }
    });
  },
  beforeDestroy() {
    this.unsubscribe();
  },
  methods: {
    ...mapActions("chat", [
      "saveMessage",
      "saveTmpChannel",
      "getChannelMessages",
      "setMessagesSeen",
      "deleteChannel",
      "createTmpChannel"
    ]),
    sendMessage: function(message) {
      if (message) {
        if (!this.channel.uuId) {
          var status = this.saveTmpChannel(this.channel);
          status.then(r => {
            let peer = this.channel.members.find(
              m => m.user.username != this.authUser.username
            );
            this.saveMessage({
              channelUuId: this.channel.uuId,
              content: message.text,
              isEmojiMessage: message.emojiMessage,
              joinChannel: true
            });
          });
        } else {
          this.saveMessage({
            channelUuId: this.channel.uuId,
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
      var lastMessageTime =
        this.selectedChannel.messages != null &&
        this.selectedChannel.messages.length > 0
          ? this.selectedChannel.messages[0].createdAt
          : Date.now();
      this.getChannelMessages({
        channelUuId: this.selectedChannel.uuId,
        lastMessageTime: lastMessageTime
      });
      _.delay(() => (this.olderMessagesLoading = false), 100);
    },
    updateSeenMessages() {
      if (this.selectedChannel && this.selectedChannel.messages) {
        var msgs = this.selectedChannel.messages.filter(
          m => !m.isMine && !m.seen
        );
        msgs.forEach(m => (m.seen = true));
        var msgIds = this.$_.map(msgs, "uuId");
        if (msgIds.length > 0)
          this.setMessagesSeen({
            channelUuId: this.selectedChannel.uuId,
            messageIds: msgIds
          });
        console.log("Set seen from chat history");
      }
    },
    deleteSelectedChannel() {
      this.deleteChatDialog = false;
      this.deleteChannel(this.selectedChannel).then(r =>
        this.$router.push({ name: "chat" })
      );
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
.chat-toolbar {
  display: flex;
  flex: 1 1 50px;
  flex-direction: row;
  width: 100%;
}
.messages-area {
  display: flex;
  flex: 5 5 calc(100vh - 112px);
  flex-direction: column;
}
>>> .v-toolbar__content {
  display: flex;
  flex-direction: row;
  width: 100% !important;
}
.user-profile-link {
  text-decoration: none;
  color: inherit;
}
</style>
