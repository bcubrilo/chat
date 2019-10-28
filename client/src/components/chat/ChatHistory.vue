<template>
  <vue-perfect-scrollbar class="chat-history--scrollbar">
    <v-divider></v-divider>
    <v-list two-line class="chat-history--list">
      <template v-for="(channel, index) in channels">
        <v-divider :key="index"></v-divider>
        <v-list-item :key="channel.id" @click="navigateToChannel(channel)">
          <v-list-item-avatar></v-list-item-avatar>
          <v-list-item-content>{{channelName(channel)}}</v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
  </vue-perfect-scrollbar>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "ChatHistory",
  computed: {
    ...mapState({
      channels: state => state.chat.channels
    }),
    ...mapGetters({
      channelName: "chat/channelName",
      peerUsername: "chat/peerUsername"
    })
  },
  methods: {
    navigateToChannel(channel) {
      this.$router.push({
        name: "chat",
        params: { peerUsername: this.peerUsername(channel) }
      });
    }
  }
};
</script>