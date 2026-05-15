"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { useRouter } from "next/navigation";

export const useSingleSectionSocket = (
  sectionId: string
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!sectionId) return;

    const socket = getSocket();

    // brand UPDATED
    const handleUpdated = (brand: any) => {
      console.log("Brand Updated:", brand);

      // refetch current brand
    //   dispatch(getBrandById(sectionId));
    };

    // section DELETED
    const handleDeleted = (deletedId: string) => {
      console.log("Brand Deleted:", deletedId);

      router.push("/admin/brands");
    };

    socket.on(
      "admin:brand:updated",
      handleUpdated
    );

    socket.on(
      "admin:brand:deleted",
      handleDeleted
    );

    return () => {
      socket.off(
        "admin:brand:updated",
        handleUpdated
      );

      socket.off(
        "admin:brand:deleted",
        handleDeleted
      );
    };
  }, [dispatch, sectionId, router]);
};