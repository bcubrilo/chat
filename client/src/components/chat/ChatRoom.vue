<template>
  <v-card class="chat-room">
    <v-toolbar card dense flat light class="white">
      <v-btn icon>
        <v-icon color="text--secondary">keyboard_arrow_left</v-icon>
      </v-btn>
      <template v-if="selectedChannel">
        <v-avatar size="32" class="avatar-stack"></v-avatar>
      </template>
      <v-spacer />
      <v-toolbar-title>
        <h4 style="text-align:center">{{channelName(channel)}}</h4>
      </v-toolbar-title>
      <v-spacer />
    </v-toolbar>
    <vue-perfect-scrollbar class="chat-room--scrollbar grey lighten-5">
      <v-card-text class="pa-3">
        <template v-for="(message,index) in channel.messages">
          <chat-message :message="message" />
        </template>
      </v-card-text>
    </vue-perfect-scrollbar>
    <v-card-actions>
      <v-text-field
        v-model="messageModel.content"
        full-width
        hide-details
        clearable
        multi-line
        auto-grow
        append-icon="send"
        @click:append="sendMessage"
        label="Type some message here"
      ></v-text-field>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "ChatRoom",
  data: () => ({
    selectedChannel: null,
    messageModel: {
      content: "",
      channelId: 0,
      id: 0
    }
  }),
  computed: {
    ...mapState({
      channels: state => state.chat.channels
    }),
    ...mapGetters({
      getChannelByUsername: "chat/getChannelByUsername",
      channelName: "chat/channelName"
    }),
    channel() {
      var channel = this.getChannelByUsername(this.$route.params.peerUsername);
      return channel;
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
    ...mapActions("chat", ["saveMessage", "saveTmpChannel"]),
    sendMessage() {
      if (this.messageModel.content.length > 0) {
        if (this.channel.id == undefined || this.channel.id == 0) {
          var status = this.saveTmpChannel(this.channel);
          status.then(r => {
            let peer = this.channel.members.find(
              m => m.user.username != this.authUser.username
            );
            this.saveMessage({
              id: this.messageModel.id,
              channelId: this.channel.id,
              content: this.messageModel.content
            });
            this.messageModel.content = "";
          });
        } else {
          this.saveMessage({
            id: this.messageModel.id,
            channelId: this.channel.id,
            content: this.messageModel.content
          });
          this.messageModel.content = "";
          this.messageModel.id = "";
        }
      }
    }
  }
};
</script>