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
        <span
          class="unreadMessagesCount"
          v-if="totalUnreadMessagesCount > 0"
        >{{ totalUnreadMessagesCount }}</span>
      </v-btn>
      <v-spacer />
      <v-menu origin="center center" transition="scale-transition" offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" v-on="on">
            <v-icon>mdi-bell</v-icon>
            <span
              class="unreadMessagesCount"
              v-if="unreadNotificationsCount > 0"
            >{{ unreadNotificationsCount }}</span>
          </v-btn>
        </template>
        <v-card width="400" height="300">
          <v-list>
            <v-list-item
              v-for="(notification, i) in notifications"
              :key="i"
              @click="$router.push(JSON.parse(notification.url))"
            >
              <v-list-item-avatar>
                <v-img :src="userSmallAvatar(notification.user.profile.profileImageUrl)"></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="notification.user.name"></v-list-item-title>
                {{notification.content}}
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-menu
        offset-y="true"
        offset-x="false"
        origin="center center"
        :nudge-bottom="10"
        transition="scale-transition"
      >
        <template v-slot:activator="{ on }">
          <v-btn icon large v-on="on">
            <v-icon>menu</v-icon>
          </v-btn>
        </template>
        <v-card>
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
                <v-list-item-title class="grey--text">{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
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
          icon: "power",
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
      userProfile: state => state.userProfile.profile,
      notifications: state => state.notification.notifications
    }),
    ...mapGetters({
      userAvatar: "userProfile/userAvatar",
      userSmallAvatar: "usersModule/userAvatarPath",
      userFirstLetter: "auth/userFirstLetter",
      totalUnreadMessagesCount: "chat/totalUnreadMessaesCount",
      unreadNotificationsCount: "notification/unreadCount",
      notificationRoute: "notification/route"
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
