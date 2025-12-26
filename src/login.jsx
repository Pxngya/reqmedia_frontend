import React, { useState } from 'react';
import axios from 'axios';
import { User, Lock, Building, UserPlus, ArrowRight, ChevronLeft } from 'lucide-react';

const Login = ({ onLoginSuccess }) => {
  const [step, setStep] = useState('id'); // id, password, register
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [department, setDepartment] = useState('การเงิน');
  const [error, setError] = useState('');

  const handleCheckId = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/check-user', { employee_id: empId });
      if (res.data.exists) setStep('password');
      else setStep('register');
      setError('');
    } catch (err) { setError('เกิดข้อผิดพลาดในการตรวจสอบ'); }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:8000/login', { employee_id: empId, password });
      onLoginSuccess(res.data);
    } catch (err) { setError('รหัสผ่านไม่ถูกต้อง'); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:8000/register', { 
        employee_id: empId, fullname, password, department 
      });
      alert('ลงทะเบียนพนักงานใหม่สำเร็จ!');
      setStep('password');
    } catch (err) { setError('ไม่สามารถลงทะเบียนได้'); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[400px] rounded-[40px] shadow-2xl p-10">
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-purple-100 rounded-2xl text-purple-600 mb-4">
            <User size={32} />
          </div>
          <h1 className="text-2xl font-black italic">REQ MEDIA</h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest">Internal Portal</p>
        </div>

        {error && <div className="mb-4 text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-xl">{error}</div>}

        {/* STEP 1: ใส่รหัสพนักงาน */}
        {step === 'id' && (
          <form onSubmit={handleCheckId} className="space-y-4">
            <div className="bg-gray-50 border-2 border-transparent focus-within:border-purple-400 rounded-2xl p-4 flex items-center gap-3 transition-all">
              <User className="text-gray-400" size={20} />
              <input required type="text" placeholder="รหัสพนักงาน" className="bg-transparent outline-none w-full font-bold" 
                value={empId} onChange={(e) => setEmpId(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-2xl hover:bg-gray-800 flex items-center justify-center gap-2">
              ตรวจสอบข้อมูล <ArrowRight size={18} />
            </button>
          </form>
        )}

        {/* STEP 2: ใส่รหัสผ่าน */}
        {step === 'password' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <p className="text-sm font-bold text-gray-500">รหัสพนักงาน: {empId}</p>
            <div className="bg-gray-50 border-2 border-transparent focus-within:border-purple-400 rounded-2xl p-4 flex items-center gap-3">
              <Lock className="text-gray-400" size={20} />
              <input required type="password" placeholder="รหัสผ่าน" className="bg-transparent outline-none w-full font-bold" 
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-purple-500 text-white font-bold py-4 rounded-2xl hover:bg-purple-600 shadow-lg shadow-purple-200">
              เข้าสู่ระบบ
            </button>
            <button onClick={() => setStep('id')} className="w-full text-gray-400 text-sm font-bold">ย้อนกลับ</button>
          </form>
        )}

        {/* STEP 3: สมัครใหม่ */}
        {step === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <h2 className="text-purple-600 font-black mb-4">ลงทะเบียนพนักงานใหม่</h2>
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
              <UserPlus className="text-gray-400" size={20} />
              <input required type="text" placeholder="ชื่อ-นามสกุล" className="bg-transparent outline-none w-full font-bold" 
                value={fullname} onChange={(e) => setFullname(e.target.value)} />
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
              <Building className="text-gray-400" size={20} />
              <select className="bg-transparent outline-none w-full font-bold text-gray-600" value={department} onChange={(e) => setDepartment(e.target.value)}>
                <option value="การเงิน">แผนกการเงิน</option>
                <option value="บุคคล">แผนกบุคคล</option>
                <option value="IT">แผนก IT</option>
                <option value="การตลาด">แผนกการตลาด</option>
              </select>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center gap-3">
              <Lock className="text-gray-400" size={20} />
              <input required type="password" placeholder="ตั้งรหัสผ่าน" className="bg-transparent outline-none w-full font-bold" 
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit" className="w-full bg-black text-white font-bold py-4 rounded-2xl shadow-xl hover:scale-[1.02] transition-transform">
              สร้างบัญชีผู้ใช้
            </button>
            <button onClick={() => setStep('id')} className="w-full text-gray-400 text-sm font-bold text-center">ยกเลิก</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;