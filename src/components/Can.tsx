import { ReactNode } from "react";
import { useCan } from "../hooks/useCan";

interface CanProps {
  children: ReactNode;
  permissions?: string[];
  roles?: string[];
}

export function Can({ children, permissions = [], roles = [] }: CanProps) {
  const userCanSeeTheComponent = useCan({
    permissions,
    roles,
  })

  if (!userCanSeeTheComponent) {
    return null;
  }

  return (
    <>
      {children}
    </>
  );
}