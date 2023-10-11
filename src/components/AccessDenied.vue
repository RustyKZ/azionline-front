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

};
</script>

<template>
    <div class="content">
        <div class="mainbox">
            <div class="container" style="background: red;">
                <h1>Access Deied !!!</h1>
                <h2>You have to login first!!!</h2>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
