import { createApp } from 'vue'
import App from './App.vue'
import store from './store.js'
import router from './app_routes'

import 'bootstrap/dist/css/bootstrap.css' // Импорт стилей Bootstrap
import 'bootstrap'

import io from 'socket.io-client';

const app = createApp(App)

app.use(store); // Используйте хранилище Vuex в приложении


// app.config.globalProperties.serverUrl = 'http://127.0.0.1:5000'
app.config.globalProperties.serverUrl = 'http://128.199.144.202:8080'
app.config.globalProperties.tokenContractAddress = '0xE8544773D7217Ff4Bb6A19636779139460A87ecd'
app.config.globalProperties.hostWalletAddress = '0x5B4c138eb869Cb2Ad29414912d21E40ecAB4BFbA'

// export const serverUrl = 'http://127.0.0.1:5000'
export const serverUrl = 'http://128.199.144.202:8080'
export const userTokenContract = '0xE8544773D7217Ff4Bb6A19636779139460A87ecd'
export const hostWalletAddress = '0x5B4c138eb869Cb2Ad29414912d21E40ecAB4BFbA'

app.use(router)


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