<template>
  <div class="mainbox">
    <div class="container">
      <h2>Choose post for erasing</h2>
      <hr>
      <!-- Используйте цикл v-for для вывода каждой записи в массиве posts -->
      <div v-for="(post, index) in posts" :key="post.id">
        <h2>Post ID: {{ post.id }} {{ post.title }}</h2>
        <p><b>{{ post.subtitle }}</b></p>
        <p><i>{{ post.publication_date }}</i></p>
        <input @click="deletePost(post.id)" type="submit" value="Delete post">
        <hr v-if="index < posts.length - 1">
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import { checkAuth } from './auth.js';

export default {
  name: 'Delete_Post',
  data() {
    return {
      posts: [],
      baseUrl: this.$root.serverUrl,
      isAuth: false
    };
  },

  created() {
    this.checkAuthAndRedirect();
    this.isAuth = checkAuth(this.baseUrl);
  },

  mounted() {
    // Здесь мы делаем GET-запрос к нашему Flask API, чтобы получить данные
    axios.get(`${this.baseUrl}/API/getarticles`)
      .then(response => {
        this.posts = response.data;
        console.log(this.posts);
      })
      .catch(error => {
        console.error('Ошибка при получении данных:', error);
      });
  },

  methods: {
    deletePost(postId) {
      axios.delete(`${this.baseUrl}/API/delete/${postId}`)
        .then(() => {
          // Обновите список постов после удаления
          this.posts = this.posts.filter(post => post.id !== postId);
        })
        .catch(error => {
          console.error('Ошибка при удалении поста:', error);
        });
    },
    async checkAuthAndRedirect() {
      this.isAuth = await checkAuth(this.baseUrl);
      console.log('Add post is auth - ', this.isAuth);
      if (this.isAuth === false) {
        console.log('Add post IF INSIDE');
        this.$router.replace('/access_denied');
      }
    }
  }
}
</script>

<style>
</style>
