import { Outlet } from "react-router-dom";

import { SidebarProvider } from "../context/SidebarContext";
import Sidebar from "../components/admin/sidebar/Sidebar";
import AdminNavbar from "../components/admin/AdminNavbar";

const BaseLayout = () => {
  return (
    <main className="page-wrapper">
      {/* left of page */}
      <SidebarProvider>
      <Sidebar/>
      {/* right side/content of the page */}
      <div className="content-wrapper">
        <AdminNavbar/>
        <Outlet />
      </div>
      </SidebarProvider>
    </main>
  );
};

export default BaseLayout;
