"use client";

export default function SignOutButton() {
  return (
    <button
      onClick={async () => {
        await fetch("/api/auth/sign-out", { method: "POST" });
        window.location.reload();
      }}
      className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
    >
      Sign Out
    </button>
  );
}