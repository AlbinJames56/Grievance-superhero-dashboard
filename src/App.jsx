
import { ToastContainer, Bounce } from "react-toastify";
import './App.css'
import Home from './Pages/Home'
import { Route, Routes } from "react-router-dom";
import Login from "./Pages/Login"; 
import { useContext } from "react";
import { TokenAuthContext } from "./ContextAPI/AuthContext";
function App() { 
  const {isAuthorized,setIsAuthorized}=useContext(TokenAuthContext)
  return (
    <>
   <Routes>
      <Route path="/" element={isAuthorized?<Home/>:<Login/>} />
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
