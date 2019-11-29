<template>
  <v-layout align-center>
    <v-form ref="form" v-model="valid" :lazy-validation="lazy" v-if="!registered">
      <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
      <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
      <v-text-field
        type="password"
        v-model="password"
        required
        label="Password"
        :rules="passwordRules"
      />
      <v-btn color="error" class="mr-4" @click="registerUser">Register</v-btn>
    </v-form>
    <div v-else>User is registered</div>
  </v-layout>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "RegisterPage",
  data: () => ({
    valid: true,
    name: "",
    nameRules: [v => !!v || "Name is required"],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    password: "",
    passwordRules: [v => !!v || "Password is required"],
    lazy: true,
    registered: false
  }),
  methods: {
    ...mapActions("auth", ["register"]),
    registerUser() {
      this.register({
        name: this.name,
        email: this.email,
        password: this.password
      }).then(() => {
        this.registered = true;
      });
    },
    mounted() {
      try {
        let i = 1;
        // eslint-disable-next-line
        console.log("dljgdljg" + i * 2);
      } catch (err) {}
    }
  }
};
</script>
