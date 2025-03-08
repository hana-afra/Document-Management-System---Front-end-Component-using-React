import conceptsNavigationConfig from './concepts.navigation.config'
import authNavigationConfig from './auth.navigation.config'
import type { NavigationTree } from '@/@types/navigation'

const navigationConfig: NavigationTree[] = [
    
    ...conceptsNavigationConfig,
    
    ...authNavigationConfig,
    
]

export default navigationConfig
