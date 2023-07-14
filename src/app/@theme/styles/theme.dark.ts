import { NbJSThemeOptions, DARK_THEME as baseTheme } from '@nebular/theme';

const baseThemeVariables = baseTheme.variables;

export const DARK_THEME = {
  name: 'dark',
  base: 'dark',
  variables: {

    bubbleMap: {
      titleColor: baseThemeVariables?.['fgText'],
      areaColor: baseThemeVariables?.['bg4'],
      areaHoverColor: baseThemeVariables?.['fgHighlight'],
      areaBorderColor: baseThemeVariables?.['border5'],
    },

  },
} as NbJSThemeOptions;
