import { RouterProvider } from 'react-router-dom'
import './App.scss'
import router from './router/router'

function App() {
  return (
    <div>
      <RouterProvider router={router}></RouterProvider>
    </div>
  )
}

export default App
