<template>
  <v-row align="start">
    <v-col cols="12" sm="12">
      <v-form ref="form" v-model="valid" :lazy-validation="lazy" v-if="!registered">
        <v-text-field v-model="name" :rules="nameRules" label="Name" required></v-text-field>
        <v-text-field
          autocomplete="false"
          v-model="username"
          :rules="usernameRules"
          label="Username"
          required
        ></v-text-field>
        <v-text-field
          autocomplete="false"
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>
        <v-text-field
          autocomplete="new-password"
          :type="showPassword ? 'text' : 'password'"
          v-model="password"
          required
          label="Password"
          :rules="passwordRules"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showPassword = !showPassword"
        />
        <v-text-field
          :type="showConfirmPassword ? 'text' : 'password'"
          v-model="repeatPassword"
          required
          label="Repeat password"
          :rules="[passwordConfirmationRule,passwordRules]"
          :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="showConfirmPassword = !showConfirmPassword"
        />
        <v-btn color="error" class="mr-4" @click="registerUser">Register</v-btn>
      </v-form>
    </v-col>
    <v-col cols="12" sm="12">
      <div style="color:red">{{registerError}}</div>
      <div v-if="registered">User is registered!</div>
    </v-col>
  </v-row>
</template>
<script>
import { mapActions } from "vuex";
export default {
  name: "RegisterPage",
  data: () => ({
    valid: true,
    name: "",
    nameRules: [
      v => !!v || "Name is required",
      v =>
        /^[a-zA-Z]+(([' ][a-zA-Z ])?[a-zA-Z]*)*$/.test(v) ||
        '"Name can contain only charachters and spaces. Must be at least 3 and maximum 20 charachters long.'
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+\..+/.test(v) || "E-mail must be valid"
    ],
    password: "",
    repeatPassword: "",
    passwordRules: [
      v => !!v || "Password is required",
      v =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_=;,<>!~?@#$%^&*])(?=.{8,})/.test(
          v
        ) ||
        "Password must be at least 8 charachters long, contains small leter, capital letter, number and one special charachter."
    ],
    username: "",
    usernameRules: [
      v => !!v || "Username is required",
      v =>
        /^(?!.*[_\.]{2,})(?=^[^_\.].*[^_\.]$)[a-zA-Z](\w|\.){4,20}$/.test(v) ||
        "Username must be valid"
    ],
    lazy: true,
    registered: false,
    registerError: "",
    showPassword: false,
    showConfirmPassword: false
  }),
  computed: {
    passwordConfirmationRule() {
      return this.password === this.repeatPassword || "Pasword didn't match.";
    }
  },
  mounted() {
    this.$refs.form.reset();
  },
  methods: {
    ...mapActions("auth", ["register"]),
    registerUser() {
      if (!this.$refs.form.validate()) return;
      this.register({
        name: this.name,
        email: this.email,
        password: this.password,
        repeat_password: this.repeatPassword,
        username: this.username
      })
        .then(() => {
          this.registered = true;
          this.registerError = "";
        })
        .catch(error => (this.registerError = error));
    }
  }
};
</script>
