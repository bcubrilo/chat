<template>
  <div v-if="user != undefined">User: {{ user.name }}</div>
</template>
<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions } = createNamespacedHelpers("auth");
export default {
  name: "UserProfile",
  data: () => ({
    imageUrl: ""
  }),
  computed: {
    ...mapState({
      user: state => state.user
    })
  }
};
</script>