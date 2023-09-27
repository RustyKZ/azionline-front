import { createRouter, createWebHistory } from 'vue-router';

// Импортируйте компоненты, которые будут использоваться в маршрутах
import App from './App.vue';
import Delete_Post from './components/Delete_Post.vue';

const routes = [
  {
    path: '/',
    name: 'home',
    component: App,
  },
  {
    path: '/deletepost',
    name: 'deletepost',
    component: Delete_Post,
  },
  // Добавьте другие маршруты здесь, если нужно
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
