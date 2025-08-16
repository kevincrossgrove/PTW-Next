"use client";

import dynamic from "next/dynamic";
import AppLoader from "../../../../components/app/AppLoader";

const App = dynamic(() => import("@/trainer-portal/app"), {
  ssr: false,
  loading: () => {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <AppLoader />
      </div>
    );
  },
});

export default function TrainerApp() {
  return <App />;
}
