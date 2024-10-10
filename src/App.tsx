import { useState } from 'react'

import './App.css'
import WebNav from './customizedComponents/WebNav'
import MobileNav from './customizedComponents/MobileNav'



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <WebNav/>
      <MobileNav/>

    </>
  )
}

export default App
