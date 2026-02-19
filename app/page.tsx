"use client";

import App from "@/app/components/App";
import { AuthProvider } from "@/app/lib/auth";

export default function Page() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
