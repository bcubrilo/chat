<template>
  <vue-perfect-scrollbar class="chat-history--scrollbar">
    <v-divider></v-divider>
    <v-list two-line class="chat-history--list">
      <template v-for="(channel, index) in channels">
        <v-divider :key="index"></v-divider>
        <v-list-item
          :key="channel.id"
          @click="navigateToChannel(channel)"
          v-bind:class="{
            selected__channel: channel.id === selectedChannel.id
          }"
        >
          <v-list-item-avatar color="blue">
            <v-img v-if="channelAvatar != null" :src="channelAvatar"></v-img>
            <span v-else class="white--text headline">{{ channelFirstLetter(channel)}}</span>
          </v-list-item-avatar>
          <v-list-item-content>{{ channelName(channel) }}</v-list-item-content>
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
      channelFirstLetter: "chat/channelFirstLetter"
    }),
    channelAvatar: function() {
      return this.getChannelAvatar(this.channel);
    }
  },
  watch: {
    $route(to, from) {
      this.selectedChannel = this.getChannelByUsername(
        this.$route.params.peerUsername
      );
    }
  },
  methods: {
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
</style>
