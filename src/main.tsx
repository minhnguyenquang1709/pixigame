import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { StoreProvider } from 'easy-peasy'
import { appStore } from './utils/app-store.ts'

createRoot(document.getElementById('root')!).render(
  <StoreProvider store={appStore}>
    <App />
  </StoreProvider>
)
