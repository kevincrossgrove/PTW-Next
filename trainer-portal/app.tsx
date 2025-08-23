import { BrowserRouter, Route, Routes } from "react-router";

import NotFoundPage from "@/trainer-portal/NotFoundPage";
import TrainerContacts from "./TrainerContacts/TrainerContacts";
import TrainerHome from "./TrainerHome/TrainerHome";
import TrainerProfile from "./TrainerProfile/TrainerProfile";
import TrainerLayout from "./TrainerLayout";
import Providers from "@/lib/providers";

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TrainerLayout />}>
            <Route index element={<TrainerHome />} />
            <Route path="trainer" element={<TrainerHome />} />
            <Route path="trainer/contacts" element={<TrainerContacts />} />
            <Route path="trainer/profile" element={<TrainerProfile />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Providers>
  );
}
