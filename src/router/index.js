import Home from '../views/Home.vue'
import JsonFormatter from '../views/JsonFormatter.vue'
import RegexTester from '../views/RegexTester.vue'
import Base64Tool from '../views/Base64Tool.vue'
import TimestampConverter from '../views/TimestampConverter.vue'
import UrlEncoder from '../views/UrlEncoder.vue'
import { routeMeta } from '../data/tools'

export const routes = [
  { path: '/', name: 'home', component: Home, meta: routeMeta['/'] },
  {
    path: '/json-formatter',
    name: 'json-formatter',
    component: JsonFormatter,
    meta: routeMeta['/json-formatter'],
  },
  {
    path: '/regex-tester',
    name: 'regex-tester',
    component: RegexTester,
    meta: routeMeta['/regex-tester'],
  },
  {
    path: '/base64',
    name: 'base64',
    component: Base64Tool,
    meta: routeMeta['/base64'],
  },
  {
    path: '/timestamp',
    name: 'timestamp',
    component: TimestampConverter,
    meta: routeMeta['/timestamp'],
  },
  {
    path: '/url-encoder',
    name: 'url-encoder',
    component: UrlEncoder,
    meta: routeMeta['/url-encoder'],
  },
]
