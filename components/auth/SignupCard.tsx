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
import { useRouter } from "next/navigation";
import { AppAlertDestructive } from "../app/AppAlertDestructive";
import { useState } from "react";

export default function SignupCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  return (
    <Card className="w-full max-w-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          emailPasswordSignup();
        }}
      >
        <CardHeader className="pb-4">
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Create an account to use PTW</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 pb-6">
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
              className="w-36"
            >
              Sign Up
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );

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
    router.push("/dashboard");
  }
}
