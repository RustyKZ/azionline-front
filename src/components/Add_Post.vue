<template>
  <div><AppHeader/></div>
  <div class="content">
    <Addpost_content/>
  </div>
  <div><AppFooter/></div>
  
</template>

<script>
import AppHeader from './AppHeader.vue'
import AppFooter from './AppFooter.vue'
import Addpost_content from './Addpost_content.vue'

export default {
  name: 'Add_Post',
  components: {
    AppHeader,
    AppFooter,
    Addpost_content,
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
