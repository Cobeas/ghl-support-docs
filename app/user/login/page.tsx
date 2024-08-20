"use client";

import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const payload = {
            username: e.currentTarget.username.value as string,
            password: e.currentTarget.password.value as string,
        };

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            
            alert(JSON.stringify(data));
            router.push("/user/dashboard");

        } catch (error) {
            console.error((error as Error).message);
            alert("An error occurred. Please try again.");
        }
    }

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit} method="post">
                <label>
                    Username
                    <input type="text" name="username" />
                </label>
                <label>
                    Password
                    <input type="password" name="password" />
                </label>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}