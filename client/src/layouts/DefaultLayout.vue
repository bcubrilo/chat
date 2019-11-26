<template>
  <div>
    <v-app-bar app clipped-left color="amber">
      <v-toolbar-title class>
        <span class>Chat and meet me</span>
      </v-toolbar-title>
      <v-btn icon>
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-chat</v-icon>
      </v-btn>
      <v-spacer />
      <v-menu offset-y origin="center center" :nudge-bottom="10" transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn icon large v-on="on">
            <v-avatar size="32px" item>
              <v-img :src="userAvatar" alt="Vuetify" />
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="pa-0">
          <v-list-item
            v-for="(item, index) in userMenuItems"
            :key="index"
            rel="noopener"
            :to="{name : item.name}"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <slot />
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "DefaultLayout",
  data: () => ({
    drawer: false,
    userMenuItems: [
      {
        icon: "account_circle",
        href: "#",
        text: "Profile",
        click: "",
        name: "profile"
      },
      {
        icon: "fullscreen_exit",
        href: "#",
        text: "Logout",
        click: "",
        name: "profile"
      }
    ]
  }),
  computed: {
    ...mapState({
      userProfile: state => state.userProfile.profile
    }),
    userAvatar() {
      return (
        "http://localhost:3030/images/avatars/" +
        (this.userProfile != null ? this.userProfile.profileImageUrl : "")
      );
    }
  },
  methods: {
    navigateToProfile() {}
  }
};
</script>