"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { useRouter } from "next/navigation";
import { getSingleBlog } from "../store/slices/BlogSlice";

export const useSingleBlogsocket = (
  blogslug: string
) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (!blogslug) return;

    const socket = getSocket();

    // blog UPDATED
    const handleUpdated = (blog: any) => {
      console.log("blog Updated:", blog);

      // slug changed
      if (blog.slug !== blogslug) {
        router.replace(
          `/admin/blogs/${blog.slug}`
        );

        return;
      }

      // same slug -> refetch
      dispatch(getSingleBlog(blog.slug));
    };

    // BLOG DELETED
    const handleDeleted = (deletedId: string) => {
      console.log("Blog Deleted:", deletedId);

      router.push("/admin/blogs");
    };

    socket.on(
      "admin:blog:updated",
      handleUpdated
    );

    socket.on(
      "admin:blog:deleted",
      handleDeleted
    );

    return () => {
      socket.off(
        "admin:blog:updated",
        handleUpdated
      );

      socket.off(
        "admin:blog:deleted",
        handleDeleted
      );
    };
  }, [dispatch, blogslug, router]);
};