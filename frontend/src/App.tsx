import AppRoutes from './routes'
import './App.css'
import { AuthProvider } from './components/auth/AuthProvider'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
