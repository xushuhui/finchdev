import type { ComponentResolver } from 'unplugin-vue-components/types'

export interface TDesignResolvedComponent {
  name: string
  from: string
}

type TDesignComponentName =
  | 'TAlert'
  | 'TButton'
  | 'TCard'
  | 'TCol'
  | 'TCollapse'
  | 'TCollapsePanel'
  | 'TContent'
  | 'TDivider'
  | 'TDropdown'
  | 'TFooter'
  | 'THeadMenu'
  | 'TInput'
  | 'TLayout'
  | 'TMenuItem'
  | 'TRow'
  | 'TSlider'
  | 'TSpace'
  | 'TSwitch'
  | 'TTag'
  | 'TTextarea'

const TDESIGN_COMPONENT_PATHS: Record<TDesignComponentName, [string, string]> = {
  TAlert: ['Alert', 'alert'],
  TButton: ['Button', 'button'],
  TCard: ['Card', 'card'],
  TCol: ['Col', 'grid'],
  TCollapse: ['Collapse', 'collapse'],
  TCollapsePanel: ['CollapsePanel', 'collapse'],
  TContent: ['Content', 'layout'],
  TDivider: ['Divider', 'divider'],
  TDropdown: ['Dropdown', 'dropdown'],
  TFooter: ['Footer', 'layout'],
  THeadMenu: ['HeadMenu', 'menu'],
  TInput: ['Input', 'input'],
  TLayout: ['Layout', 'layout'],
  TMenuItem: ['MenuItem', 'menu'],
  TRow: ['Row', 'grid'],
  TSlider: ['Slider', 'slider'],
  TSpace: ['Space', 'space'],
  TSwitch: ['Switch', 'switch'],
  TTag: ['Tag', 'tag'],
  TTextarea: ['Textarea', 'textarea'],
}

function isTDesignComponentName(componentName: string): componentName is TDesignComponentName {
  return componentName in TDESIGN_COMPONENT_PATHS
}

export function resolveTDesignComponent(componentName: string): TDesignResolvedComponent | undefined {
  if (!isTDesignComponentName(componentName)) {
    return undefined
  }

  const [name, path] = TDESIGN_COMPONENT_PATHS[componentName]
  return {
    name,
    from: `tdesign-vue-next/es/${path}`,
  }
}

export function createTDesignResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: resolveTDesignComponent,
  }
}
