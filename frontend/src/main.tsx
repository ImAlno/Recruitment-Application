/**
 * Application entry point.
 * Initializes the React root element, wraps the App in StrictMode and Suspense 
 * for handling internationalization loading, and imports global styles.
 */
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </StrictMode>,
)
