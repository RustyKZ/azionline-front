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
import { checkMetaMaskConnection } from './wallet_connect.js';
export default {
  name: 'Add_Post',
  components: {
  },
  data() {
    return {
      baseUrl: this.$root.serverUrl,
      isWeb3Auth: false,
      userId: 0
    };
  },
  created() {    
    },
  methods: {
    async checkAuthAndRedirect() {
      this.isWeb3Auth = await checkMetaMaskConnection();
      console.log('Add post is auth - ', this.isWeb3Auth);
      if (this.isAuth === false) {
        console.log('Add post IF INSIDE');
        this.$router.replace('/access_denied');
      }
    }
  },
  async mounted() {
    await this.checkAuthAndRedirect();
    this.userId = Number(localStorage.getItem('user_id'));
    console.log('ADD POST ', this.userId);
    if (this.userId !=32) {        
        this.$router.replace('/access_denied');
      }

  },
}
</script>

<style>

</style>
