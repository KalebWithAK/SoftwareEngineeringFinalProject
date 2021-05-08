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
import CustomEditor from './pages/customEditor.js'
import TemplateEditor from './pages/templateEditor.js'
import Top from './components/top.js'
import CreatorManagement from './pages/creatorManagement'
import Login from './pages/login'
import Register from './pages/register'


function App() {
  const routes = [
    { path: '/settings', component: Settings, id: 0 },
    { path: '/viewpost/:id', component: ViewPost, id: 1 },
    { path: '/templateEditor', component: TemplateEditor, id: 2 },
    { path: '/customEditor', component: CustomEditor, id: 3 },
    { path: '/creatorManagement', component: CreatorManagement, id: 4 },
    { path: '/login', component: Login, id: 5 },
    { path: '/register', component: Register, id: 6 },
    { path: '/', component: Home, id: 7 }
  ]
  
  return (
    <div className="App">
      <Router>
        <Top />

        <Switch>
          { routes.map(route => <Route key={ route.id } path={ route.path } component={ route.component } /> ) }
        </Switch>
      </Router>
    </div>
  )
}

export default App
