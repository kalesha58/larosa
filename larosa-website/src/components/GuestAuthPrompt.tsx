"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { AuthSplitPanel } from "@/components/auth/AuthSplitPanel";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getAuthErrorMessage } from "@/lib/auth-errors";

const PROMPT_DELAY_MS = 2 * 60 * 1000;
const DISMISSED_KEY = "larosa-auth-prompt-dismissed";
const LEGACY_SHOWN_KEY = "larosa-auth-prompt-shown";

const loginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password is required"),
});

function isPromptDismissed(): boolean {
  try {
    // Older builds marked the prompt as shown when the timer fired, even if
    // the dialog never appeared — clear that so guests aren't stuck forever.
    if (sessionStorage.getItem(LEGACY_SHOWN_KEY) === "1") {
      sessionStorage.removeItem(LEGACY_SHOWN_KEY);
    }
    return sessionStorage.getItem(DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

function markPromptDismissed(): void {
  try {
    sessionStorage.setItem(DISMISSED_KEY, "1");
  } catch {
    // Ignore private browsing / storage errors.
  }
}

export function GuestAuthPrompt() {
  const { user, loading, login } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const promptDeadlineRef = useRef<number | null>(null);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const handleOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (!next) {
      markPromptDismissed();
    }
  }, []);

  useEffect(() => {
    if (loading || user) return;
    if (isPromptDismissed()) return;

    const now = Date.now();
    if (promptDeadlineRef.current === null) {
      promptDeadlineRef.current = now + PROMPT_DELAY_MS;
    }

    const remaining = promptDeadlineRef.current - now;
    const timer = window.setTimeout(() => {
      setOpen(true);
    }, Math.max(0, remaining));

    return () => window.clearTimeout(timer);
  }, [loading, user]);

  useEffect(() => {
    if (user) setOpen(false);
  }, [user]);

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    form.clearErrors("root");
    try {
      await login(data.email, data.password);
      toast({
        title: "Welcome Back",
        description: "You have successfully signed in to Larosa.",
      });
      setOpen(false);
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

  if (user) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        overlayClassName="z-[100]"
        className="z-[100] max-w-[min(1000px,calc(100vw-2rem))] gap-0 border-0 bg-transparent p-0 shadow-none overflow-y-auto max-h-[95vh] [&>button]:absolute [&>button]:right-5 [&>button]:top-5 [&>button]:z-30 [&>button]:rounded-full [&>button]:bg-white/90 [&>button]:p-1.5 [&>button]:text-gray-500 [&>button]:shadow-sm hover:[&>button]:bg-white"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Sign In</DialogTitle>
        <AuthSplitPanel compact>
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="font-serif text-3xl font-medium text-gray-800">
                Sign In
              </h2>
            </div>

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
                onClick={() => handleOpenChange(false)}
              >
                Register here
              </Link>
            </p>
          </div>
        </AuthSplitPanel>
      </DialogContent>
    </Dialog>
  );
}
