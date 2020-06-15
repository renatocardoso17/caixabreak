import { useState, useEffect } from "react";

export default function useOnlineStatus() {
    const [online, setOnline] = useState(navigator.onLine);

    function handler() {
        setOnline(navigator.onLine);
    }

    useEffect(() => {
        window.addEventListener("online", handler);
        window.addEventListener("offline", handler);

        // cleanup
        return () => {
            window.removeEventListener("online", handler);
            window.removeEventListener("offline", handler);
        }
    });

    return online
}
