"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-toastify";
import { getBlogs } from "../store/slices/BlogSlice";

export const useBlogSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (blog: any) => {
      dispatch(getBlogs({}));
    //   toast.success(`${blog.name} created`);
    };

    const handleUpdated = () => {
      dispatch(getBlogs({}));
    };

    const handleDeleted = () => {
      dispatch(getBlogs({}));
    };

    socket.on("admin:blog:created", handleCreated);
    socket.on("admin:blog:updated", handleUpdated);
    socket.on("admin:blog:deleted", handleDeleted);

    return () => {
      socket.off("admin:blog:created", handleCreated);
      socket.off("admin:blog:updated", handleUpdated);
      socket.off("admin:blog:deleted", handleDeleted);
    };
  }, [dispatch]);
};