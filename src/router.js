import { createRouter, createWebHistory } from 'vue-router'
import DotaHome from './views/Home.vue';
import DotaPlayers from './views/Players.vue';
import DotaTeams from './views/Teams.vue';
import DotaMatches from './views/Matches.vue';
import MatchDetail from './views/MatchDetail.vue';
import PlayerDetail from './views/PlayerDetail.vue';
import MetaPage from './views/Meta.vue';
import ItemCard from './components/ItemCard.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: DotaHome
  },
  {
    path: '/teams',
    name: 'DotaTeams',
    component: DotaTeams
  },
  {
    path: '/players',
    name: 'DotaPlayers',
    component: DotaPlayers
  },
  {
    path: '/matches',
    name: 'DotaMatches',
    component: DotaMatches
  },
  {
    path: '/match/:id',
    name: 'MatchDetail',
    component: MatchDetail
  },
  {
    path: '/player/:id',
    name: 'PlayerDetail',
    component: PlayerDetail
  },
  {
    path: '/meta',
    name: 'MetaPage',
    component: MetaPage
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
});

export default router;
