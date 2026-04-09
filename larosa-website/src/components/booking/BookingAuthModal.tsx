"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password is required"),
});

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface BookingAuthModalProps {
  open: boolean;
}

export function BookingAuthModal({ open }: BookingAuthModalProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuth();
  const [tab, setTab] = useState("login");
  const [busy, setBusy] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onLogin = async (data: z.infer<typeof loginSchema>) => {
    setBusy(true);
    try {
      await login(data.email, data.password);
      toast({
        title: "Signed in",
        description: "You can complete your reservation.",
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Sign in failed";
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: msg,
      });
    } finally {
      setBusy(false);
    }
  };

  const onRegister = async (data: z.infer<typeof registerSchema>) => {
    setBusy(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });
      const payload: unknown = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Registration failed";
        throw new Error(msg);
      }
      await login(data.email, data.password);
      toast({
        title: "Welcome",
        description: "Your account is ready.",
      });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Registration failed";
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: msg,
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) router.push("/rooms");
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[440px] [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-left">
            Sign in to continue
          </DialogTitle>
          <DialogDescription className="text-left">
            Complete your reservation with a secure payment. Sign in or create
            an account first.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-xl bg-muted/80 p-1">
            <TabsTrigger value="login" className="rounded-lg">
              Sign in
            </TabsTrigger>
            <TabsTrigger value="register" className="rounded-lg">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-5 space-y-4">
            <Form {...loginForm}>
              <form
                onSubmit={loginForm.handleSubmit(onLogin)}
                className="space-y-4"
              >
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          className="h-11 rounded-xl border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          autoComplete="current-password"
                          className="rounded-xl border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={busy}
                  className="h-11 w-full rounded-xl font-serif tracking-widest"
                >
                  {busy ? "Please wait..." : "SIGN IN"}
                </Button>
              </form>
            </Form>
          </TabsContent>
          <TabsContent value="register" className="mt-5 space-y-4">
            <Form {...registerForm}>
              <form
                onSubmit={registerForm.handleSubmit(onRegister)}
                className="space-y-4"
              >
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                        Full name
                      </FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="name"
                          className="h-11 rounded-xl border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          className="h-11 rounded-xl border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          autoComplete="new-password"
                          className="rounded-xl border-border"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={busy}
                  className="h-11 w-full rounded-xl font-serif tracking-widest"
                >
                  {busy ? "Please wait..." : "CREATE ACCOUNT"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>

        <p className="pt-2 text-center text-sm text-muted-foreground">
          <button
            type="button"
            className="text-primary underline-offset-4 hover:underline"
            onClick={() => router.push("/rooms")}
          >
            Back to rooms
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
