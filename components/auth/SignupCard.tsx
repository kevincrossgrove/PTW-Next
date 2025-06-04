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
import { authClient } from "../../lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { AppAlertDestructive } from "../app/AppAlertDestructive";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SignupCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteID = searchParams.get("inviteID");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex flex-col justify-center items-center">
        <a href="https://www.trainwithptw.com/" tabIndex={-1}>
          <Image src="/ptw.png" alt="PTW Logo" width={80} height={80} />
        </a>
        <CardTitle className="pt-3 text-xl">
          Sign up for PTW Sports Training
        </CardTitle>
      </CardHeader>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          emailPasswordSignup();
        }}
      >
        <CardContent className="pt-2 pb-4">
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
                First Name
              </Label>
              <Input
                id="first"
                placeholder="First Name"
                type="text"
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="name" className="mb-2">
                Last Name
              </Label>
              <Input
                id="last"
                placeholder="Last Name"
                type="text"
                value={last}
                onChange={(e) => setLast(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="name" className="mb-2">
                Email
              </Label>
              <Input
                id="name"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="mb-2">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
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
          <div className="w-full flex justify-end">
            <Button
              type="submit"
              loading={submitting}
              disabled={submitting}
              loadingText="Signing up..."
              className="w-full"
            >
              Sign Up
            </Button>
          </div>
          <CardDescription className="text-sm pt-1">
            Already have an account?{" "}
            <Link href={"/login"} className="text-foreground underline">
              Sign in
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

  async function emailPasswordSignup() {
    if (!email || !password || !first || !last) {
      return setErrorMessage("Please fill in all fields.");
    }

    setSubmitting(true);

    const { data, error } = await authClient.signUp.email({
      email: email,
      password: password,
      name: `${first} ${last}`,
    });

    if (error) {
      setSubmitting(false);

      if (error.code === "USER_ALREADY_EXISTS") {
        return setErrorMessage("An account with this email already exists.");
      } else {
        return setErrorMessage("An error occurred while signing up.");
      }
    }

    setTimeout(() => setSubmitting(false), 500);
    console.log(data);
    router.push(inviteID ? `/invite/${inviteID}` : "/dashboard");
  }
}
