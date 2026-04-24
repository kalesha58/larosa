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

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, login, loading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push("/");
    }
  }, [user, loading, router]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password);
      toast({
        title: "Welcome Back",
        description: "You have successfully signed in to Larosa.",
      });
      router.push("/");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Invalid credentials.";
      toast({
        variant: "destructive",
        title: "Authentication Failed",
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
    <div className="relative min-h-[100dvh] lg:min-h-screen flex items-center justify-center p-4 lg:p-8">
      {/* Full screen background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero.png"
          alt="Larosa Hotel"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Modern dark gradient overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Typography Content */}
        <div className="flex-1 text-white hidden lg:block">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.35em] text-white/80">
            Larosa Sanctuary
          </p>
          <h1 className="font-serif text-5xl leading-tight sm:text-6xl lg:text-7xl mb-6">
            Welcome <br /> Back
          </h1>
          <p className="max-w-md text-lg font-light text-white/90 leading-relaxed">
            Your exclusive sanctuary awaits your return. Rediscover tranquility, luxury, and unparalleled hospitality.
          </p>
          
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-4">
              <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                <span className="text-xs">✨</span>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                <span className="text-xs">🛎️</span>
              </div>
              <div className="w-12 h-12 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md flex items-center justify-center">
                <span className="text-xs">🥂</span>
              </div>
            </div>
            <p className="text-sm font-medium text-white/80">
              Exclusive experiences await
            </p>
          </div>
        </div>

        {/* Right Form Card - Glassmorphism */}
        <div className="w-full max-w-md lg:w-[480px] dark">
          <div className="rounded-[2.5rem] border border-white/10 bg-black/40 p-8 sm:p-10 shadow-2xl backdrop-blur-2xl supports-[backdrop-filter]:bg-black/20">
            <div className="mb-8 text-center">
              <Link
                href="/"
                className="inline-block font-serif text-2xl font-bold tracking-widest text-white mb-2"
              >
                LAROSA
              </Link>
              <h2 className="text-xl text-white/90 font-medium mt-4">
                Sign in to your account
              </h2>
            </div>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 sm:space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-white/70">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          className="h-12 rounded-xl border-white/20 bg-white/5 text-white placeholder:text-white/40 transition-colors focus-visible:border-white/50 focus-visible:ring-white/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase tracking-widest text-white/70">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          className="rounded-xl border-white/20 bg-white/5 text-white placeholder:text-white/40 transition-colors focus-visible:border-white/50 focus-visible:ring-white/20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 h-14 w-full rounded-xl bg-white font-serif text-lg tracking-[0.2em] text-black transition-all hover:-translate-y-0.5 hover:bg-white/90 lg:mt-8"
                >
                  {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
                </Button>
              </form>
            </Form>

            <p className="mt-8 text-center text-sm text-white/60">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-white hover:text-white/80 transition-colors"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
