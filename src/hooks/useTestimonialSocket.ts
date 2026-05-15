"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-toastify";
import { getTestimonials } from "../store/slices/TestimonialSlice";

export const useTestimonialSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (testimonial: any) => {
      dispatch(getTestimonials({ page:1, limit:9, search:"" }));
    //   toast.success(`${testimonial.name} created`);
    };

    const handleUpdated = () => {
      dispatch(getTestimonials({ page:1, limit:9, search:"" }));
    };

    const handleDeleted = () => {
      dispatch(getTestimonials({ page:1, limit:9, search:"" }));
    };

    socket.on("admin:testimonial:created", handleCreated);
    socket.on("admin:testimonial:updated", handleUpdated);
    socket.on("admin:testimonial:deleted", handleDeleted);

    return () => {
      socket.off("admin:testimonial:created", handleCreated);
      socket.off("admin:testimonial:updated", handleUpdated);
      socket.off("admin:testimonial:deleted", handleDeleted);
    };
  }, [dispatch]);
};