"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";
import { useAppDispatch } from "../store/hooks";
import { toast } from "react-toastify";
import { getBrands } from "../store/slices/BrandSlice";

export const useBrandSocket = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    const handleCreated = (brand: any) => {
      dispatch(getBrands({}));
    //   toast.success(`${brand.name} created`);
    };

    const handleUpdated = () => {
      dispatch(getBrands({}));
    };

    const handleDeleted = () => {
      dispatch(getBrands({}));
    };

    socket.on("admin:brand:created", handleCreated);
    socket.on("admin:brand:updated", handleUpdated);
    socket.on("admin:brand:deleted", handleDeleted);

    return () => {
      socket.off("admin:brand:created", handleCreated);
      socket.off("admin:brand:updated", handleUpdated);
      socket.off("admin:brand:deleted", handleDeleted);
    };
  }, [dispatch]);
};