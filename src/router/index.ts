import Home from '../views/Home.vue'
import { routeMeta } from '../data/tools'
import { homeRouteModule, toolRouteModules } from './routeModules'

export const routes = [
  {
    path: homeRouteModule.path,
    name: homeRouteModule.name,
    component: Home,
    meta: routeMeta[homeRouteModule.path],
  },
  ...toolRouteModules.map((routeModule) => ({
    path: routeModule.path,
    name: routeModule.name,
    component: routeModule.loader,
    meta: routeMeta[routeModule.path],
  })),
]
