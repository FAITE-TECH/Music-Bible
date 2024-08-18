import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './Components/Header'
import Home from './Pages/Home'
import SignUp from './Pages/SignUp'
import SignIn from './Pages/SignIn'
import ForgetPassword from './Pages/ForgetPassword'
import ResetPassword from './Pages/ResetPassword'
import DashBoard from './Pages/DashBoard'
import PrivateRoute from './Components/PrivateRoute'
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateroute'
import AddMusic from './Pages/AddMusic'
import UpdateMusic from './Pages/UpdateMusic'

export default function App() {
  return (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/forgetPassword" element={<ForgetPassword/>}/>
        <Route path="/resetpassword/:id/:token" element={<ResetPassword/>} />

        <Route element={<PrivateRoute/>}/>
          <Route path="/dashboard" element={<DashBoard/>}/> 
        <Route/> 

        <Route element={<OnlyAdminPrivateRoute/>}>
          <Route path="/addmusic" element={<AddMusic/>}/>
          <Route path="/update-music/:musicId" element={<UpdateMusic/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
