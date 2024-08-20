"use client";

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => router.push("/user/login")}>Login</button>
      <p>You are in the {process.env.NODE_ENV} environment</p>
      <p>The jwt issuer is {process.env.JWT_ISSUER}</p>
    </div>
  )
}