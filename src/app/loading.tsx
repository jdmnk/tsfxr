import { Logo } from "@/components/logo";

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8">
      <Logo />
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}
