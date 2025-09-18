import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiArchive,
  HiArrowSmRight,
  HiGift,
  HiMusicNote,
  HiOutlineMail,
  HiOutlineMusicNote,
  HiOutlineUserGroup,
  HiUser,
  HiMenu,
  HiX,
  HiBookOpen,
  HiPaperClip,
  HiBookmarkAlt,
  HiDownload,
  HiOutlineDownload,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function DashSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const [tab, setTab] = useState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      await fetch("/api/user/signout");
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden absolute top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className="p-2 mt-11 rounded-md text-white bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0]"
        >
          {isMobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-14 h-[calc(100vh-56px)] w-3/4 md:w-56 z-40 transform transition-all duration-300 ease-in-out ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="h-full p-0">
          <Sidebar className="w-full h-full bg-black">
            <Sidebar.Items className="flex flex-col h-full">
              <Sidebar.ItemGroup className="flex-grow">
                <Link
                  to="/dashboard?tab=profile"
                  key="profile"
                  className="block"
                  onClick={handleLinkClick}
                >
                  <Sidebar.Item
                    active={tab === "profile"}
                    icon={HiUser}
                    label={currentUser?.isAdmin ? "Admin" : "User"}
                    labelColor="dark"
                    as="div"
                    className={`w-full px-4 py-3 transition-all duration-300 ${
                      tab === "profile"
                        ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
                        : "hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white"
                    }`}
                  >
                    Profile
                  </Sidebar.Item>
                </Link>
                <Link
                  to="/dashboard?tab=mypurchase"
                  key="mypurchase"
                  className="block"
                  onClick={handleLinkClick}
                >
                  <Sidebar.Item
                    active={tab === "mypurchase"}
                    icon={HiOutlineDownload}
                    as="div"
                    className={`w-full px-4 py-3 transition-all duration-300 ${
                      tab === "mypurchase"
                        ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
                        : "hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white"
                    }`}
                  >
                    My Downloads
                  </Sidebar.Item>
                </Link>

                {currentUser?.isAdmin && (
                  <>
                    <Link
                      to="/dashboard?tab=users"
                      key="users"
                      className="block"
                      onClick={handleLinkClick}
                    >
                      <Sidebar.Item
                        active={tab === "users"}
                        icon={HiOutlineUserGroup}
                        as="div"
                        className={`w-full px-4 py-3 transition-all duration-300 ${
                          tab === "users"
                            ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
                            : "hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white"
                        }`}
                      >
                        Users
                      </Sidebar.Item>
                    </Link>

                    <Link
                      to="/dashboard?tab=music"
                      key="music"
                      className="block"
                      onClick={handleLinkClick}
                    >
                      <Sidebar.Item
                        active={tab === "music"}
                        icon={HiMusicNote}
                        as="div"
                        className={`w-full px-4 py-3 transition-all duration-300 ${
                          tab === "music"
                            ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
                            : "hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white"
                        }`}
                      >
                        Musics
                      </Sidebar.Item>
                    </Link>

                    <Link
                      to="/dashboard?tab=contact"
                      key="contact"
                      className="block"
                      onClick={handleLinkClick}
                    >
                      <Sidebar.Item
                        active={tab === "contact"}
                        icon={HiOutlineMail}
                        as="div"
                        className={`w-full px-4 py-3 transition-all duration-300 ${
                          tab === "contact"
                            ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
                            : "hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white"
                        }`}
                      >
                        Contact Requests
                      </Sidebar.Item>
                    </Link>

                    <Link
                      to="/dashboard?tab=albums"
                      key="albums"
                      className="block"
                      onClick={handleLinkClick}
                    >
                      <Sidebar.Item
                        active={tab === "albums"}
                        icon={HiBookOpen}
                        as="div"
                        className={`w-full px-4 py-3 transition-all duration-300 ${
                          tab === "albums"
                            ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
                            : "hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white"
                        }`}
                      >
                        Music Albums
                      </Sidebar.Item>
                    </Link>

                    <Link
                      to="/dashboard?tab=API"
                      key="API"
                      className="block"
                      onClick={handleLinkClick}
                    >
                      <Sidebar.Item
                        active={tab === "API"}
                        icon={HiPaperClip}
                        as="div"
                        className={`w-full px-4 py-3 transition-all duration-300 ${
                          tab === "API"
                            ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
                            : "hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white"
                        }`}
                      >
                        API Orders
                      </Sidebar.Item>
                    </Link>
                    <Link
                      to="/dashboard?tab=purchase"
                      key="purchase"
                      className="block"
                      onClick={handleLinkClick}
                    >
                      <Sidebar.Item
                        active={tab === "purchase"}
                        icon={HiDownload}
                        as="div"
                        className={`w-full px-4 py-3 transition-all duration-300 ${
                          tab === "purchase"
                            ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
                            : "hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white"
                        }`}
                      >
                        Music Downloads
                      </Sidebar.Item>
                    </Link>
                    <Link
                      to="/dashboard?tab=blogs"
                      key="blogs"
                      className="block"
                      onClick={handleLinkClick}
                    >
                      <Sidebar.Item
                        active={tab === "blogs"}
                        icon={HiBookmarkAlt}
                        as="div"
                        className={`w-full px-4 py-3 transition-all duration-300 ${
                          tab === "blogs"
                            ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
                            : "hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white"
                        }`}
                      >
                        Blogs
                      </Sidebar.Item>
                    </Link>

                    <Link
                      to="/dashboard?tab=membership"
                      key="membership"
                      className="block"
                      onClick={handleLinkClick}
                    >
                      <Sidebar.Item
                        active={tab === "membership"}
                        icon={HiGift}
                        as="div"
                        className={`w-full px-4 py-3 transition-all duration-300 ${
                          tab === "membership"
                            ? "bg-gradient-to-r from-[#0119FF] via-[#0093FF] to-[#3AF7F0] text-white"
                            : "hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white"
                        }`}
                      >
                        Membership Req
                      </Sidebar.Item>
                    </Link>
                  </>
                )}
              </Sidebar.ItemGroup>

              <Sidebar.ItemGroup className="mt-auto">
                <Sidebar.Item
                  icon={HiArrowSmRight}
                  className="w-full px-4 py-3 cursor-pointer hover:bg-gradient-to-r hover:from-[#0119FF] hover:via-[#0093FF] hover:to-[#3AF7F0] hover:text-white transition-all duration-300"
                  onClick={() => {
                    handleSignOut();
                    handleLinkClick();
                  }}
                  key="signout"
                >
                  Sign Out
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </Sidebar>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleMobileMenu}
        />
      )}
    </>
  );
}
