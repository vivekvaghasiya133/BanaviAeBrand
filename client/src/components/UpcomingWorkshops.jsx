import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';

export default function UpcomingWorkshops() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5001/api/workshops')
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setWorkshops(data.data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleRegisterClick = () => {
    const el = document.getElementById('register');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 bg-[#050507] text-white relative border-t border-white/5" id="workshops">
      {/* Background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#3B82F6]/5 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] text-xs font-bold uppercase tracking-widest rounded-full mb-4">
            Limited Batch Sizes
          </div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Upcoming <span className="text-[#3B82F6]">Workshops</span>
          </h2>
          <p className="text-white/60 mt-4 max-w-2xl mx-auto">
            Each event is strictly capped to ensure 1-on-1 practical execution. Choose your city and secure your slot before it fills up.
          </p>
        </div>

        {loading ? (
          <div className="text-center text-white/40 py-10">Loading events...</div>
        ) : workshops.length === 0 ? (
          <div className="text-center text-white/40 py-10">No upcoming workshops announced yet. Check back soon!</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {workshops.map(ws => {
              const booked = ws.slotsBooked;
              const total = ws.maxSlots;
              
              // Generate array of slots for the grid
              const slots = Array.from({ length: total }, (_, i) => ({
                id: i + 1,
                isBooked: i < booked
              }));

              return (
                <div key={ws.id} className="bg-[#101018] rounded-3xl p-8 border border-white/10 hover:border-[#3B82F6]/30 transition-all duration-300 relative overflow-hidden group">
                  {ws.isFull && (
                    <div className="absolute top-6 right-6 bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Sold Out
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-6">
                    {/* Header Info */}
                    <div>
                      <h3 className="text-2xl font-black text-white mb-3">{ws.date}</h3>
                      <div className="flex flex-wrap gap-4 text-sm text-white/60 font-medium">
                        <span className="flex items-center gap-1.5"><MapPin size={16} className="text-[#3B82F6]" /> {ws.location}</span>
                        <span className="flex items-center gap-1.5"><Users size={16} className="text-[#3B82F6]" /> {ws.slotsLeft} Seats Left</span>
                      </div>
                    </div>

                    {/* The Grid */}
                    <div className="bg-[#0A0A0F] rounded-2xl p-6 border border-white/5">
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-4">
                        {slots.map((slot) => (
                          <div
                            key={slot.id}
                            className={`
                              aspect-square rounded flex items-center justify-center text-[10px] font-bold transition-all duration-500
                              ${slot.isBooked 
                                ? 'bg-[#3B82F6]/20 border border-[#3B82F6]/40 text-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                : 'bg-white/5 border border-white/10 text-white/20'
                              }
                            `}
                          >
                            {slot.id < 10 ? `0${slot.id}` : slot.id}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex justify-center items-center gap-6 text-xs font-bold text-white/40 tracking-wider">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm bg-white/10"></div>
                          <span>AVAILABLE</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-sm bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                          <span className="text-[#3B82F6]">BOOKED</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={handleRegisterClick}
                      disabled={ws.isFull}
                      className={`w-full py-4 mt-2 rounded-xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                        ${ws.isFull ? 'bg-white/5 text-white/40 border border-white/10' : 'bg-[#3B82F6] text-black hover:bg-[#2563EB] hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]'}`}
                    >
                      {ws.isFull ? 'Waitlist Only' : 'Select Tier & Register'}
                      {!ws.isFull && <ArrowRight size={16} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
