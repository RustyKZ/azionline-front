import { createRouter, createWebHistory } from 'vue-router'

// import App from './App.vue'
import Delete_Post from './components/Delete_Post.vue'
import Add_Post from './components/Add_Post.vue'
import Home_Page from './components/Home_Page.vue'
import Sign_Up from './components/Sign_Up.vue'
import Log_In from './components/Log_In.vue'
import PlayerProfile from './components/PlayerProfile.vue'
import AccessDenied from './components/AccessDenied.vue'
import Play_Tables from './components/Play_Tables.vue'
import Playing_Table from './components/Playing_Table.vue'
import Not_Found from './components/Not_Found.vue'

const router = createRouter({
  routes: [
    { path: '/', component: Home_Page },
    { path: '/deletepost', component: Delete_Post, meta: { requiresAuth: true } },
    { path: '/addpost', component: Add_Post, meta: { requiresAuth: true } },
    { path: '/signup', component: Sign_Up },
    { path: '/login', component: Log_In },
    { path: '/access_denied', component: AccessDenied },
    { path: '/404', component: Not_Found },

    { path: '/tables', component: Play_Tables, name: 'TablesPage' },
    { path: '/profile/:user_id', component: PlayerProfile, name: 'ProfilePage' },
    { path: '/table/:table_id', component: Playing_Table, name: 'PlayingTablePage' },
   ],
  history: createWebHistory()
})

export default router;