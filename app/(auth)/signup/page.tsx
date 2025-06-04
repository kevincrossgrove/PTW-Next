import SignupCard from "@/components/auth/SignupCard";
import { Suspense } from "react";

export default function SignupPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center">
      <Suspense>
        <SignupCard />
      </Suspense>
    </div>
  );
}
