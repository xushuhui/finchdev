export interface ToolDefinition {
  name: string
  path: `/${string}`
  icon: string
  cardDescription: string
  h1: string
  title: string
  description: string
}

export interface RouteMetaDefinition extends Record<string, unknown> {
  title: string
  description: string
  url: string
}

export interface HomeRouteModule {
  name: 'home'
  path: '/'
  file: string
  importMode: 'sync'
}

export interface ToolRouteModule {
  name: string
  path: `/${string}`
  file: string
  importMode: 'async'
  loader: () => Promise<unknown>
}

export type RouteModule = HomeRouteModule | ToolRouteModule
