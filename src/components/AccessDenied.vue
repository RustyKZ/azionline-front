<script>

export default {
    name: 'AccessDenied',
    data() {
        return {
            userInfo: [],
            baseUrl: this.$root.serverUrl,
            userId: null,
            thisUserID: null,
        };
    },
    created() {
        
    },
    mounted() {
    },
    methods: {
        goToHomePage() {
                this.$router.replace('/');
        }
    }
};
</script>

<template>
    <div class="content">
        <div class="mainbox">
            <div class="container my-5">
                <div class="bg-body-tertiary p-5 rounded">
                    <div class="col-sm-8 py-5 mx-auto">
                        <h1 class="display-5 fw-normal">Access denied !</h1>
                        <p class="fs-5">You do not have permission to view this page</p>
                        <p>You may need to log in or this page is only for users with administrator rights.</p>
                        <p>
                            <button @click="goToHomePage" class="btn btn-primary">Return to homepage</button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
