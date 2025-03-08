import { BrowserRouter } from 'react-router-dom'
import Layout from '@/components/layouts'
import { AuthProvider } from '@/auth'
import Views from '@/views'
import appConfig from './configs/app.config'
import './locales'

if (appConfig.enableMock) {
    
}

function App() {
    return (
       
            <BrowserRouter>
                <AuthProvider>
                    <Layout>
                        <Views />
                    </Layout>
                </AuthProvider>
            </BrowserRouter>
       
    )
}

export default App
