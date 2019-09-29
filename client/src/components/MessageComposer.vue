<template>
  <v-container fluid>
    <v-item-group>
      <v-row>
        <v-col cols="10">
          <v-textarea
            clearable
            clear-icon="cancel"
            placeholder="Write something"
            v-model="messageModel.content"
            auto-grow
            outlined
            rows="1"
            row-height="15"
          ></v-textarea>
        </v-col>
        <v-col cols="2">
          <v-btn fab small color="pink" @click="sendMessage">
            <v-icon>paper-airplane</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-item-group>
  </v-container>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  props: {
    channel: Object
  },
  name: "MessageComposer",
  data: () => ({
    messageModel: {
      content: "",
      channelId: 0,
      id: 0
    }
  }),
  computed: {
    ...mapState({
      authUser: state => state.auth.user
    }),
    ...mapGetters({
      getChannelByUsername: "chat/getChannelByUsername"
    })
  },
  methods: {
    ...mapActions("chat", ["saveMessage", "saveTmpChannel"]),
    sendMessage() {
      if (this.messageModel.content.length > 0) {
        if (this.channel.id == undefined || this.channel.id == 0) {
          this.saveTmpChannel(this.channel);
          let peer = this.channel.members.find(
            m => m.user.username != this.authUser.username
          );
          this.channel = this.getChannelByUsername(peer.user.username);
          console.log(JSON.stringify(this.channel));
        }

        // this.saveMessage({
        //   id: this.messageModel.id,
        //   channelId: this.channel.id,
        //   content: this.messageModel.content
        // });
        // this.messageModel.content = "";
      }
    }
  }
};
</script>