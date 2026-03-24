import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, ArrowRight } from 'lucide-react'
import { loginUser } from '../services/api'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const data = await loginUser(email, password)
      localStorage.setItem('user', JSON.stringify(data)); navigate('/analyze')
    } catch (err) { alert("Login failed") }
  }
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-black uppercase">
      <form onSubmit={handleLogin} className="border-8 border-black p-10 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] space-y-6 max-w-sm w-full">
        <h1 className="text-4xl">Login</h1>
        <input type="email" placeholder="Email" className="w-full p-4 border-4 border-black" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-4 border-4 border-black" onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="w-full py-4 bg-blue-600 text-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">Enter System</button>
      </form>
    </div>
  )
}
