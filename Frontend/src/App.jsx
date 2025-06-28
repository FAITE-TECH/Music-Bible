import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Pages/Home";
import SignUp from "./Pages/SignUp";
import SignIn from "./Pages/SignIn";
import ForgetPassword from "./Pages/ForgetPassword";
import ResetPassword from "./Pages/ResetPassword";
import DashBoard from "./Pages/DashBoard";
import PrivateRoute from "./Components/PrivateRoute";
import AddMusic from "./Pages/AddMusic";
import UpdateMusic from "./Pages/UpdateMusic";
import Music from "./Pages/Music";
import Album from "./Pages/Album";
import OrderSummary from "./Pages/Ordersummary";
import CheckoutSuccess from "./Pages/CheckoutSuccess";
import AddAlbum from "./Pages/AddAlbum";
import Membership from "./Pages/Membership";
import ContactUs from "./Pages/ContactUs";
// import AboutUs from './Pages/AboutUs'
import OnlyAdminPrivateRoute from "./Components/OnlyAdminPrivateRoute";
import ChatAI from "./Pages/ChatAI";
import PayButton from "./Components/PayButton";
import UpdateAlbum from "./Pages/UpdateAlbum";
import Blog from "./Pages/Blog";
import BlogPost from "./Pages/BLogPost";
import AIOrderSuccess from './Pages/AIOrderSuccess';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/musics" element={<Music />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/album" element={<Album />} />
        <Route path="/contactus" element={<ContactUs />} />
        <Route path="/pay" element={<PayButton />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        {/* <Route path="/aboutus" element={<AboutUs/>}/> */}
        <Route path="/bible/ai" element={<ChatAI />} />
        <Route path="/forgetPassword" element={<ForgetPassword />} />
        <Route path="/resetpassword/:id/:token" element={<ResetPassword />} />

        <Route element={<PrivateRoute/>}/>
          <Route path="/dashboard" element={<DashBoard/>}/> 
          <Route path="/order-summary" element={<OrderSummary/>}/>
          <Route path="/order-pay-success/:musicId/:userId" element={<CheckoutSuccess/>}/>
          <Route path="/ai-order-success/:userId" element={<AIOrderSuccess/>}/>
         
        <Route/> 

        <Route element={<OnlyAdminPrivateRoute/>}/>
          <Route path="/addmusic" element={<AddMusic/>}/>
          <Route path="/addalbum" element={<AddAlbum/>}/>
          <Route path="/update-music/:musicId" element={<UpdateMusic/>}/>
          <Route path="/update-album/:albumId" element={<UpdateAlbum/>}/>

        <Route/>
      </Routes>
    </BrowserRouter>
  );
}
