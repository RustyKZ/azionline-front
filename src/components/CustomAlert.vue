<template>
    <div class="custom-alert" v-if="showAlert">
        <div class="alert-content">
            <h2>{{ title }}</h2>
            <p>{{ message }}</p>
            <button @click="closeAlert">OK</button>
        </div>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            showAlert: false,
            title: '',
            message: '',
        };
    },
    methods: {
        openAlert(title, message) {
            this.title = title;
            this.message = message;
            this.showAlert = true;
        },
        closeAlert() {
            this.showAlert = false;
        },
    },
};
</script>
  
<style scoped>
.custom-alert {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1000;
    background: white;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
    padding: 20px;
    max-width: 80%;
}

.alert-content {
    text-align: center;
}

.custom-alert button {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
}
</style>
  