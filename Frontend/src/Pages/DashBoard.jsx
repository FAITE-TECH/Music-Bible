import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashProfile from "../Components/DashProfile";
import DashSideBar from "../Components/DashSideBar";
import DashUsers from "../Components/DashUsers";
import DashMusic from "../Components/DashMusic";
import DashMembership from "../Components/DashMembership";
import DashContactUs from "../Components/DashContactUs";
import DashAlbums from "../Components/DashAlbums";
import DashAIOrderd from "../Components/DashAIOrderd";
import DashBlogs from "../Components/DashBlogs";
import DashMusicPurchase from "../Components/DashMusicPurchase";
import DashMyPurches from "../Components/DashMyPurches";







export default function DashBoard() {
  const location = useLocation();
  const [tab, setTab] = useState();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-black text-white">
      {/* Sidebar - fixed width */}
      <div className="md:w-56">
        <DashSideBar />
      </div>
      
      {/* Main Content - flex-1 to take remaining space */}
      <div className="flex-1 overflow-auto">
        {tab === 'profile' && <DashProfile />}
        {tab === 'users' && <DashUsers />}
        {tab === 'music' && <DashMusic />}
        {tab === 'membership' && <DashMembership />}
        {tab === 'contact' && <DashContactUs />}
        {tab === 'albums' && <DashAlbums />}
        {tab === 'API' && <DashAIOrderd />}
        {tab === 'blogs' && <DashBlogs />}
        {tab === 'purchase' && <DashMusicPurchase />}
        {tab === 'mypurchase' && <DashMyPurches />}
      </div>
    </div>
  );
}