"use client";

import MessagesContainer from "@/app/containers/Messages";
import RoomsContainer from "@/app/containers/Rooms";
import {useSocket} from "@/app/context/socket.context";
import {useEffect, useRef} from "react";
import EVENTS from "@/app/config/events";
import Sender from "@/app/containers/Sender"; 
export default function Home() {
    const {socket, username, setUsername, timer, roomId} = useSocket();
    const usernameRef = useRef<HTMLInputElement>(null);

    function handleUsername() {
        const value = usernameRef.current?.value || "";
        if (!value) return;
        setUsername(value);
        localStorage.setItem("username", value);
    }

    useEffect(() => {
        if (usernameRef) {
            usernameRef.current!.value = localStorage.getItem("username") || "";
        }

        socket.on(EVENTS.SERVER.CONVERSATION_ENDED, () => {
            alert("Konuşma sona erdi. Odayla bağlantınız kesildi.");
        });

        return () => {
            socket.off(EVENTS.SERVER.CONVERSATION_ENDED);
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {!username ? (
                <div className="flex items-center justify-center min-h-screen bg-gray-200">
                    <div className="bg-white p-8 rounded">
                        <input
                            className="mb-4 px-4 py-2 border border-gray-300 rounded"
                            placeholder="Kullanıcı Adı"
                            ref={usernameRef}
                        />
                        <button
                            onClick={handleUsername}
                            className="px-4 ml-2 py-2 text-white bg-pink-500 rounded"
                        >
                            Kullanıcı Adı
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex h-screen overflow-hidden">
                    <RoomsContainer/>
                    <div className="flex flex-col flex-grow relative">
                        <MessagesContainer/>
                        {roomId && <Sender/>}
                    </div>
                </div>
            )}
        </div>
    );
}
