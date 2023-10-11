<template>
  <div class="mainbox">
        <div class="container">
            <h2>Add new post</h2>
            <hr>
            <form id="postForm" :action="baseUrl+'/API/addpost'" method="POST" enctype="multipart/form-data">
                <label for="title">Title:</label><br>
                <input class="full" type="text" id="title" name="title" required><br><br>

                <label for="subTitle">Subtitle:</label><br>
                <textarea class="full" id="subTitle" name="subTitle" rows="4" required></textarea><br><br>

                <label for="text">Text:</label><br>
                <textarea class="full" id="text" name="text" rows="8" required></textarea><br><br>

                <label for="image">Picture:</label><br>
                <input type="file" id="image" name="image" accept="image/*" required><br><br>

                <input type="submit" value="Add post">
            </form>
        </div>
    </div>
</template>

<script>
import { checkAuth } from './auth.js';
export default {
  name: 'Add_Post',
  components: {
  },
  data() {
    return {
      baseUrl: this.$root.serverUrl,
      isAuth: false
    };
  },
  created() {
    this.checkAuthAndRedirect();
    this.isAuth = checkAuth(this.baseUrl);
    console.log('Add post is auth - ', this.isAuth)
    },
  methods: {
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
