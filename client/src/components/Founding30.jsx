import React, { useState, useEffect } from 'react';

export default function Founding30() {
  const [bookedSeats, setBookedSeats] = useState(0);
  const seats = Array.from({ length: 30 }, (_, i) => i + 1);

  useEffect(() => {
    // Fetch live slot data from backend
    fetch('http://localhost:5001/api/slots')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.totalRegistrations === 'number') {
          setBookedSeats(data.totalRegistrations);
        }
      })
      .catch(err => console.error("Error fetching slots:", err));
  }, []);

  return (
    <section className="py-24 bg-black relative">
      <div className="max-w-6xl mx-auto px-6 text-center">
        
        <div className="mb-12">
          <p className="text-[#3B82F6] text-xs font-bold tracking-[0.4em] uppercase mb-4">
            Limited Batch
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tight mb-6">
            FOUNDING <span className="text-[#3B82F6]">30</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
            Only 30 people will be part of the first BanaviAeBrand experience. These 30 people are not just attendees. They are the first community around BanaviAeBrand.
          </p>
        </div>

        <div className="bg-[#101018] border border-white/10 rounded-3xl p-8 max-w-4xl mx-auto shadow-2xl">
          <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
            {seats.map((seat) => {
              const isBooked = seat <= bookedSeats;
              return (
                <div 
                  key={seat}
                  className={`aspect-square border rounded-lg flex items-center justify-center font-mono font-bold text-sm md:text-base transition-all duration-300 ${
                    isBooked 
                      ? 'bg-[#3B82F6] text-white border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                      : 'bg-[#050507] border-white/10 text-white/40 hover:border-[#3B82F6] hover:text-[#3B82F6] cursor-default'
                  }`}
                  title={isBooked ? 'Seat Booked' : 'Seat Available'}
                >
                  {seat.toString().padStart(2, '0')}
                </div>
              );
            })}
          </div>
          
          <div className="mt-10 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#050507] border border-white/10 rounded-md"></div>
              <span className="text-xs text-white/60 uppercase tracking-wider font-bold">Available</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 bg-[#3B82F6] shadow-[0_0_10px_rgba(59,130,246,0.4)] rounded-md"></div>
              <span className="text-xs text-[#3B82F6] uppercase tracking-wider font-bold">Booked</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
