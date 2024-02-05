"use client";
import React, {createContext, useContext, useEffect, useState} from "react";
import io from "socket.io-client";
import {SOCKET_URL} from "@/app/config/default";
import EVENTS from "@/app/config/events";
import {Socket} from "socket.io-client";


type Message = {
    message: string;
    username: string;
    time: string;
};

interface SocketContext {
    socket: Socket;
    username?: string;
    setUsername: React.Dispatch<React.SetStateAction<string>>;
    roomId?: string;
    rooms: Record<string, { name: string }>;
    messages?: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    timer?: number | null; 
    setTimer: React.Dispatch<React.SetStateAction<number | null>>; 
}

interface Props {
    children: React.ReactNode;
}

export const socket = io(SOCKET_URL);
export const SocketContext = createContext<SocketContext>({
    socket,
    setUsername: () => {
    },
    rooms: {},
    messages: [],
    setMessages: () => {
    },
    timer: null,
    setTimer: () => {
    },
});

export const SocketProvider = ({children}: Props) => {
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");
    const [rooms, setRooms] = useState({});
    const [messages, setMessages] = useState<Message[]>([]);
    const [timer, setTimer] = useState<number | null>(null); 

    socket.on(EVENTS.SERVER.ROOMS, (name: string) => {
        setRooms(name);
    });

    socket.on(EVENTS.SERVER.JOINED_ROOM, (id: string) => {
        setRoomId(id);
        setMessages([]);
        setTimer(null);
    });

    useEffect(() => {
        window.onfocus = () => {
            document.title = "Chat App";
        };
    }, []);

    useEffect(() => {
        socket.on(EVENTS.SERVER.ROOM_MESSAGE, (message: Message) => {
            if (!document.hasFocus()) {
                document.title = "Yeni Mesaj...";
            }

            setMessages((messages) => [...messages, message]);
        });
        socket.on(EVENTS.SERVER.TIMER_SET, (duration: number) => {
            setTimer(duration * 60);
        });
        socket.on(EVENTS.SERVER.TIMER_UPDATE, (currentTime: number) => {
            setTimer(currentTime);
        });
        socket.on(EVENTS.SERVER.CONVERSATION_ENDED, () => {
            alert("Mesajlaşma Sona Erdi!"); 
            setTimer(null);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <SocketContext.Provider
            value={{
                socket,
                username,
                setUsername,
                rooms,
                roomId,
                messages,
                setMessages,
                timer,
                setTimer,
            }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;

export const useSocket = () => {
    return useContext(SocketContext);
};
