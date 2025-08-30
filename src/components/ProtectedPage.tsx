"use client";

import { useAuthCheck } from "@/hooks/useAuthCheck";
import PageLoader from "@/components/ui/PageLoader";

interface ProtectedPageProps {
  children: React.ReactNode;
  loadingComponent?: React.ReactNode;
}

export function ProtectedPage({
  children,
  loadingComponent,
}: ProtectedPageProps) {
  const { isChecking, isAuthenticated } = useAuthCheck();

  if (isChecking) {
    return loadingComponent || <PageLoader message="Loading" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
