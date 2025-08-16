import { BrowserRouter, Route, Routes } from "react-router";

import NotFoundPage from "@/admin-portal/NotFoundPage";
import AdminHome from "./AdminHome/AdminHome";
import AdminLayout from "./AdminLayout";
import AdminUsers from "./AdminUsers/AdminUsers";
import Contacts from "./Contacts/Contacts";
import Invites from "./Invites/Invites";
import Parents from "./Parents/Parents";
import Players from "./Players/Players";
import Trainers from "./Trainers/Trainers";
import Users from "./Users/Users";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="admin" element={<AdminHome />} />
          <Route path="admin/home" element={<AdminHome />} />
          <Route path="admin/admin-users" element={<AdminUsers />} />
          <Route path="admin/contacts" element={<Contacts />} />
          <Route path="admin/invites" element={<Invites />} />
          <Route path="admin/parents" element={<Parents />} />
          <Route path="admin/players" element={<Players />} />
          <Route path="admin/trainers" element={<Trainers />} />
          <Route path="admin/users" element={<Users />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
