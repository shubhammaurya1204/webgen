import React from 'react'
import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import useGetCurrentUser from './hooks/useGetCurrentUser';
import { useSelector } from 'react-redux';
import Dashboard from './pages/Dashboard';
import Generate from './pages/Generate';
import WebsiteEditor from './pages/WebsiteEditor';
import LiveSite from './pages/LiveSite';
import Pricing from './pages/Pricing';
import LoginModal from './components/loginModal';
export const serverUrl = "https://webgen-e51x.onrender.com"

function App() {
  useGetCurrentUser(); // Persistant Authentication
  const {userData} = useSelector(state=>state.user)
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Home/>} /> // unprotected route
      {/* Dashboard Route */}  // we need to protect that routes, that route only share wit authenticated user 
      <Route path='/dashboard' element={userData?<Dashboard/>:<Home/>} />
      {/* Generate Route */}
      <Route path='/generate' element={userData?<Generate/>:<Home/>} />
      {/* Editor Route */}
      <Route path='/editor/:id' element={userData?<WebsiteEditor/>:<Home/>} />
      {/* Live Site */}
      <Route path='/site/:id' element={<LiveSite/>} />
      {/* Pricing Page */}
      <Route path='/pricing' element={userData?<Pricing/>:""} />

    </Routes>
    </BrowserRouter>
  )
}

export default App
