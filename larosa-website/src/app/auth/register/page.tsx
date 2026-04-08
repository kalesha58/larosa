"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const { user, login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

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
      // simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      // In a real app we'd call register API, here we just use the mock login
      await login(); 
      toast({
        title: "Account Created",
        description: "Welcome to Larosa Sanctuary, " + data.name,
      });
      router.push("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not create account.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user) return null;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Visual Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden">
        <Image 
          src="/room-presidential.png" 
          alt="Larosa Presidential Suite" 
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-background/40" />
        <div className="relative z-10 flex flex-col justify-end p-16 w-full text-foreground pb-24">
          <h2 className="font-serif text-5xl mb-4">Become a Guest</h2>
          <p className="text-xl font-light text-foreground/80 max-w-md">Join our exclusive circle for unparalleled hospitality.</p>
        </div>
      </div>

      {/* Form Side */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-md">
          <div className="mb-12">
            <Link href="/" className="font-serif text-2xl font-bold tracking-widest text-primary block mb-8">
              LAROSA
            </Link>
            <h1 className="font-serif text-3xl text-foreground mb-2">Create Account</h1>
            <p className="text-muted-foreground">Register to manage your exclusive stays.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" className="h-12 rounded-none bg-card border-border focus-visible:ring-primary" {...field} />
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
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john@example.com" className="h-12 rounded-none bg-card border-border focus-visible:ring-primary" {...field} />
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
                    <FormLabel className="text-xs uppercase tracking-widest text-muted-foreground">Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="h-12 rounded-none bg-card border-border focus-visible:ring-primary" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-14 mt-8 rounded-none font-serif tracking-widest text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isSubmitting ? "CREATING..." : "REGISTER"}
              </Button>
            </form>
          </Form>

          <p className="mt-8 text-center text-muted-foreground">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
