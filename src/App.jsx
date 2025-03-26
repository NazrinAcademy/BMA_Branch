import React from 'react'
// import '../src/App.css'
import { Provider } from 'react-redux'
import store from './redux/Store'
import AppRoutes from '../src/routes/AppRoutes'

const App = () => {  
  return (
    <div>
      <Provider store={store}>
      <AppRoutes/>
      </Provider>
    </div>
  )
}

export default App



