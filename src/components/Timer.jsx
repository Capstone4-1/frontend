import "./Timer.css";
import { useState, useEffect, useRef } from "react";

const Timer = ({ duration, onExpire, triggerReset }) => {
    const [remaining, setRemaining] = useState(duration);
    const startTimeRef = useRef(null);
    const rafId = useRef(null);

    useEffect(() => {
        startTimeRef.current = Date.now();

        const update = () => {
            const elapsed = Math.floor(
                (Date.now() - startTimeRef.current) / 1000,
            );
            const left = duration - elapsed;
            setRemaining(left > 0 ? left : 0);

            if (left <= 0) {
                onExpire && onExpire();
                cancelAnimationFrame(rafId.current);
                return;
            }
            rafId.current = requestAnimationFrame(update);
        };

        rafId.current = requestAnimationFrame(update);

        return () => cancelAnimationFrame(rafId.current);
    }, [duration, triggerReset, onExpire]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const s = (seconds % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    return <div className="timer">{formatTime(remaining)}</div>;
};

export default Timer;
