"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { useRouter } from "next/navigation";
import { getApplicationById } from "../store/slices/ApplicationSlice";

export const useSingleApplicationSocket = (
  applicationId: string
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!applicationId) return;

    const socket = getSocket();

    // Applicaion UPDATED
    const handleUpdated = (brand: any) => {
      console.log("Applicaion Updated:", brand);

      // refetch current brand
      dispatch(getApplicationById(applicationId));
    };

    // Applicaion DELETED
    const handleDeleted = (deletedId: string) => {
      console.log("Applicaion Deleted:", deletedId);

      router.push("/admin/applications");
    };

    socket.on(
      "application:updated",
      handleUpdated
    );

    socket.on(
      "application:deleted",
      handleDeleted
    );

    return () => {
      socket.off(
        "application:updated",
        handleUpdated
      );

      socket.off(
        "application:deleted",
        handleDeleted
      );
    };
  }, [dispatch, applicationId, router]);
};