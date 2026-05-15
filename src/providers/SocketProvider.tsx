"use client";

import { useEffect } from "react";
import { getSocket } from "../lib/socket";

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    useEffect(() => {
        const socket = getSocket();

        socket.connect();


        socket.on("connect", () => {
            console.log(
                "Admin Socket Connected:",
                socket.id
            );

            socket.emit("join-admin");
        });

        socket.on("disconnect", () => {
            console.log("Admin Socket disconnected");
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
        };
    }, []);

    return <>{children}</>;
}