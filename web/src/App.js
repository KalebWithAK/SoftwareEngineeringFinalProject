//import logo from './logo.svg'
import './App.css'
import {
  Switch,
  Route,
  BrowserRouter as Router
} from 'react-router-dom'
import Home from './pages/home.js'
import Settings from './pages/settings.js'
import ViewPost from './pages/viewPost.js'
import Top from './components/top.js'

function App() {
  const routes = [
    { path: '/settings', component: <Settings /> },
    { path: '/viewpost', component: <ViewPost /> },
    { path: '/', component: <Home /> }

  ]
  return (
    <div className="App">
      <Router>
        <Top />

        <Switch>
          { routes.map(route => <Route path={ route.path }>{ route.component }</Route> ) }
        </Switch>
      </Router>
    </div>
  )
}

export default App
