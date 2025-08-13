import { BrowserRouter, Route, Routes } from "react-router";

import NotFoundPage from "@/trainer-portal/NotFoundPage";
import TrainerContacts from "./TrainerContacts/TrainerContacts";
import TrainerHome from "./TrainerHome/TrainerHome";
import TrainerLayout from "./TrainerLayout";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TrainerLayout />}>
            <Route index element={<TrainerHome />} />
            <Route path="trainer" element={<TrainerHome />} />
            <Route path="trainer/contacts" element={<TrainerContacts />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
