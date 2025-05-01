import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from './components/ui/provider.tsx'
import { AuthProvider } from './context/auth.tsx'
import { BrowserRouter } from 'react-router-dom'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter> 
    <Provider> 
    <AuthProvider> 
      
    <App />
   
    </AuthProvider>
    </Provider>
    </BrowserRouter>
  </StrictMode>,
)
