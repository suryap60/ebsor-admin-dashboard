"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-toastify";
import { getCareers } from "../store/slices/CareerSlice";

export const useCareerSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (job: any) => {
      dispatch(getCareers({ page:1, limit:9, search:"" }));
    //   toast.success(`${job.name} created`);
    };

    const handleUpdated = () => {
      dispatch(getCareers({ page:1, limit:9, search:"" }));
    };

    const handleDeleted = () => {
      dispatch(getCareers({ page:1, limit:9, search:"" }));
    };

    socket.on("admin:job:created", handleCreated);
    socket.on("admin:job:updated", handleUpdated);
    socket.on("admin:job:deleted", handleDeleted);

    return () => {
      socket.off("admin:job:created", handleCreated);
      socket.off("admin:job:updated", handleUpdated);
      socket.off("admin:job:deleted", handleDeleted);
    };
  }, [dispatch]);
};