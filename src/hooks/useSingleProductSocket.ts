"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { getSingleProduct } from "../store/slices/ProductSlice";
import { useRouter } from "next/navigation";

export const useSingleProductSocket = (
  productSlug: string
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!productSlug) return;

    const socket = getSocket();

    // PRODUCT UPDATED
    const handleUpdated = (product: any) => {
      console.log("Product Updated:", product);

      // slug changed
      if (product.slug !== productSlug) {
        router.replace(
          `/admin/products/${product.slug}`
        );

        return;
      }

      // same slug -> refetch
      dispatch(getSingleProduct(product.slug));
    };

    // PRODUCT DELETED
    const handleDeleted = (deletedId: string) => {
      console.log("Product Deleted:", deletedId);

      router.push("/admin/products");
    };

    socket.on(
      "admin:product:updated",
      handleUpdated
    );

    socket.on(
      "admin:product:deleted",
      handleDeleted
    );

    return () => {
      socket.off(
        "admin:product:updated",
        handleUpdated
      );

      socket.off(
        "admin:product:deleted",
        handleDeleted
      );
    };
  }, [dispatch, productSlug, router]);
};