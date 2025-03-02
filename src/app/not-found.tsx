"use client";

import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import Link from "next/link";

const message = "The page you're looking for doesn't exist or has been moved.";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-background flex flex-col items-center justify-center gap-8">
      <Logo />
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Page Not Found</h2>
        <p className="text-muted-foreground">{message}</p>
        <Link href="/" className="inline-block">
          <Button>Return Home</Button>
        </Link>
      </div>
    </div>
  );
}
