import { createRouter, createWebHistory } from 'vue-router'
import DotaHome from './views/Home.vue';
import DotaPlayers from './views/Players.vue';
import DotaTeams from './views/Teams.vue';
import DotaMatches from './views/Matches.vue';
import MatchDetail from './views/MatchDetail.vue';
import PlayerDetail from './views/PlayerDetail.vue';
// TODO: Re-enable when player search is turned back on
// import SearchPage from './views/Search.vue';
import MetaPage from './views/Meta.vue';
import LeaguesPage from './views/Leagues.vue';
import LeagueDetail from './views/LeagueDetail.vue';
import ItemCard from './components/ItemCard.vue';

const routes = [
  {
    path: '/',
    name: 'MetaPage',
    component: MetaPage
  },
  {
    path: '/heroes',
    name: 'Heroes',
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
    path: '/leagues',
    name: 'DotaLeagues',
    component: LeaguesPage
  },
  {
    path: '/league/:id',
    name: 'LeagueDetail',
    component: LeagueDetail
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
  // TODO: Re-enable player search route when OpenDota /search is fast and returns relevant names
  // {
  //   path: '/search',
  //   name: 'SearchPage',
  //   component: SearchPage
  // },
  {
    path: '/meta',
    redirect: '/',
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
