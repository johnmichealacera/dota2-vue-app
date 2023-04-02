import { createRouter, createWebHistory } from 'vue-router'
import DotaHome from './views/Home.vue';
import HeroCard from './components/HeroCard.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DotaHome
  },
  {
    path: '/hero/:id',
    name: 'HeroCard',
    component: HeroCard
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
