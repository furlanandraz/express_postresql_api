import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import { useUser } from "../context/AuthContext";
export function useSysInfo() {
    const [info, setInfo] = useState({});
    const [connected, setConnected] = useState(false);

    const [user, setUser] = useUser();

    const location = useLocation();

    useEffect(() => {
        if (Object.keys(user).length === 0 || !location.pathname.startsWith('/dashboard')) return;

        const ws = new WebSocket("ws://localhost:8000/services/sys-info");

        ws.onopen = () => {
            setConnected(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setInfo(data);
        };

        ws.onerror = (err) => {
            console.error("WebSocket error", err);
            setInfo({});
            setConnected(false);
        };

        ws.onclose = () => {
            console.log("WebSocket disconnected");
            setInfo({});
            setConnected(false);
        };

        return () => {
            ws.close();
            setInfo({});
            setConnected(false);
        };
    }, [user, location.pathname]);

    return [info, connected];
}