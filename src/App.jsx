
import { ToastContainer, Bounce } from "react-toastify";
import './App.css'
import Home from './Pages/Home'
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login"; 
function App() { 
  return (
    <>
   <Routes>
      <Route path="/" element={<Home/>} />
      <Route path='/login' element={<Login/>}/>  
      </Routes>

    <ToastContainer
          position="top-center"
          autoClose={2000}
          theme="dark"
          transition={Bounce}
        />
    </>
  )
}

export default App
