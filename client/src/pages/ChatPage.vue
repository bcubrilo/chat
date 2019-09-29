<template>
  <v-layout>
    <v-container>
      <v-row>
        <v-col cols="3">
          <div v-for="chnl in channels">
            <chm-channel :channel="chnl" @click.native="selectChannel(chnl.id)" />
          </div>
        </v-col>
        <v-col cols="9">
          <v-row>
            <v-col cols="12">
              <h1 v-if="selectedChannel != null">{{channelName(selectedChannel)}}</h1>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <div v-if="selectedChannel != null && selectedChannel.messages !=null">
                <div v-for="message in selectedChannel.messages">
                  <chm-message :message="message" />
                </div>
              </div>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <message-composer :channel="selectedChannel" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
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
    })
  },
  mounted() {
    console.log("Rendering chat");
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