<template>
  <v-container fluid>
    <v-app-bar app color="#9c27b0" dark>
      <v-toolbar-title class>
        <span class>Chat and meet me</span>
      </v-toolbar-title>
    </v-app-bar>
    <v-layout align-center justify-center>
      <v-row justify="center">
        <v-col cols="12" sm="6" align-self="center">
          <p>Dobro dosli na chat and meeet me</p>
        </v-col>
        <v-col cols="12" sm="6">
          <v-tabs>
            <v-tab>Login</v-tab>
            <v-tab>Register</v-tab>

            <v-tab-item height="200">
              <v-card flat tile>
                <v-card-text>
                  <auth-login />
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item>
              <v-card flat tile>
                <v-card-text>
                  <auth-register />
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs>
        </v-col>
      </v-row>
      <v-row xs12 sm6 md4 lg3></v-row>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  name: "LandingLayout"
};
</script>