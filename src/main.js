import { createApp } from 'vue'
import App from './App.vue'
import router from './app_routes'
import store from './store.js'

import 'bootstrap/dist/css/bootstrap.css' // Импорт стилей Bootstrap
import 'bootstrap-vue/dist/bootstrap-vue.css' // Импорт стилей Bootstrap-Vue
import 'bootstrap'
// import { BootstrapVue3 } from 'bootstrap-vue'

import io from 'socket.io-client';

const app = createApp(App)

app.use(store); // Используйте хранилище Vuex в приложении

app.config.globalProperties.serverUrl = 'http://127.0.0.1:8000'
app.config.globalProperties.tokenContractAddress = '0xa12f829A5feFCbA0390dc71c28C6824401680Aa0'
app.config.globalProperties.hostWalletAddress = '0x5B4c138eb869Cb2Ad29414912d21E40ecAB4BFbA'

export const serverUrl = 'http://127.0.0.1:8000'
export const userTokenContract = '0xa12f829A5feFCbA0390dc71c28C6824401680Aa0'
export const hostWalletAddress = '0x5B4c138eb869Cb2Ad29414912d21E40ecAB4BFbA'

app.use(router)
app.use(store)

const socket = io(serverUrl); // Замените URL и порт на ваш сервер Socket.IO

// const app = createApp(App);

app.config.globalProperties.$socket = socket;


router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
      if (store.getters.isAuthenticated) {
        next();
      } else {
        next('/access_denied'); // Перенаправьте на страницу входа
      }
    } else {
      next();
    }
  });

// Обработчик события "connect" (установление соединения)
socket.on("connect", () => {
  console.log("Соединение установлено");
});

// Обработчик события "disconnect" (разрыв соединения)
socket.on("disconnect", () => {
  console.log("Соединение разорвано");
});

app.mount('#app')

// createApp(App).mount('#app')