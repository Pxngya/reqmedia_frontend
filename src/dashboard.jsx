import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Calendar as CalIcon, Clock, ChevronLeft, ChevronRight, Trash2, Edit3, FileText, ExternalLink } from 'lucide-react';
import { format, startOfMonth, endOfMonth, startOfWeek, addDays, isSameDay, eachDayOfInterval, subMonths, addMonths } from 'date-fns';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMonth, setViewMonth] = useState(new Date());
  
  const [formData, setFormData] = useState({
    title: 'Graphic Design',
    titleOther: '',
    color: '#e5dbff',
    start_time: '09:00',
    end_time: '10:00', 
    date: format(new Date(), 'yyyy-MM-dd'),
    file_data: '',
    file_name: ''
  });

  const hours = Array.from({ length: 11 }, (_, i) => i + 8);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selectedDate, { weekStartsOn: 1 }), i));

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://reqmedia-backend.vercel.app/tasks');
      setTasks(res.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  // จัดการการเลือกไฟล์
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // จำกัด 2MB
        alert("ไฟล์ใหญ่เกินไป! กรุณาเลือกไฟล์ไม่เกิน 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, file_data: reader.result, file_name: file.name });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEditInit = (task) => {
    setEditingId(task.id);
    setFormData({ ...task });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`https://reqmedia-backend.vercel.app/tasks/${editingId}`, formData);
      } else {
        await axios.post('https://reqmedia-backend.vercel.app/tasks', formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      fetchTasks();
    } catch (err) { alert("บันทึกข้อมูลไม่สำเร็จ"); }
  };

  const deleteTask = async (id) => {
    if (window.confirm("ยืนยันการลบ?")) {
      try {
        await axios.delete(`https://reqmedia-backend.vercel.app/tasks/${id}`);
        fetchTasks();
      } catch (err) { alert("ลบไม่สำเร็จ"); }
    }
  };

  return (
    <div className="flex h-screen p-4 bg-[#F3F4F6] font-sans overflow-hidden italic">
      {/* Sidebar */}
      <div className="w-72 bg-[#121212] rounded-[30px] p-6 flex flex-col shadow-2xl mr-4 text-white">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-[#b49cfc] rounded-xl flex items-center justify-center text-black font-black text-xl">M</div>
          <h2 className="text-xl font-black uppercase tracking-tighter">REQ MEDIA</h2>
        </div>
        <div className="mb-6">
          <div className="flex justify-between items-center mb-6 px-1 text-sm font-bold text-gray-400">
            {format(viewMonth, 'MMMM yyyy')}
            <div className="flex gap-2">
              <button onClick={() => setViewMonth(subMonths(viewMonth, 1))}><ChevronLeft size={20}/></button>
              <button onClick={() => setViewMonth(addMonths(viewMonth, 1))}><ChevronRight size={20}/></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center font-bold">
            {eachDayOfInterval({ start: startOfWeek(startOfMonth(viewMonth), { weekStartsOn: 1 }), end: endOfMonth(viewMonth) }).map((day, i) => (
              <div key={i} onClick={() => setSelectedDate(day)} className={`py-2 rounded-lg cursor-pointer text-[11px] ${isSameDay(day, selectedDate) ? 'bg-[#b49cfc] text-black font-black' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 bg-white rounded-[40px] shadow-sm flex flex-col overflow-hidden border border-gray-200">
        <header className="px-8 py-6 flex justify-between items-center border-b border-gray-100">
          <h1 className="text-3xl font-black text-slate-900">{format(selectedDate, 'MMMM yyyy')}</h1>
          <button onClick={() => {setEditingId(null); setFormData({...formData, file_data:'', file_name:''}); setIsModalOpen(true);}} className="bg-black text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg">+ สั่งงานใหม่</button>
        </header>

        <div className="grid grid-cols-[80px_repeat(7,1fr)] bg-white border-b-2 border-gray-200 sticky top-0 z-10 text-[10px] font-bold text-gray-300">
          <div className="flex items-center justify-center py-4 uppercase">TIME</div>
          {weekDays.map(day => (
            <div key={day.toString()} className={`py-4 text-center ${isSameDay(day, selectedDate) ? 'bg-purple-50/30' : ''}`}>
              <p className="uppercase mb-1">{format(day, 'eee')}</p>
              <p className={`text-xl font-black ${isSameDay(day, selectedDate) ? 'text-[#b49cfc]' : 'text-slate-800'}`}>{format(day, 'd')}</p>
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto bg-[#F9FAFB]">
          <div className="flex flex-col min-w-[1000px]">
            {hours.map(h => (
              <div key={h} className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-100 min-h-[100px] bg-white">
                <div className="border-r border-gray-100 flex items-start justify-center pt-4 text-[11px] font-bold text-gray-400">{h}:00</div>
                {weekDays.map(day => {
                  const dayTasks = tasks.filter(t => t.date === format(day, 'yyyy-MM-dd') && parseInt(t.start_time) === h);
                  return (
                    <div key={day.toString()+h} className="border-r border-gray-50 p-2 flex flex-col gap-2 relative">
                      {dayTasks.map((task, i) => (
                        <div key={i} className="group relative w-full p-3 rounded-2xl border shadow-sm transition-all" style={{ backgroundColor: task.color }}>
                          
                          {/* Hover Popover */}
                          <div className="invisible group-hover:visible absolute top-0 left-[105%] w-64 bg-white rounded-3xl shadow-2xl p-6 z-[100] border border-gray-100 animate-in fade-in zoom-in duration-200">
                             <h4 className="text-lg font-black text-slate-900 mb-3">{task.title === 'Others' ? task.titleOther : task.title}</h4>
                             <div className="space-y-3 pt-3 border-t border-gray-100 text-xs font-bold text-slate-500">
                                <p className="flex items-center gap-2"><Clock size={14}/> {task.start_time} - {task.end_time}</p>
                                
                                {/* ส่วนดูไฟล์แนบ */}
                                {task.file_data ? (
                                    <button 
                                        onClick={() => {
                                            const win = window.open();
                                            win.document.write(`<iframe src="${task.file_data}" frameborder="0" style="border:0; width:100%; height:100%;" allowfullscreen></iframe>`);
                                        }}
                                        className="w-full flex items-center justify-between bg-black text-white p-3 rounded-xl hover:bg-purple-600 transition-colors"
                                    >
                                        <span className="truncate mr-2">{task.file_name}</span>
                                        <ExternalLink size={14}/>
                                    </button>
                                ) : <p className="italic text-gray-300">ไม่มีไฟล์แนบ</p>}

                                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-50">
                                   <button onClick={() => handleEditInit(task)} className="flex-1 bg-blue-50 text-blue-600 font-bold p-2 rounded-xl flex items-center justify-center gap-2 text-[11px]"><Edit3 size={14}/> แก้ไข</button>
                                   <button onClick={() => deleteTask(task.id)} className="flex-1 bg-red-50 text-red-600 font-bold p-2 rounded-xl flex items-center justify-center gap-2 text-[11px]"><Trash2 size={14}/> ลบ</button>
                                </div>
                             </div>
                          </div>
                          <p className="text-[12px] font-black text-slate-800 leading-tight">{task.title === 'Others' ? task.titleOther : task.title}</p>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-8 relative animate-in zoom-in duration-300">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-gray-300 hover:text-black transition-colors"><X size={24} /></button>
            <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter italic">REQ MEDIA | {editingId ? 'EDIT' : 'NEW'}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5 font-bold">
                <label className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">ประเภทงาน</label>
                <select className="w-full bg-gray-50 rounded-2xl p-3 text-sm outline-none border border-transparent focus:border-[#b49cfc]"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}>
                  <option value="Graphic Design">Graphic Design</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Photography">Photography</option>
                  <option value="Others">อื่นๆ (ระบุเอง)</option>
                </select>
                {formData.title === 'Others' && (
                  <input required className="w-full mt-2 p-3 bg-purple-50 rounded-xl text-sm outline-none border-b-2 border-purple-400" placeholder="ระบุประเภทงาน..." value={formData.titleOther} onChange={e => setFormData({...formData, titleOther: e.target.value})} />
                )}
              </div>

              <div className="space-y-2">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block italic underline text-center">แนบไฟล์ (PDF/PNG ไม่เกิน 2MB)</label>
                 <div className="relative group border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:border-purple-400 transition-all">
                    <input type="file" accept=".pdf, .png" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <FileText className="mx-auto mb-2 text-gray-300" size={32} />
                    <p className="text-[10px] text-gray-500">{formData.file_name || "คลิกหรือลากไฟล์มาวางที่นี่"}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5"><label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">วันที่</label><input type="date" className="w-full bg-gray-50 rounded-2xl p-3 text-sm font-bold outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center block">Status Color</label>
                    <div className="flex justify-center gap-3 pt-2">
                        {['#e5dbff', '#dcfce7', '#fef9c3', '#d0f4ff'].map(hex => (
                        <div key={hex} onClick={() => setFormData({...formData, color: hex})} className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all ${formData.color === hex ? 'border-black scale-125' : 'border-transparent'}`} style={{backgroundColor: hex}}></div>
                        ))}
                    </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-bold">
                <div className="space-y-1.5"><label className="text-[10px] text-gray-400">เริ่ม</label><input type="time" className="w-full bg-gray-50 rounded-xl p-3 text-xs" value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} /></div>
                <div className="space-y-1.5"><label className="text-[10px] text-gray-400">สิ้นสุด</label><input type="time" className="w-full bg-gray-50 rounded-xl p-3 text-xs" value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} /></div>
              </div>

              <button type="submit" className="w-full bg-black text-white font-black py-4 rounded-2xl text-sm uppercase tracking-widest mt-2 active:scale-95 transition-all">
                {editingId ? 'บันทึกการแก้ไข' : 'ยืนยันการบันทึก'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;