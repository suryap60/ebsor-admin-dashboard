"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { useRouter } from "next/navigation";
import { getTestimonialById } from "../store/slices/TestimonialSlice";

export const useSingleTestimonialSocket = (
  testimonialId: string
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!testimonialId) return;

    const socket = getSocket();

    // testimonial UPDATED
    const handleUpdated = (testimonial: any) => {
      console.log("Testimonial Updated:", testimonial);

      // refetch current testimonial
      dispatch(getTestimonialById(testimonialId));
    };

    // testimonial DELETED
    const handleDeleted = (deletedId: string) => {
      console.log("Testimonial Deleted:", deletedId);

      router.push("/admin/testimonials");
    };

    socket.on(
      "admin:testimonial:updated",
      handleUpdated
    );

    socket.on(
      "admin:testimonial:deleted",
      handleDeleted
    );

    return () => {
      socket.off(
        "admin:testimonial:updated",
        handleUpdated
      );

      socket.off(
        "admin:testimonial:deleted",
        handleDeleted
      );
    };
  }, [dispatch, testimonialId, router]);
};