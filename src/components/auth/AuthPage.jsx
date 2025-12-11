import React from "react";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/useUserStore";
import { ShieldCheck, BarChart3, ArrowRight } from "lucide-react";

export function AuthPage() {
  const { signInWithGoogle } = useUserStore();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0b0c15] relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md p-8 flex flex-col items-center text-center">
        {/* Logo */}
        <div className="h-16 w-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-8 animate-in zoom-in duration-500">
          <BarChart3 className="text-white h-8 w-8" />
        </div>

        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-3 tracking-tight">
          Quoryx AI
        </h1>
        <p className="text-slate-400 mb-10 text-lg">
          Next-generation analytics for your business.
        </p>

        {/* Glass Card */}
        <div className="w-full glass-card rounded-2xl p-8 shadow-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
          <div className="flex flex-col gap-4">
            <Button
              onClick={signInWithGoogle}
              className="w-full h-12 bg-white text-black hover:bg-slate-200 transition-all font-semibold text-base shadow-lg"
            >
              <ShieldCheck className="mr-2 h-5 w-5" />
              Sign in with Google
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#0b0c15] px-2 text-slate-500">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full h-12 border-white/10 text-slate-300 hover:bg-white/5 hover:text-white"
              onClick={() => useUserStore.getState().loginAsGuest()}
            >
              Guest Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="mt-6 text-xs text-slate-500">
            By clicking continue, you agree to our{" "}
            <a href="#" className="underline hover:text-slate-300">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline hover:text-slate-300">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
