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
          <v-btn fab dark small color="pink" @click="sendMessage">
            <v-icon dark>paper-airplane</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-item-group>
  </v-container>
</template>
<script>
import { mapActions } from "vuex";
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
  methods: {
    ...mapActions("chat", ["saveMessage"]),
    sendMessage() {
      if (this.messageModel.content.length > 0) {
        this.saveMessage({
          id: this.messageModel.id,
          channelId: this.channel.id,
          content: this.messageModel.content
        });
        this.messageModel.content = "";
      }
    }
  }
};
</script>