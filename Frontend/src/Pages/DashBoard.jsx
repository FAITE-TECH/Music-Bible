import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../Components/DashProfile";
import DashSideBar from "../Components/DashSideBar";
import DashUsers from "../Components/DashUsers";
import DashMusic from "../Components/DashMusic";
import DashMembership from "../Components/DashMembership";
import DashContactUs from "../Components/DashContactUs";







export default function DashBoard() {
  const location = useLocation();
  const[tab,setTab]= useState();

  useEffect(()=>{
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if(tabFromUrl){
      setTab(tabFromUrl)
    }
  },[location.search]);
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white py-20 px-6">
      <div className="md:w-56">
        <DashSideBar/>
      </div>
      {tab==='profile' && <DashProfile/>}
      {tab === 'users' && <DashUsers/>}
      {tab === 'music' && <DashMusic/>}
      {tab === 'membership' && <DashMembership/>}
      {tab === 'contact' && <DashContactUs/>}
     

   
     
    </div>
  )
}
