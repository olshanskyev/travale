import { NbJSThemeOptions, DEFAULT_THEME as baseTheme } from '@nebular/theme';

const baseThemeVariables = baseTheme.variables;

export const DEFAULT_THEME = {
  name: 'default',
  base: 'default',
  variables: {

    bubbleMap: {
      titleColor: baseThemeVariables?.['fgText'],
      areaColor: baseThemeVariables?.['bg4'],
      areaHoverColor: baseThemeVariables?.['fgHighlight'],
      areaBorderColor: baseThemeVariables?.['border5'],
    },

  },
} as NbJSThemeOptions;
