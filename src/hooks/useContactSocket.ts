"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { getContacts } from "../store/slices/ContactSlice";

export const useContactSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (contact: any) => {
      dispatch(getContacts({ page:1, limit:9, search:"" }));
    };

    const handleUpdated = () => {
      dispatch(getContacts({ page:1, limit:9, search:"" }));
    };

    const handleDeleted = () => {
      dispatch(getContacts({ page:1, limit:9, search:"" }));
    };

    socket.on("contact:created", handleCreated);
    socket.on("contact:updated", handleUpdated);
    socket.on("contact:deleted", handleDeleted);

    return () => {
      socket.off("contact:created", handleCreated);
      socket.off("contact:updated", handleUpdated);
      socket.off("contact:deleted", handleDeleted);
    };
  }, [dispatch]);
};