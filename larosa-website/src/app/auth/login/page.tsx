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
import { useEffect, useState } from "react";
import { AuthSplitPanel } from "@/components/auth/AuthSplitPanel";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAuthErrorMessage } from "@/lib/auth-errors";

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
    form.clearErrors("root");
    try {
      await login(data.email, data.password);
      toast({
        title: "Welcome Back",
        description: "You have successfully signed in to Larosa.",
      });
      router.push("/");
    } catch (error: unknown) {
      const message = getAuthErrorMessage(error);
      form.setError("root", { type: "server", message });
      toast({
        variant: "destructive",
        title: "Sign in failed",
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const rootError = form.formState.errors.root?.message;

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

      <AuthSplitPanel className="relative z-10 max-w-[1000px]">
        <div className="space-y-6">
          <h1 className="font-serif text-3xl font-medium text-gray-800">
            Sign In
          </h1>

          <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {rootError ? (
                  <Alert
                    variant="destructive"
                    className="rounded-xl border-red-200 bg-red-50 text-red-800"
                    aria-live="polite"
                  >
                    <AlertTitle className="text-sm font-semibold">
                      Sign in failed
                    </AlertTitle>
                    <AlertDescription className="text-sm text-red-700">
                      {rootError}
                    </AlertDescription>
                  </Alert>
                ) : null}

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
                          onChange={(e) => {
                            field.onChange(e);
                            form.clearErrors("root");
                          }}
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
                          onChange={(e) => {
                            field.onChange(e);
                            form.clearErrors("root");
                          }}
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
      </AuthSplitPanel>
    </div>
  );
}
