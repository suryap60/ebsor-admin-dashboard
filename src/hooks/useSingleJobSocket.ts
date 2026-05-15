"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { useRouter } from "next/navigation";
import { getSingleJob } from "../store/slices/CareerSlice";

export const useSingleJobSocket = (
  jobSlug: string
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!jobSlug) return;

    const socket = getSocket();

    // job UPDATED
    const handleUpdated = (job: any) => {
      console.log("Job Updated:", job);

      // slug changed
      if (job.slug !== jobSlug) {
        router.replace(
          `/admin/careers/${job.slug}`
        );

        return;
      }

      // same slug -> refetch
      dispatch(getSingleJob(job.slug));
    };

    // Job DELETED
    const handleDeleted = (deletedId: string) => {
      console.log("Job Deleted:", deletedId);

      router.push("/admin/careers");
    };

    socket.on(
      "admin:job:updated",
      handleUpdated
    );

    socket.on(
      "admin:job:deleted",
      handleDeleted
    );

    return () => {
      socket.off(
        "admin:job:updated",
        handleUpdated
      );

      socket.off(
        "admin:job:deleted",
        handleDeleted
      );
    };
  }, [dispatch, jobSlug, router]);
};