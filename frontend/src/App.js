import Login from './pages/Login'
import Register from './pages/registry'
import Projects from './pages/projects'
import Teams from './pages/teams'
import Tasks from './pages/tasks'
import Tools from './pages/tools'
import { Provider } from 'react-redux'
import store from './components/store'
import { Link, Route, Routes } from 'react-router-dom'
import Layout from './hocs/Layout'

function App() {
  return (
    <Provider store={store}>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Projects />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tools" element={<Tools />} />
        </Routes>
      </Layout>
    </Provider>
  );
}

export default App