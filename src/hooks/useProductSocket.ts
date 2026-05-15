"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { getProducts } from "../store/slices/ProductSlice";
import { toast } from "react-toastify";

export const useProductSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (product: any) => {
      dispatch(getProducts({}));
    //   toast.success(`${product.name} created`);
    };

    const handleUpdated = () => {
      dispatch(getProducts({}));
    };

    const handleDeleted = () => {
      dispatch(getProducts({}));
    };

    socket.on("admin:product:created", handleCreated);
    socket.on("admin:product:updated", handleUpdated);
    socket.on("admin:product:deleted", handleDeleted);

    return () => {
      socket.off("admin:product:created", handleCreated);
      socket.off("admin:product:updated", handleUpdated);
      socket.off("admin:product:deleted", handleDeleted);
    };
  }, [dispatch]);
};