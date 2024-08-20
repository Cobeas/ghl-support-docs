"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "../../../lib/types/types";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [ user, setUser ] = useState<User | null>(null);
    const [ loading, setLoading ] = useState<boolean>(true);

    async function getUser() {
        try {
            const response = await fetch("/api/auth/me");
            const data = await response.json();
            console.log(data);
    
            if (response.ok) {
                setUser(data.user);
                setLoading(false);
            } else {
                router.push("/user/login");
            }
        } catch (error) {
            console.error((error as Error).message);
            router.push("/user/login");
        }
    }

    useEffect(() => {
        getUser()
    }, []);

    if (loading || !user) {
        return <p>Loading...</p>
    }

    return (
        <div>
            <h1>Dashboard Layout</h1>
            {children}
        </div>
    );
}