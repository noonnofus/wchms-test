"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
// Exmaple log in, change in future, localhost:3000/admin/login

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const res = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (res?.error) {
            setError("Invalid email or password");
        } else {
            window.location.href = "/dashboard"; // rn dosnt exist but should redirecct to /staff/dashboard
        }
    };

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "300px",
                margin: "50px auto",
            }}
        >
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button
                onClick={handleLogin}
                style={{
                    cursor: "pointer",
                    padding: "10px",
                    background: "#0070f3",
                    color: "white",
                }}
            >
                Log In
            </button>
        </div>
    );
}
