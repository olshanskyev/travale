import { NbJSThemeOptions, COSMIC_THEME as baseTheme } from '@nebular/theme';

const baseThemeVariables = baseTheme.variables;

export const COSMIC_THEME = {
  name: 'cosmic',
  base: 'cosmic',
  variables: {

    bubbleMap: {
      titleColor: baseThemeVariables?.['fgText'],
      areaColor: baseThemeVariables?.['bg4'],
      areaHoverColor: baseThemeVariables?.['fgHighlight'],
      areaBorderColor: baseThemeVariables?.['border5'],
    },

  },
} as NbJSThemeOptions;
