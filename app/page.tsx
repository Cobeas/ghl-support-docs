"use client";

import { useRouter } from "next/navigation"
import { Button } from "@mui/material";

export default function Home() {
  const router = useRouter()

  return (
    <div style={{ height: '100%', margin: 'auto' }}>
      <h1>Home</h1>
      <Button onClick={() => router.push("/auth/login")}>Login</Button>
    </div>
  )
}