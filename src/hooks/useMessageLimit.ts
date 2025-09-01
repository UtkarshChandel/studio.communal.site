import { useState, useEffect } from "react";

interface MessageUsage {
    count: number;
    date: string; // YYYY-MM-DD format
}

const MESSAGE_LIMIT = 5;
const STORAGE_KEY = "consultant_message_usage";

export function useMessageLimit() {
    const [messageCount, setMessageCount] = useState(0);
    const [isLimitReached, setIsLimitReached] = useState(false);

    // Get today's date in YYYY-MM-DD format
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    // Load usage from localStorage
    const loadUsage = (): MessageUsage => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const usage: MessageUsage = JSON.parse(stored);
                const today = getTodayDate();

                // Reset if it's a new day
                if (usage.date !== today) {
                    return { count: 0, date: today };
                }

                return usage;
            }
        } catch (error) {
            console.error("Error loading message usage:", error);
        }

        return { count: 0, date: getTodayDate() };
    };

    // Save usage to localStorage
    const saveUsage = (usage: MessageUsage) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
        } catch (error) {
            console.error("Error saving message usage:", error);
        }
    };

    // Initialize usage on mount
    useEffect(() => {
        const usage = loadUsage();
        setMessageCount(usage.count);
        setIsLimitReached(usage.count >= MESSAGE_LIMIT);
    }, []); // loadUsage is stable and doesn't need to be in dependencies

    // Increment message count
    const incrementCount = () => {
        const usage = loadUsage();
        const newCount = usage.count + 1;
        const updatedUsage = { count: newCount, date: usage.date };

        saveUsage(updatedUsage);
        setMessageCount(newCount);
        setIsLimitReached(newCount >= MESSAGE_LIMIT);

        return newCount <= MESSAGE_LIMIT;
    };

    // Get remaining messages
    const getRemainingMessages = () => {
        return Math.max(0, MESSAGE_LIMIT - messageCount);
    };

    // Get time until reset (midnight)
    const getTimeUntilReset = () => {
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);

        const diff = tomorrow.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return { hours, minutes };
    };

    // Check if user can send message
    const canSendMessage = () => {
        const usage = loadUsage();
        return usage.count < MESSAGE_LIMIT;
    };

    return {
        messageCount,
        isLimitReached,
        remainingMessages: getRemainingMessages(),
        timeUntilReset: getTimeUntilReset(),
        canSendMessage,
        incrementCount,
        messageLimit: MESSAGE_LIMIT,
    };
}
