<script>
    export default {
        name: 'Donation_Page',
        data() {
            return {

            };
        },
        mounted() {        

        },
        
    };

</script>

<template>
    <div class="mainbox">
        <div class="container">
            <h3>You can sopport the project</h3>
            <!-- Используйте цикл v-for для вывода каждой записи в массиве posts -->            
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
