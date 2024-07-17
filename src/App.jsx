import "./index.css"
import ActionEditor from './components/ActionEditor'
import { ThemeProvider } from './components/theme-provider'

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <div className="App">
        <ActionEditor />
      </div>
    </ThemeProvider>
  )
}

export default App