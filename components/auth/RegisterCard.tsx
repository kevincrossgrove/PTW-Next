"use client";

import * as React from "react";

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

export default function RegisterCard() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <Card className="w-[350px]">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          emailPasswordSignup();
        }}
      >
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Create an account to use PTW</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="name">Email</Label>
              <Input
                id="name"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="framework">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Sign Up</Button>
        </CardFooter>
      </form>
    </Card>
  );

  async function emailPasswordSignup() {
    const { data, error } = await authClient.signUp.email({
      email: "test@example.com",
      password: "password1234",
      name: "test",
      image: "https://example.com/image.png",
    });

    console.log(data, error);
  }
}
