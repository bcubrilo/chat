<template>
  <v-row>
    <v-col cols="12">
      <v-form>
        <v-text-field v-model="username" label="Username or email"></v-text-field>
        <v-text-field type="password" v-model="password" required label="Password" />
        <v-btn color="error" class="mr-4" @click="loginUser">Login</v-btn>
      </v-form>
    </v-col>
    <v-col cols="12">
      <div v-if="error" style="color:red">Invalid credentials</div>
    </v-col>
  </v-row>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "LoginPage",
  data: () => ({
    username: "",
    password: "",
    error: false
  }),
  methods: {
    ...mapActions("auth", ["login"]),
    loginUser() {
      this.login({ username: this.username, password: this.password })
        .then(() => this.$router.push({ name: "home" }))
        .catch(errors => {
          console.log(errors);
          this.error = true;
        });
    }
  }
};
</script>