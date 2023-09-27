<template>
  <div><AppHeader/></div>
  <div class="content">
    <Deletepost_content/>
  </div>
  <div><AppFooter/></div>
  
</template>

<script>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import Deletepost_content from './Deletepost_content.vue'

export default {
  name: 'Delete_Post',
  components: {
    AppHeader,
    AppFooter,
    Deletepost_content,
}
}
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Mukta:wght@400;600;800&family=Roboto:wght@400;700;900&display=swap');
#app {
    margin: 0;
    padding: 0;
    min-height: 100vh; /* Минимальная высота всего экрана */
    display: flex;
    flex-direction: column; /* Элементы будут располагаться вертикально */
    font-family: 'Roboto', sans-serif;
}
.content {
    flex-grow: 1;
}

</style>
