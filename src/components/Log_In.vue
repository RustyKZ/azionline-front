<template>
  <div class="content">
    <div class="mainbox">
        <div class="container">
          <h2>Login</h2>
          <hr>
          <form @submit.prevent="loginUser">
            <label for="email">E-mail:</label>
            <input class="full" type="email" id="email" v-model="user.email" required><br><br>

            <label for="password">Password:</label>
            <input class="full" type="password" id="password" v-model="user.password" required><br><br>

            <button type="submit">Login</button>
          </form>
        </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import { login } from './auth.js';
import { checkAuth } from './auth.js';

export default {
  name: 'Log_In',
  data() {
    return {
      baseUrl: this.$root.serverUrl,
      user: {
        email: '',
        password: '',
      },
    };
  },
  methods: {
    goToHomePage() {
      this.$router.replace('/');
    },
    async loginUser() {
      try {
        const accessToken = await login(this.baseUrl, this.user);
        console.log('Login: ', accessToken);
        if (await checkAuth(this.baseUrl)) {
          this.$store.commit('incrementStatusHeader');
          this.goToHomePage();
        }
      } catch (error) {
        // Обработка ошибок аутентификации
      }
    },
  },
  components: {
  }
}
</script>

<style>
</style>
