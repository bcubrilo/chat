<template>
  <div v-if="channel != null">
    {{channelName(channel)}}
    <v-btn @click="deleteChannelLocal">
      <v-icon>delete</v-icon>
    </v-btn>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    channel: Object
  },
  name: "Channel",
  computed: {
    ...mapGetters({
      channelName: "chat/channelName"
    })
  },
  methods: {
    ...mapActions("chat", ["deleteChannel", "deleteTmpChannel"]),
    deleteChannelLocal() {
      if (this.channel.id != undefined && this.channel.id > 0) {
        this.deleteChat(this.channel);
        console.log("Deleting chat");
      } else {
        this.deleteTmpChannel(this.channel);
        console.log("Deleting tmp chat");
      }
    }
  }
};
</script>