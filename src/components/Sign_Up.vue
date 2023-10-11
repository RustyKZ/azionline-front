<template>
  <div class="content">
    <div class="mainbox">
        <div class="container">
          <h2>Registration Form</h2>
          <hr>
          <form @submit.prevent="registerUser">
            <label for="name">Name:</label>
            <input class="full" type="text" id="name" v-model="user.name" required><br><br>

            <label for="email">E-mail:</label>
            <input class="full" type="email" id="email" v-model="user.email" required><br><br>

            <label for="password">Password:</label>
            <input class="full" type="password" id="password" v-model="user.password" required><br><br>

            <label for="confirmPassword">Reenter Password:</label>
            <input class="full" type="password" id="confirmPassword" v-model="confirmPassword" required><br><br>

            <button type="submit">Register</button>
          </form>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { login } from './auth.js';
import { checkAuth } from './auth.js';

export default {
  name: 'Sign_Up',
  data() {
            return {
              baseUrl: this.$root.serverUrl,
              user: {
                name: '',
                email: '',
                password: '',
              },
              user_login:{
                email: '',
                password: '',
              },
              confirmPassword: '',
            };
          },
  methods: {
    async registerUser() {
      if (this.user.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      try {
        const response = await axios.post(this.baseUrl + '/API/adduser', this.user);
        console.log('Server /API/adduser says: ', response)
      } catch (error) {
      console.error('Error register:', error);
        throw error;
      }

      this.user_login.email = this.user.email;
      this.user_login.password = this.user.password;

      try {
        const accessToken = await login(this.baseUrl, this.user_login);
        console.log('Login: ', accessToken);
        if (await checkAuth(this.baseUrl)) {
          this.$store.commit('incrementStatusHeader');
          this.$router.replace('/');
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
