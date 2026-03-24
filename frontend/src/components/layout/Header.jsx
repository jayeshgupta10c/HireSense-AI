import React from 'react'
import { Link } from 'react-router-dom'
import { Activity, LogOut } from 'lucide-react'

export default function Header() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  return (
    <header className="border-b-4 border-black bg-white p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 font-black text-2xl italic uppercase group">
          <div className="h-10 w-10 bg-blue-600 text-white flex items-center justify-center border-2 border-black group-hover:rotate-6 transition-transform"><Activity size={20} /></div>
          HireSense AI
        </Link>
        <div className="flex gap-4">
          <Link to="/analyze" className="font-black hover:text-blue-600 transition-colors">Analyze</Link>
          <Link to="/admin" className="font-black hover:text-blue-600 transition-colors">Admin</Link>
          {user ? <button className="font-black text-red-600" onClick={() => localStorage.clear()}>Logout</button> : <Link to="/login" className="font-black">Login</Link>}
        </div>
      </div>
    </header>
  )
}
