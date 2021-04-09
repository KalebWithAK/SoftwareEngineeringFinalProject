//import logo from './logo.svg'
import './App.css'
import {
  Switch,
  Route,
  BrowserRouter as Router
} from 'react-router-dom'
import Home from './pages/home.js'
import Settings from './pages/settings.js'
import Top from './components/top.js'

function App() {
  return (
    <div className="App">
      <Router>
        <Top />

        <Switch>
          <Route path='/settings'><Settings /></Route>
          <Route path='/'><Home /></Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
