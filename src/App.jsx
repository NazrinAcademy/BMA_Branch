import React from 'react'
// import '../src/App.css'
import Route1 from './components/Routes/Route1'
import { Provider } from 'react-redux'
import store from './redux/Store'

const App = () => {  
  return (
    <div>
      <Provider store={store}>
      <Route1/>
      {/* <Customer/> */}
      </Provider>
    </div>
  )
}

export default App



