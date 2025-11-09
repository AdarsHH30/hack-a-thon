import type React from "react";
import Link from "next/link";

interface MainLayoutProps {
  children: React.ReactNode;
}

const InnomaticsLogo = () => {
  return (
    <Link
      href="/"
      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
    >
      {/* Logo Icon */}
      <div className="relative w-8 h-8">
        <img
          src="/images/logo.png"
          alt="Innomatics Logo"
          className="w-full h-full object-contain"
        />
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <span className="text-lg font-black text-foreground leading-none tracking-tight">
          INNOMATICS
        </span>
        <span className="text-xs font-medium text-innomatics-red leading-none tracking-wider">
          RESEARCH LABS
        </span>
      </div>
    </Link>
  );
};

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
