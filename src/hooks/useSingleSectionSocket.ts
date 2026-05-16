"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { getSectionById } from "../store/slices/SectionSlice";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export const useSingleSectionSocket = (
  sectionId: string,
  sectionType?: string
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!sectionId) return;

    const socket = getSocket();

    // SECTION UPDATED
    const handleUpdated = (section: any) => {
      console.log("Section Updated:", section);

      // only refetch current section
      if (section._id === sectionId) {
        dispatch(getSectionById(sectionId));

        // optional toast
        // toast.success("Section updated");
      }
    };

    // SECTION DELETED
    const handleDeleted = (deletedId: string) => {
      console.log("Section Deleted:", deletedId);

      if (deletedId === sectionId) {
        // toast.error("Section deleted");

        // redirect based on type
        if (sectionType === "faq") {
          router.push("/admin/faqs");
        } else {
          router.push("/admin/policies");
        }
      }
    };

    socket.on(
      "admin:section:updated",
      handleUpdated
    );

    socket.on(
      "admin:section:deleted",
      handleDeleted
    );

    return () => {
      socket.off(
        "admin:section:updated",
        handleUpdated
      );

      socket.off(
        "admin:section:deleted",
        handleDeleted
      );
    };
  }, [dispatch, sectionId, sectionType, router]);
};