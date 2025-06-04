import LoginCard from "@/components/auth/LoginCard";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Suspense>
        <LoginCard />
      </Suspense>
    </div>
  );
}
