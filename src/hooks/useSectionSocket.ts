"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-toastify";
import { getSections } from "../store/slices/SectionSlice";

export const useSectionSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (section: any) => {
      dispatch(getSections({ page:1, limit:9, search:"" }));
    //   toast.success(`${section.name} created`);
    };

    const handleUpdated = () => {
      dispatch(getSections({ page:1, limit:9, search:"" }));
    };

    const handleDeleted = () => {
      dispatch(getSections({ page:1, limit:9, search:"" }));
    };

    socket.on("admin:section:created", handleCreated);
    socket.on("admin:section:updated", handleUpdated);
    socket.on("admin:section:deleted", handleDeleted);

    return () => {
      socket.off("admin:section:created", handleCreated);
      socket.off("admin:section:updated", handleUpdated);
      socket.off("admin:section:deleted", handleDeleted);
    };
  }, [dispatch]);
};