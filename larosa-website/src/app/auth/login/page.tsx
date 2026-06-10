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
import { BRAND_NAME } from "@/lib/brand";
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
    <div className="relative min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-[#1d2b40] via-[#121c2c] to-[#0a0f18] overflow-hidden">
      {/* Background stars overlay */}
      <div 
        className="absolute inset-0 opacity-[0.1] pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(circle, #ffffff 1px, transparent 1px)`,
          backgroundSize: "32px 32px"
        }}
      />

      <div className="relative z-10 w-full max-w-[1000px] min-h-[580px] md:h-[620px] flex flex-col md:grid md:grid-cols-12 bg-[#fcfcfc] rounded-[2rem] overflow-hidden shadow-[0_24px_55px_-15px_rgba(0,0,0,0.6)]">
        
        {/* Mobile Header Image with Wave */}
        <div className="md:hidden relative h-36 w-full overflow-hidden shrink-0">
          <Image
            src="/starry-night-lake.png"
            alt="Starry Lake"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/15" />
          <div className="absolute bottom-0 left-0 right-0 h-8">
            <svg className="w-full h-full text-[#fcfcfc] fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,100 C35,65 65,65 100,100 Z" />
            </svg>
          </div>
          {/* Logo overlay */}
          <div className="absolute top-6 left-6 z-10">
            <span className="font-serif font-bold text-xs tracking-wider uppercase text-white/90">{BRAND_NAME}</span>
          </div>
        </div>

        {/* Left Column - Image & Wave SVG (Desktop only) */}
        <div className="hidden md:flex md:col-span-5 relative flex-col justify-end p-8 text-white select-none">
          <Image
            src="/starry-night-lake.png"
            alt="Larosa Sanctuary"
            fill
            className="object-cover object-center"
            priority
            sizes="40vw"
          />
          <div className="absolute inset-0 bg-black/15 z-10" />
          
          {/* Logo */}
          <div className="absolute top-8 left-8 z-20">
            <span className="font-serif font-bold text-xs tracking-wider uppercase text-white/90">{BRAND_NAME}</span>
          </div>

          <div className="relative z-20 space-y-2 mb-6">
            <h2 className="font-serif text-3xl font-light leading-snug tracking-wide text-white">
              Let&apos;s go to a<br />
              <span className="font-bold">new journey</span>
            </h2>
          </div>

          {/* SVG Wave Separator */}
          <div className="absolute top-0 bottom-0 right-0 w-[45px] h-full z-20 translate-x-[0.5px]">
            <svg className="w-full h-full text-[#fcfcfc] fill-current" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M100,0 L100,100 L95,100 C75,90 85,75 60,60 C30,45 40,30 65,15 C75,5 80,0 95,0 Z" />
            </svg>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-center px-6 py-8 sm:px-12 md:px-16 bg-[#fcfcfc]">
          <div className="w-full max-w-[360px] mx-auto space-y-6">
            
            {/* Header */}
            <div className="space-y-1">
              <h1 className="font-serif text-3xl font-medium text-gray-800">
                Sign In
              </h1>
            </div>

            {/* Form */}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          autoComplete="email"
                          placeholder="Email"
                          className="h-9 rounded-none border-0 border-b border-gray-200 bg-transparent px-0 pb-1 text-gray-800 placeholder:text-gray-300 focus-visible:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          autoComplete="current-password"
                          placeholder="Password"
                          className="h-9 rounded-none border-0 border-b border-gray-200 bg-transparent px-0 pb-1 text-gray-800 placeholder:text-gray-300 focus-visible:border-gray-900 focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 w-full rounded-full bg-[#0e1626] hover:bg-[#1a2842] text-white font-semibold text-xs tracking-widest uppercase transition-all shadow-md shadow-[#0e1626]/10 mt-2"
                >
                  {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
                </Button>
              </form>
            </Form>

            {/* Links */}
            <p className="text-xs text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="font-semibold text-[#c9a96e] hover:text-[#b08f53] transition-colors"
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
