"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function AccessSignOutButton() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/access/session")
      .then((res) => res.json())
      .then((data: { granted?: boolean; required?: boolean }) => {
        if (!cancelled) {
          setVisible(data.granted === true && data.required === true);
        }
      })
      .catch(() => {
        if (!cancelled) setVisible(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!visible) return null;

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await fetch("/api/access/session", { method: "DELETE" });
      router.push("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => void handleSignOut()}
      disabled={signingOut}
      className="shrink-0"
      title="Sign out of app access"
    >
      {signingOut ? "…" : "Sign out"}
    </Button>
  );
}
