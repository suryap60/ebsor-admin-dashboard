"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-toastify";
import { getApplications } from "../store/slices/ApplicationSlice";

export const useApplicationSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (application: any) => {
      dispatch(getApplications({}));
    //   toast.success(`${application.name} created`);
    };

    const handleUpdated = () => {
      dispatch(getApplications({}));
    };

    // const handleDeleted = () => {
    //   dispatch(getApplications({}));
    // };

    socket.on("application:created", handleCreated);
    socket.on("application:updated", handleUpdated);
    // socket.on("admin:blog:deleted", handleDeleted);

    return () => {
      socket.off("application:created", handleCreated);
      socket.off("application:updated", handleUpdated);
    //   socket.off("admin:blog:deleted", handleDeleted);
    };
  }, [dispatch]);
};