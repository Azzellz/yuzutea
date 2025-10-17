import { createRoot } from 'react-dom/client'
import '@/assets/less/index.less'
import 'virtual:uno.css'
import App from './App'

createRoot(document.getElementById('root')!).render(<App />)
