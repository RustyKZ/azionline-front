<script>
    import axios from 'axios';

    export default {
        name: 'Main_content',
        data() {
            return {
                posts: [],
                baseUrl: this.$root.serverUrl,
            };
        },
        mounted() {        
        axios.get(`${this.baseUrl}/API/getarticles`)
            .then(response => {
            this.posts = response.data;
            })
            .catch(error => {
            console.error('Ошибка при получении данных:', error);
            });
        },
        
    };

</script>

<template>
    <div class="mainbox">
        <div class="container">
            <!-- Используйте цикл v-for для вывода каждой записи в массиве posts -->
            <div v-for="(post, index) in posts" :key="post.id">
                <h2>{{ post.title }}</h2>
                <p style="text-align: justify"><b>{{ post.subtitle }}</b></p>
                <img :src="baseUrl+'/static/postimage/' + post.image" v-if="post.image" alt="Image" class="img-container rounded-3 mb-3">
                <p v-html="post.text" style="text-align: justify"></p>
                <p><i>{{ post.publication_date }}</i></p>
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
    padding: 30px;
    margin: 20px;
    background: white;
}

.img-container {
    width: 100%; /* Масштабировать изображение по ширине родительского контейнера */
    height: auto; /* Масштабировать высоту пропорционально */
}
</style>
