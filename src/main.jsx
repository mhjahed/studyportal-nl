import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './context/AuthContext'
import { dataService } from './services/dataService'

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

// Global SCSS
import './assets/scss/main.scss'
import './components/PortalDropdown.scss'

async function boot() {
  // Load remote data FIRST, then mount the app
  try {
    await dataService.initialize()
  } catch (err) {
    console.error('[Boot] Data initialization failed:', err)
  }

  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </React.StrictMode>
  )
}

boot()