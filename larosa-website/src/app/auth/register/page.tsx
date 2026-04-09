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
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, login, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsSubmitting(true);
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
        const message =
          typeof payload === "object" &&
          payload !== null &&
          "error" in payload &&
          typeof (payload as { error: unknown }).error === "string"
            ? (payload as { error: string }).error
            : "Could not create account.";
        throw new Error(message);
      }
      await login(data.email, data.password);
      toast({
        title: "Account Created",
        description: "Welcome to Larosa Sanctuary, " + data.name,
      });
      router.push("/");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Could not create account.";
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground text-sm tracking-widest uppercase">
          Loading
        </p>
      </div>
    );
  }

  if (user) return null;

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background lg:min-h-screen lg:flex-row">
      <div className="relative h-[min(42vh,320px)] w-full shrink-0 overflow-hidden lg:h-auto lg:min-h-0 lg:w-1/2 lg:flex-1">
        <Image
          src="/room-presidential.png"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-background/20 lg:bg-background/40" />
        <div className="absolute inset-0 flex flex-col justify-end p-6 pb-8 lg:p-16 lg:pb-24">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary">
            Membership
          </p>
          <h2 className="font-serif text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl lg:mb-4">
            Become a Guest
          </h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-foreground/85 sm:text-base lg:text-xl lg:font-light">
            Join our exclusive circle for unparalleled hospitality.
          </p>
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-4 pb-8 pt-0 sm:px-6 lg:justify-center lg:px-16 lg:pb-16 lg:pt-16">
        <div className="mx-auto w-full max-w-md -mt-6 rounded-2xl border border-border/70 bg-card/95 p-6 shadow-2xl shadow-black/10 backdrop-blur-md supports-[backdrop-filter]:bg-card/80 lg:mt-0 lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
          <div className="mb-8 lg:mb-12">
            <Link
              href="/"
              className="font-serif text-2xl font-bold tracking-widest text-primary mb-6 block"
            >
              LAROSA
            </Link>
            <h1 className="font-serif text-2xl text-foreground mb-2 sm:text-3xl">
              Create Account
            </h1>
            <p className="text-sm text-muted-foreground">
              Register to manage your exclusive stays.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="name"
                        className="h-12 rounded-xl border-border bg-background/50 focus-visible:ring-primary lg:rounded-none lg:bg-card"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
                        className="h-12 rounded-xl border-border bg-background/50 focus-visible:ring-primary lg:rounded-none lg:bg-card"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">
                      Password
                    </FormLabel>
                    <FormControl>
                      <PasswordInput
                        autoComplete="new-password"
                        placeholder="Create a password"
                        className="rounded-xl border-border bg-background/50 focus-visible:ring-primary lg:rounded-none lg:bg-card"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 h-14 w-full rounded-xl font-serif text-lg tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 lg:mt-8 lg:rounded-none lg:shadow-none"
              >
                {isSubmitting ? "CREATING..." : "REGISTER"}
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
