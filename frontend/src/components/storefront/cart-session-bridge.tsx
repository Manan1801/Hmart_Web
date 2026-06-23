"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/src/hooks/use-auth";
import { mergeLocalCartAction } from "@/src/lib/storefront/cart-actions";
import {
  emptyLocalCart,
  readLocalCart,
} from "@/src/lib/storefront/cart-storage";

export function CartSessionBridge() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const mergedUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      return;
    }

    if (mergedUserIdRef.current === user.id) {
      return;
    }

    mergedUserIdRef.current = user.id;

    const localItems = readLocalCart();

    if (localItems.length === 0) {
      return;
    }

    mergeLocalCartAction(localItems).then((result) => {
      if (result.status === "success") {
        emptyLocalCart();
      }
    });
  }, [isAuthenticated, isLoading, user]);

  return null;
}
