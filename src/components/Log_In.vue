<template>
  <div class="content">
    <div class="mainbox">
        <div class="container my-5">
          <div class="bg-body-tertiary p-5 rounded">
            <h2>Login</h2>
            <hr>
              <form @submit.prevent="loginUser">
              <label for="email">E-mail:</label>
              <input class="full" type="email" id="email" v-model="user.email" required><br><br>
              <label for="password">Password:</label>
              <input class="full" type="password" id="password" v-model="user.password" required><br>
              <hr>
              <button type="submit" class="btn btn-dark">Login</button>
          </form>
        </div>
        </div>
    </div>
  </div>
</template>

<script>
// import axios from 'axios';
import { login } from './auth.js';
import { checkAuth } from './auth.js';
import { mapMutations } from 'vuex';

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
    ...mapMutations(['setIsLogin']),
    goToHomePage() {
      this.$router.replace('/');
    },
    async loginUser() {
      try {
        await login(this.baseUrl, this.user);      
        if (await checkAuth(this.baseUrl)) {
          this.setIsLogin(true);
          this.$store.commit('incrementStatusHeader');
          this.goToHomePage();
        }
      } catch (error) {
        const errorMessage = error.response.data.message;
        alert(errorMessage);
        console.error('Server /API/adduser ERROR:', error);
      }
    },
  },
  components: {
  }
}
</script>

<style>
</style>
