"use client"

import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Page() {
  const router = useRouter()
  const [error, setError] = useState("")

  const handleLogin = (profile: any) => {
    // Here you would typically make an API call to authenticate
    // For now, we'll just store the profile in localStorage and redirect
    localStorage.setItem("userProfile", JSON.stringify(profile))
    router.push("/") // Redirect to home page after login
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  )
}
