<template>
  <div><AppHeader v-if="!isTableRoute" :key="storeStatusHeader"/></div>
  <div class="content">
    <router-view :key="routeKey"></router-view>
  </div>
    <div><AppFooter v-if="!isTableRoute"/></div>
</template>

<script>

import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'

export default {
  name: 'App',
  components: {
    AppHeader,
    AppFooter,
  },

  data() {
    return {
      statusHeader: 0
    };
  },

  methods: {
  },

  computed: {
    storeStatusHeader() {
      return this.$store.getters.getStatusHeader;
    },
    routeKey() {
      // Проверьте, соответствует ли текущий маршрут PlayerProfile
      if (this.$route.name == 'ProfilePage') {
        // console.log('routeKey = ', this.routeKey)
        return this.$route.params.user_id;
      } else {
        // console.log('routeKey = Null')
        return null; // Используйте null как ключ для других компонентов
      }
    },
    isTableRoute() {
      // Получите текущий путь из маршрутизатора
      const currentPath = this.$route.path;
      // Проверьте, является ли текущий путь маршрутом вида /table/:table_id
      return currentPath.startsWith('/table/');
    },
  }
}

</script>

<style>
#app {
    margin: 0;
    padding: 0;
    min-height: 100vh; /* Минимальная высота всего экрана */
    display: flex;
    flex-direction: column; /* Элементы будут располагаться вертикально */
    background: Honeydew;
}
.content {
    flex-grow: 1;
    background: LightGrey;
}
.full {
    width: 100%;
}

</style>
