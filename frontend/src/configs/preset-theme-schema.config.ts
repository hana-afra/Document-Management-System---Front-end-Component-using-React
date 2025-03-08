export type Variables =
    | 'primary'
    | 'primaryDeep'
    | 'primaryMild'
    | 'primarySubtle'
    | 'neutral'

export type ThemeVariables = Record<'dark', Record<Variables, string>>

const purpleTheme: ThemeVariables = {
    dark: {
        primary: '#8C62FF',
        primaryDeep: '#704acc',
        primaryMild: '#a784ff',
        primarySubtle: '#8C62FF1a',
        neutral: '#ffffff',
    },
}

// Set Purple Dark as the only theme
const presetThemeSchemaConfig: Record<string, ThemeVariables> = {
    default: purpleTheme, 
}

export default presetThemeSchemaConfig
