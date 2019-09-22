<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-text-field
          append-icon="mic"
          class="mx-4"
          flat
          hide-details
          label="Search for people"
          prepend-inner-icon="search"
          solo-inverted
          v-model="searchPhrase"
          @keyup.enter.native="search"
        ></v-text-field>
      </v-col>
    </v-row>
    <v-row v-if="isSearchActive">
      <v-col cols="12">
        <h5>Search results</h5>
      </v-col>
    </v-row>
    <v-row v-if="!isSearchActive">
      <v-col cols="12">
        <h5>Recent members</h5>
      </v-col>

      <template v-if="mostRecentUsers != null">
        <v-col v-for="(user, i) in mostRecentUsers" :key="i">
          <v-card dark>
            <v-list-item three-line>
              <v-list-item-content class="align-self-start">
                <v-list-item-title class="headline mb-2" v-text="user.name"></v-list-item-title>
              </v-list-item-content>

              <v-list-item-avatar size="125" tile>
                <v-img :src="user.profileImageUrl"></v-img>
              </v-list-item-avatar>
            </v-list-item>
            <v-card-actions>
              <v-btn color="purple">Send message</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </template>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapActions } from "vuex";
export default {
  name: "HomePage",
  data: () => ({
    isSearchActive: false,
    searchPhrase: ""
  }),
  computed: {
    ...mapState({
      mostRecentUsers: state => state.usersModule.mostRecentUsers
    })
  },
  mounted: function() {
    if (this.mostRecentUsers == null) {
      this.getMostRecentUsers();
    }
  },
  methods: {
    ...mapActions("usersModule", ["getMostRecentUsers"]),
    search() {
      this.isSearchActive = true;
    }
  }
};
</script>