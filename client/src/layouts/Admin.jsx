import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Container } from "reactstrap";
import AdminNavbar from "components/Navbars/AdminNavbar";
import AdminFooter from "components/Footers/AdminFooter";
import Sidebar from "components/Sidebar/Sidebar";

const Admin = () => {
  const mainContent = useRef(null);
  const location = useLocation();

  // Reset scroll position when location changes
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);
  const getUserRole =  localStorage.getItem('role'); 

  console.log(getUserRole);
  return (
    <>
      <Sidebar
        logo={{
          innerLink: "/admin/index",
          imgSrc: require("../assets/img/brand/nasarna.png"),
          imgAlt: "Nasarna Logo",
        }}
  
        routes={[
    { layout: `/admin`, path: "/index", name: "Dashboard", icon: "ni ni-tv-2 text-green" },

    {layout: `/admin`, path: "/trustees", name: "Trustees", icon: "ni ni-single-02 text-green"},
    {layout: `/admin`, path: "/donors", name: "Donors", icon: "ni ni-diamond text-green" },
    {layout: `/admin`, path: "/donations", name: "Donations", icon: "ni ni-money-coins text-green" },
    {layout: `/admin`, path: "/causes", name: "Causes", icon: "ni ni-album-2 text-green" },
    {layout: `/admin`, path: "/user-profile", name: "User Profile", icon: "ni ni-circle-08 text-green" },
   
  ]}
  />
      <div className="main-content" ref={mainContent}>
        <AdminNavbar />
        {/* Render the nested routes defined in AppRoutes */}
        <Outlet />
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
