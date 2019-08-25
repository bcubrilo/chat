<template>
  <v-layout>
    <v-row>
      <v-col md="4">
        <v-img
          :src="imageUrl"
          aspect-ratio="1"
          class="grey lighten-2"
          max-width="500"
          max-height="300"
        />
      </v-col>
      <v-col md="8">
        <div>
          <p>{{authUser.name}}</p>
          <p>{{authUser.email}}</p>
          <div v-if="profile != null">
            <div v-if="!editDescription">
              <p>{{profile.description}}</p>
              <v-btn @click="editDescription = !editDescription">Edit</v-btn>
            </div>

            <div v-else>
              <v-textarea outlined :value="profile.description"></v-textarea>
              <v-btn @click="editDescription = false">Cancel</v-btn>
              <v-btn>Save</v-btn>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "UserProfilePage",
  data: () => ({
    imageUrl: "https://picsum.photos/id/11/500/300",
    editDescription: false
  }),
  computed: {
    ...mapState({
      authUser: state => state.auth.user,
      profile: state => state.userProfile.profile
    })
  },
  methods: {
    ...mapActions("userProfile", ["getProfile"])
  },
  mounted: function() {
    this.getProfile();
  }
};
</script>