//src/app/login/page.tsx
"use client";

// import Link from "next/link"; // Unused
import Button from "@/components/ui/Button";
import { useLogin } from "@/hooks/useLogin";
import { useEffect, useRef } from "react";

export default function LoginPage() {
  const { betaCode, setBetaCode, loading, error, signInWithGoogle } =
    useLogin();
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left section: form */}
      <div className="w-full lg:w-[735px] flex flex-col">
        <div className="flex-1 max-w-[520px] w-full mx-auto px-6 pt-16 lg:pt-24">
          {/* Logo */}
          <img src="/logo.png" alt="Communal AI" className="h-14 w-14" />

          {/* Heading */}
          <h1 className="mt-8 text-[30px] leading-9 font-semibold text-[#11181c]">
            Communal AI Studio
          </h1>

          {/* Form */}
          <form
            className="mt-8"
            action="#"
            method="post"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Email */}
            {/* <label
              htmlFor="email"
              className="block text-[14px] leading-[21px] font-medium text-[#11181c]"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="mt-1 w-full max-w-[384px] h-[46px] rounded-md bg-[#fbfcfd] border border-[#eceef0] px-3 text-[14px] text-[#11181c] outline-none focus:ring-2 focus:ring-[#4361ee]/20"
            /> */}
            {/* Password */}
            <label
              htmlFor="betacode"
              className="mt-5 block text-[14px] leading-[21px] font-medium text-[#11181c]"
            >
              Beta Access Code
            </label>
            <input
              id="betacode"
              name="betacode"
              type="text"
              autoComplete="access code"
              className="mt-1 w-full max-w-[384px] h-[46px] rounded-md bg-[#fbfcfd] border border-[#eceef0] px-3 text-[14px] text-[#11181c] outline-none focus:ring-2 focus:ring-[#4361ee]/20"
              ref={inputRef}
              value={betaCode}
              onChange={(e) => setBetaCode(e.target.value)}
            />

            {betaCode.length === 0 && (
              <div className="mt-2 text-[13px] text-[#d92d20] font-dm-sans">
                Don’t have one? Request access at{" "}
                <a href="mailto:hey@communal.site" className="font-dm-sans">
                  hey@communal.site
                </a>
                <br />
                <span className="text-black font-dm-sans">
                  Already signed up? Just sign in below — no need to enter your
                  code again.
                </span>
              </div>
            )}
            {error && (
              <div className="mt-2 text-[13px] text-[#d92d20]">{error}</div>
            )}
            {/* Primary Sign in */}
            {/* <div className="mt-7 w-full max-w-[384px]">
              <Button type="submit" fullWidth className="h-[39px]">
                Sign in
              </Button>
            </div> */}
            {/* Google Sign in */}
            <div className="mt-3 w-full max-w-[384px]">
              <Button
                type="button"
                variant="outline"
                fullWidth
                className="h-[39px] border-[#e6e8eb] shadow-md"
                loading={loading}
                onClick={signInWithGoogle}
                icon={
                  <img
                    src="/icons/google.svg"
                    alt="Google"
                    className="h-5 w-5"
                  />
                }
              >
                Continue with Google
              </Button>
            </div>
            {/* Links */}
            {/* <div className="mt-6 text-center text-[14px]">
              <span className="text-[#00254d]">
                Don&apos;t have an account?{" "}
              </span>
              <Link href="#" className="text-[#007aff] font-medium">
                Sign up here
              </Link>
            </div> */}
            {/* <div className="mt-2 text-center text-[14px]">
              <span className="text-[#00254d]">Trouble signing in? </span>
              <Link href="#" className="text-[#007aff] font-medium">
                Reset password
              </Link>
            </div> */}
          </form>
        </div>
      </div>

      {/* Right section: artwork */}
      <div className="hidden lg:block relative flex-1 overflow-hidden">
        <div className="absolute inset-0 m-2 rounded-2xl overflow-hidden">
          <img
            src="/abstract.png"
            alt="Abstract artwork"
            className="absolute inset-0 h-full w-full object-cover object-left-top xl:object-contain xl:object-right select-none pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
}
