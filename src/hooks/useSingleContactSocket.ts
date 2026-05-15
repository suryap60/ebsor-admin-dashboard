"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { useRouter } from "next/navigation";
import { getContactById } from "../store/slices/ContactSlice";

export const useSingleContactSocket = (
  contactId: string
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!contactId) return;

    const socket = getSocket();

    // Contact UPDATED
    const handleUpdated = (brand: any) => {
      console.log("Message Updated:", brand);

      // refetch current Contact
      dispatch(getContactById(contactId));
    };

    // Applicaion DELETED
    // const handleDeleted = (deletedId: string) => {
    //   console.log("Message Deleted:", deletedId);

    //   router.push("/admin/contacts");
    // };

    socket.on(
      "contact:updated",
      handleUpdated
    );

    // socket.on(
    //   "contact:deleted",
    //   handleDeleted
    // );

    return () => {
      socket.off(
        "contact:updated",
        handleUpdated
      );

    //   socket.off(
    //     "contact:deleted",
    //     handleDeleted
    //   );
    };
  }, [dispatch, contactId, router]);
};