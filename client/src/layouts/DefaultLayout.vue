<template>
  <div>
    <v-app-bar app clipped-left color="amber">
      <v-toolbar-title class>
        <span class>Chat and meet me</span>
      </v-toolbar-title>
      <v-btn icon @click="$router.push({ name: 'home' })">
        <v-icon>mdi-home</v-icon>
      </v-btn>
      <v-btn icon @click="$router.push({ name: 'chat' })">
        <v-icon>mdi-chat</v-icon>
        <span class="unreadMessagesCount" v-if="totalUnreadMessagesCount > 0">
          {{ totalUnreadMessagesCount }}
        </span>
      </v-btn>
      <v-spacer />
      <v-menu
        offset-y
        origin="center center"
        :nudge-bottom="10"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon large v-on="on">
            <v-avatar size="32px" item>
              <v-img v-if="userAvatar != null" :src="userAvatar" alt="Avatar" />
              <span v-else>{{ userFirstLetter() }}</span>
            </v-avatar>
          </v-btn>
        </template>

        <v-list class="pa-0">
          <v-list-item
            v-for="(item, index) in userMenuItems"
            :key="index"
            rel="noopener"
            :to="{ name: item.name }"
            @click="userMenuItemClick(item.name)"
          >
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title class="grey--text">
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <slot />
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
export default {
  name: "DefaultLayout",
  data() {
    return {
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
          name: "logout"
        }
      ]
    };
  },
  computed: {
    ...mapState({
      userProfile: state => state.userProfile.profile
    }),
    ...mapGetters({
      userAvatar: "userProfile/userAvatar",
      userFirstLetter: "auth/userFirstLetter",
      totalUnreadMessagesCount: "chat/totalUnreadMessaesCount"
    })
  },
  methods: {
    ...mapActions("auth", ["logout"]),
    userMenuItemClick(route) {
      if (route === "logout") {
        this.logout();
      }
    }
  }
};
</script>
