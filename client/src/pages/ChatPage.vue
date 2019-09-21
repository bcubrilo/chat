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
              <h1 v-if="selectedChannel != null">Selected Chat {{selectedChannel.id}}</h1>
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
import { mapState, mapActions } from "vuex";
export default {
  name: "ChatPage",
  data: () => ({
    selectedChannel: null
  }),
  computed: {
    ...mapState({
      channels: state => state.chat.channels
    })
  },
  mounted() {},
  methods: {
    selectChannel(channelId) {
      this.selectedChannel = this.channels.find(c => {
        return c.id == channelId;
      });
    }
  }
};
</script>