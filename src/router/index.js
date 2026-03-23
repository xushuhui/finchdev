import Home from '../views/Home.vue'
import JsonFormatter from '../views/JsonFormatter.vue'
import RegexTester from '../views/RegexTester.vue'
import Base64Tool from '../views/Base64Tool.vue'
import TimestampConverter from '../views/TimestampConverter.vue'
import UrlEncoder from '../views/UrlEncoder.vue'
import HashGenerator from '../views/HashGenerator.vue'
import UUIDGenerator from '../views/UUIDGenerator.vue'
import ColorConverter from '../views/ColorConverter.vue'
import JWTDecoder from '../views/JWTDecoder.vue'
import MarkdownPreview from '../views/MarkdownPreview.vue'
import CronGenerator from '../views/CronGenerator.vue'
import QrCodeGenerator from '../views/QrCodeGenerator.vue'
import YamlJsonConverter from '../views/YamlJsonConverter.vue'
import DiffChecker from '../views/DiffChecker.vue'
import HtmlEntityEncoder from '../views/HtmlEntityEncoder.vue'
import { routeMeta } from '../data/tools'

export const routes = [
  { path: '/', name: 'home', component: Home, meta: routeMeta['/'] },
  { path: '/json-formatter', name: 'json-formatter', component: JsonFormatter, meta: routeMeta['/json-formatter'] },
  { path: '/regex-tester', name: 'regex-tester', component: RegexTester, meta: routeMeta['/regex-tester'] },
  { path: '/base64', name: 'base64', component: Base64Tool, meta: routeMeta['/base64'] },
  { path: '/timestamp', name: 'timestamp', component: TimestampConverter, meta: routeMeta['/timestamp'] },
  { path: '/url-encoder', name: 'url-encoder', component: UrlEncoder, meta: routeMeta['/url-encoder'] },
  { path: '/hash-generator', name: 'hash-generator', component: HashGenerator, meta: routeMeta['/hash-generator'] },
  { path: '/uuid-generator', name: 'uuid-generator', component: UUIDGenerator, meta: routeMeta['/uuid-generator'] },
  { path: '/color-converter', name: 'color-converter', component: ColorConverter, meta: routeMeta['/color-converter'] },
  { path: '/jwt-decoder', name: 'jwt-decoder', component: JWTDecoder, meta: routeMeta['/jwt-decoder'] },
  { path: '/markdown-preview', name: 'markdown-preview', component: MarkdownPreview, meta: routeMeta['/markdown-preview'] },
  { path: '/cron-generator', name: 'cron-generator', component: CronGenerator, meta: routeMeta['/cron-generator'] },
  { path: '/qr-code-generator', name: 'qr-code-generator', component: QrCodeGenerator, meta: routeMeta['/qr-code-generator'] },
  { path: '/yaml-json-converter', name: 'yaml-json-converter', component: YamlJsonConverter, meta: routeMeta['/yaml-json-converter'] },
  { path: '/diff-checker', name: 'diff-checker', component: DiffChecker, meta: routeMeta['/diff-checker'] },
  { path: '/html-entity-encoder', name: 'html-entity-encoder', component: HtmlEntityEncoder, meta: routeMeta['/html-entity-encoder'] },
]
