<template>
  <vue-perfect-scrollbar class="chat-history--scrollbar">
    <v-divider></v-divider>
    <v-list two-line class="chat-history--list">
      <template v-for="(channel, index) in channels">
        <v-divider :key="index" v-if="index > 0"></v-divider>
        <v-list-item
          :key="channel.id"
          @click="navigateToChannel(channel)"
          v-bind:class="{
            selected__channel: channel.id === selectedChannel.id
          }"
        >
          <v-list-item-avatar color="blue">
            <v-img
              v-if="channelImage(channel) != null"
              :src="channelImage(channel)"
            ></v-img>
            <span v-else class="white--text headline">{{
              channelFirstLetter(channel)
            }}</span>
          </v-list-item-avatar>
          <v-list-item-content>{{ channelName(channel) }}</v-list-item-content>
          <v-list-item-action>
            <span
              v-if="unreadMessagesCount(channel) > 0"
              class="unread-messages-count blue"
              >{{ unreadMessagesCount(channel) }}</span
            >
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
  </vue-perfect-scrollbar>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import path from "path";
export default {
  name: "ChatHistory",
  data: () => ({
    selectedChannel: Object
  }),
  computed: {
    ...mapState({
      channels: state => state.chat.channels
    }),
    ...mapGetters({
      channelName: "chat/channelName",
      peerUsername: "chat/peerUsername",
      getChannelByUsername: "chat/getChannelByUsername",
      channelImage: "chat/channelImage",
      channelFirstLetter: "chat/channelFirstLetter",
      unreadMessagesCount: "chat/unreadMessagesCount"
    }),
    channelAvatar: function() {
      return this.getChannelAvatar(this.channel);
    }
  },
  updated() {
    if (this.selectedChannel != null && this.selectedChannel.messages != null) {
      var msgs = this.selectedChannel.messages.filter(m => m.seen === false);
      var msgIds = this.$_.map(msgs, "id");
      if (msgIds.length > 0)
        this.setMessagesSeen({
          channelId: this.selectedChannel.id,
          messageIds: msgIds
        });
    }
  },
  watch: {
    $route(to, from) {
      if (this.$route.params.peerUsername === undefined) {
        this.selectedChannel = null;
      } else {
        this.selectedChannel = this.getChannelByUsername(
          this.$route.params.peerUsername
        );
      }
    }
  },
  methods: {
    ...mapActions("chat", ["setMessagesSeen"]),
    navigateToChannel(channel) {
      this.$router.push({
        name: "chat",
        params: { peerUsername: this.peerUsername(channel) }
      });
    },
    getChannelAvatar(channel) {
      var image = this.channelImage(channel);
      if (image === null || image === "" || image === undefined) return null;
      var imageUrl = path.join(
        process.env.VUE_APP_IMAGES_REPOSITORY,
        "avatars",
        image != null ? image : ""
      );
      return imageUrl;
    },
    getChannelFirstLetter() {
      var name = this.channelName(this.channel);
      if (name != undefined && name.length > 0) return name.charAt(0);
      else return "";
    }
  }
};
</script>
<style scoped>
.selected__channel {
  background: #ebe6e6;
}
.unread-messages-count {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border-radius: 50%;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  line-height: normal;
  position: relative;
  text-align: center;
  vertical-align: middle;
  font-size: 12px;
  height: 32px;
  width: 32px;
  color: white;
}
</style>
