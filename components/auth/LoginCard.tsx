"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authClient } from "../../lib/auth-client";
import { AppAlertDestructive } from "../app/AppAlertDestructive";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  const router = useRouter();
  const search = useSearchParams();
  const inviteID = search.get("inviteID");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col justify-center items-center">
        <a href="https://www.trainwithptw.com/" tabIndex={-1}>
          <Image src="/ptw.png" alt="PTW Logo" width={80} height={80} />
        </a>
        <CardTitle className="pt-3 text-xl">
          Login to PTW Sports Training
        </CardTitle>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          emailPasswordLogin();
        }}
      >
        <CardContent>
          <Button
            variant="outline"
            className="w-full bg-transparent"
            disabled={loadingGoogle}
            type="button"
            onClick={googleLogin}
          >
            <Image src="/google.svg" height={20} width={20} alt="Google Icon" />
            {loadingGoogle
              ? "Continuing with Google..."
              : "Continue with Google"}
          </Button>
          {/* OR separator */}
          <div className="flex items-center my-7">
            <span className="flex-grow border-t border-accent"></span>
            <span className="mx-2 text-sm text-muted-foreground">OR</span>
            <span className="flex-grow border-t border-accent"></span>
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <Label htmlFor="name" className="mb-2">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="framework" className="mb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          {errorMessage ? (
            <AppAlertDestructive description={errorMessage} />
          ) : (
            <div className=""></div>
          )}
          <div className="w-full flex justify-end mt-3">
            <Button
              type="submit"
              loading={submitting}
              disabled={loadingGoogle}
              loadingText="Logging in..."
              className="w-full"
            >
              Login
            </Button>
          </div>
          <CardDescription className="text-sm pt-1">
            New here?{" "}
            <Link
              href={`/signup${inviteID ? `?inviteID=${inviteID}` : ""}`}
              className="text-foreground underline"
            >
              Create an account
            </Link>
          </CardDescription>
        </CardFooter>
      </form>
    </Card>
  );

  async function googleLogin() {
    setLoadingGoogle(true);

    await authClient.signIn.social({
      provider: "google",
      newUserCallbackURL: inviteID ? `/invite/${inviteID}` : "/dashboard",
      callbackURL: inviteID ? `/invite/${inviteID}` : "/dashboard",
      errorCallbackURL: "/login",
    });

    setTimeout(() => setLoadingGoogle(false), 500);
  }

  async function emailPasswordLogin() {
    if (!email || !password) {
      return setErrorMessage("Please fill in all fields.");
    }

    setSubmitting(true);

    const { data, error } = await authClient.signIn.email({
      email: email,
      password: password,
    });

    if (error) {
      setSubmitting(false);

      if (error.code === "USER_NOT_FOUND") {
        return setErrorMessage("No account with this email exists.");
      }

      console.log(error);
      return;
    }

    router.push(inviteID ? `/invite/${inviteID}` : "/dashboard");

    setTimeout(() => setSubmitting(false), 500);

    console.log(data);
  }
}
