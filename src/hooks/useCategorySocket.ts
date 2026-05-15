"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-toastify";
import { getFaqCategories } from "../store/slices/FaqCategorySlice";

export const useCategorySocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (faqCategory: any) => {
      dispatch(getFaqCategories({}));
    //   toast.success(`${faqCategory.name} created`);
    };

    const handleUpdated = () => {
      dispatch(getFaqCategories({}));
    };

    const handleDeleted = () => {
      dispatch(getFaqCategories({}));
    };

    socket.on("admin:faqCategory:created", handleCreated);
    socket.on("admin:faqCategory:updated", handleUpdated);
    socket.on("admin:faqCategory:deleted", handleDeleted);

    return () => {
      socket.off("admin:faqCategory:created", handleCreated);
      socket.off("admin:faqCategory:updated", handleUpdated);
      socket.off("admin:faqCategory:deleted", handleDeleted);
    };
  }, [dispatch]);
};