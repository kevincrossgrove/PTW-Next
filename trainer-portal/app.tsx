import { BrowserRouter, Route, Routes } from "react-router";

import NotFoundPage from "@/trainer-portal/NotFoundPage";
import TrainerLayout from "./TrainerLayout";
import TrainerHome from "./TrainerHome/TrainerHome";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="trainer" element={<TrainerLayout />}>
            <Route index element={<TrainerHome />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
