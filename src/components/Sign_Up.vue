<template>
  <div class="content">
    <div class="mainbox">
        <div class="container my-3">
          <div class="bg-body-tertiary p-5 rounded">
          <h2>Registration Form</h2>
          <hr>
          <form @submit.prevent="registerUser">
            <label for="name">Name:</label>
            <input class="full" type="text" id="name" v-model="user.name" required><br>

            <label for="email" class="mt-2">E-mail:</label>
            <input class="full" type="email" id="email" v-model="user.email" required><br>

            <label for="password" class="mt-2">Password:</label>
            <input class="full" type="password" id="password" v-model="user.password" required><br>

            <label for="confirmPassword" class="mt-2">Reenter Password:</label>
            <input class="full" type="password" id="confirmPassword" v-model="confirmPassword" required><br>
            <hr>

            <button type="submit" class="btn btn-dark">Register</button>
          </form>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { login } from './auth.js';
import { checkAuth } from './auth.js';
import { mapMutations } from 'vuex';

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
    ...mapMutations(['setIsLogin']),
    async registerUser() {
      if (this.user.password !== this.confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      try {
        const response = await axios.post(this.baseUrl + '/API/adduser', this.user);
        console.log('Server says: ', response.data.message)
        this.user_login.email = this.user.email;
        this.user_login.password = this.user.password;

        try {
          await login(this.baseUrl, this.user_login);
          // console.log('Login: ', accessToken);
          if (await checkAuth(this.baseUrl)) {
            this.setIsLogin(true);
            this.$store.commit('incrementStatusHeader');
            this.$router.replace('/');
          }
        } catch (error) {
          console.error('Server /API/adduser ERROR:', error);
          // Обработка ошибок аутентификации
        }
      } catch (error) {
        const errorMessage = error.response.data.message;
        alert(errorMessage);
        console.error('Server /API/adduser ERROR:', error);
      }
      
      /* axios.post(`${this.baseUrl}/API/adduser`, this.User)
        .then(response => {
          console.log('Server /API/adduser says: ', response)                  
        })
          .catch(error => {
            console.error('Server /API/adduser ERROR:', error);
        }); */

      

    },
  },
  components: {
  }
}
</script>

<style>

</style>
