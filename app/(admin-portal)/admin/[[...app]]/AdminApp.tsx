"use client";

import dynamic from "next/dynamic";
import Image from "next/image";

const App = dynamic(() => import("@/admin-portal/app"), {
  ssr: false,
  loading: () => {
    return (
      <div className="h-screen w-screen flex justify-center items-center">
        <div className="flex">
          <Image src="/ptw.png" alt="PTW Logo" width={80} height={80} />
        </div>
      </div>
    );
  },
});

export default function AdminApp() {
  return <App />;
}
