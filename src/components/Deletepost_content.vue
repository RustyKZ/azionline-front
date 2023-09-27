<script>
    import axios from 'axios';

    export default {
        name: 'Deletepost_content',
        data() {
            return {
                posts: [],
//                baseUrl: process.env.BASE_URL
                baseUrl: 'http://127.0.0.1:8000'
            };
        },
        
        mounted() {
            // Здесь мы делаем GET-запрос к нашему Flask API, чтобы получить данные
            axios.get(`${this.baseUrl}/getarticles`)
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
                axios.delete(`${this.baseUrl}/delete/${postId}`)
                .then(() => {
                // Обновите список постов после удаления
                this.posts = this.posts.filter(post => post.id !== postId);
                })
                .catch(error => {
                console.error('Ошибка при удалении поста:', error);
                });
            }
        }
        
    };

</script>

<template>
    <div class="mainbox">
        <div class="container">
            <!-- Используйте цикл v-for для вывода каждой записи в массиве posts -->
            <div v-for="(post, index) in posts" :key="post.id">
                <h2>Post ID: {{post.id}} {{ post.title }}</h2>
                <p><b>{{ post.subtitle }}</b></p>
                <p><i>{{ post.publication_date }}</i></p>
                <input @click="deletePost(post.id)" type="submit" value="Delete post">
                <hr v-if="index < posts.length - 1">
            </div>
        </div>
    </div>
</template>

<style scoped>
.mainbox {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    width: 100%;
    margin: 0;
    padding: 0;
}
.container {
    width: 1280px;
    justify-content: center;
    align-items: center;
    padding: 5px;
}
</style>
