import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col lg:grid lg:grid-cols-2">
      {/* MOBILE HEADER: Geometric Art Banner (Hidden on Desktop) */}
      <div className="relative w-full h-32 sm:h-40 bg-[#F5F2EA] overflow-hidden lg:hidden flex-shrink-0 border-b border-gray-100">
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-1">
          {/* CSS Geometric Pattern for Mobile */}
          <div className="bg-[#D97757] rounded-br-full" />
          <div className="bg-[#2E4A52]" />
          <div className="bg-[#EBCB8B] rounded-tl-full" />
          <div className="bg-[#2E4A52] rounded-bl-full" />
        </div>
        {/* Decorative Floating Elements */}
        <div className="absolute top-[-20%] right-[10%] w-16 h-16 border-[8px] border-[#EBCB8B] rounded-full opacity-50" />
        <div className="absolute bottom-[-10%] left-[5%] w-8 h-8 bg-gray-900 rounded-full" />
      </div>
      {/* LEFT COLUMN: Geometric Art (Hidden on Mobile) */}
      <div className="hidden lg:relative lg:flex lg:flex-col lg:items-center lg:justify-center bg-[#F5F2EA] overflow-hidden border-r border-gray-100">
        {/* Geometric Composition Container */}
        <div className="relative w-full h-full p-12 flex flex-col justify-between z-10">
          {/* Branding Top Left */}
          <div className="flex items-center gap-2 font-bold text-xl text-gray-900 tracking-tight">
            <div className="w-8 h-8 rounded-full bg-gray-900" />
            SecureAuth.
          </div>

          {/* Art Piece Center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-90">
            <div className="relative w-[500px] h-[600px] grid grid-cols-2 grid-rows-3 gap-0">
              {/* Row 1 */}
              <div className="bg-[#D97757] rounded-tl-full" />
              <div className="bg-[#2E4A52]" />

              {/* Row 2 */}
              <div className="bg-[#2E4A52]" />
              <div className="bg-[#EBCB8B] rounded-br-full" />

              {/* Row 3 */}
              <div className="bg-[#EBCB8B] rounded-bl-full" />
              <div className="bg-[#D97757]" />

              {/* Decorative Floating Circles */}
              <div className="absolute top-[15%] right-[-10%] w-24 h-24 border-[12px] border-[#2E4A52] rounded-full" />
              <div className="absolute bottom-[20%] left-[-5%] w-16 h-16 bg-gray-900 rounded-full" />
              <div className="absolute top-[5%] left-[10%] w-4 h-4 bg-gray-900 rounded-full" />
            </div>
          </div>

          {/* Quote / Footer Bottom */}
          <div className="relative z-20">
            <blockquote className="space-y-2">
              <p className="text-lg font-medium text-gray-800">
                &ldquo;Simplicity is the ultimate sophistication.&rdquo;
              </p>
              <footer className="text-sm text-gray-600 font-medium">
                &copy; {new Date().getFullYear()} Secure Auth Inc.
              </footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Form Container */}
      <div className="flex items-center justify-center py-8 px-4 sm:px-6 lg:py-12 lg:px-8 bg-white">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 w-full sm:w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
