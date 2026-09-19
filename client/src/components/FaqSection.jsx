import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FaqSection() {
  const faqs = [
    {
      q: "Is this an online course?",
      a: "No. BanaviAeBrand is a one-day in-person practical experience."
    },
    {
      q: "Is it a 30-day course?",
      a: "No. The live program happens in one day. Post-event follow-up happens afterward."
    },
    {
      q: "Do I need prior Social Media experience?",
      a: "No. Beginners can participate, but active participation is required."
    },
    {
      q: "Will I get a real business?",
      a: "You will receive a business challenge as part of the experience, subject to final business availability."
    },
    {
      q: "Do I need to know editing?",
      a: "No. Live editing guidance will be provided."
    },
    {
      q: "Will I get recorded videos?",
      a: "Yes. Supporting pre-recorded learning material will be provided."
    },
    {
      q: "Will I get support after the event?",
      a: "Yes. The team will follow up on the assigned content/work after the event."
    },
    {
      q: "Is there a guarantee that my Reel will go viral?",
      a: "No. BanaviAeBrand teaches practical thinking and execution, not guaranteed viral results."
    },
    {
      q: "How many people can join?",
      a: "Only 30 participants in the Founding Batch."
    },
    {
      q: "What is the fee?",
      a: "₹10,000."
    },
    {
      q: "Where is it happening?",
      a: "The final venue/location will be communicated to confirmed participants after the event logistics are locked."
    }
  ];

  const [open, setOpen] = useState(null);

  const toggle = (idx) => {
    setOpen(open === idx ? null : idx);
  };

  return (
    <section className="py-24 bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            FREQUENTLY ASKED <span className="text-lime">QUESTIONS</span>
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`border border-white/10 rounded-2xl overflow-hidden transition-colors ${open === idx ? 'bg-[#101018] border-[#3B82F6]/50' : 'bg-[#050507] hover:border-white/20'}`}
            >
              <button 
                onClick={() => toggle(idx)}
                className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
              >
                <span className="text-white font-bold text-lg">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-[#3B82F6] transition-transform duration-300 ${open === idx ? 'rotate-180' : ''}`} />
              </button>
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${open === idx ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <p className="text-white/60">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
