<script>
import axios from 'axios';
export default {
    name: 'Not_Found',
    data() {
        return {
            userInfo: [],
            baseUrl: this.$root.serverUrl,
            thisUserID: null,
            userNickname: '',
            activeTable: 0,
        };
    },
    created() {
        this.thisUserID = Number(localStorage.getItem('user_id'));
    },
    mounted() {      
        this.get404()          
    },
    methods: {
        goToHomePage() {
            this.$router.replace('/');
        },

        get404() {
            const request404 = {
                user_id: this.thisUserID,            
            }
            // console.log('GET 404 | AXIOS:', request404)
            axios.post(`${this.baseUrl}/API/get_404`, request404)
            .then(response=> {
                this.userNickname = response.data[1].user_nickname;
                this.activeTable = response.data[1].table_id;
            })
            .catch(error => {
                console.error('Ошибка при получении данных:', error);
            });
        }
    }
}
</script>

<template>
    <div class="content">
        <div class="mainbox">
            <div class="container my-5">
                <div class="bg-body-tertiary p-5 rounded">
                    <div class="col-sm-8 py-5 mx-auto">
                        <h1 class="display-5 fw-normal">Page not found</h1>
                        <p class="fs-5">You are on this page because you tried to open a page that does not yet exist.</p>
                        <p>This happened due to your carelessness or because this application did not work correctly.
                            This is still only a beta version and we are collecting data to analyze possible errors.
                            We hope to make our application better and more reliable and we hope that the '404' page will be
                            opened in your browser as rarely as possible.</p>
                        <p>
                            <button @click="goToHomePage" class="btn btn-primary">Return to homepage</button>
                            {{ userNickname }}  {{ activeTable }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
