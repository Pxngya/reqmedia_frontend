import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import { LogOut, User as UserIcon } from 'lucide-react'; // เพิ่มไอคอนเพื่อความสวยงาม

function App() {
  const [user, setUser] = useState(null);

  if (!user) {
    return <Login onLoginSuccess={(userData) => setUser(userData)} />;
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* แก้ไขบรรทัดนี้: เปลี่ยนจาก top-8 right-12 เป็น bottom-8 left-8 */}
      <div className="fixed bottom-8 left-8 z-[100] bg-[#1A1A1A] border border-white/10 px-5 py-3 rounded-[25px] shadow-2xl flex items-center gap-4 text-white animate-in slide-in-from-left-5 duration-500">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">พนักงาน</span>
          <span className="text-sm font-black italic">{user.user} ({user.dept})</span>
        </div>
        
        {/* ปุ่มออกระบบ */}
        <button 
          onClick={() => setUser(null)} 
          className="ml-2 bg-red-500/20 text-red-500 p-2 rounded-xl hover:bg-red-500 hover:text-white transition-all flex items-center gap-2 text-xs font-bold"
        >
          <LogOut size={16} />
          ออก
        </button>
      </div>
      
      <Dashboard />
    </div>
  );
}

export default App;