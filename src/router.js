import { createRouter, createWebHistory } from 'vue-router'
import DotaHome from './views/Home.vue';
import DotaPlayers from './views/Players.vue';
import DotaTeams from './views/Teams.vue';
import ItemCard from './components/ItemCard.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DotaHome
  },
  {
    path: '/players',
    name: 'DotaPlayers',
    component: DotaPlayers
  },
  {
    path: '/teams',
    name: 'DotaTeams',
    component: DotaTeams
  },
  {
    path: '/item/:id/:type',
    name: 'ItemCard',
    component: ItemCard
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router;
