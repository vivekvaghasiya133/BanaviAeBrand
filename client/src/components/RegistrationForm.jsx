import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { API_URL } from '../config';

export default function RegistrationForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: '',
    instagramHandle: '',
    profession: '',
    whyJoin: '',
    interestArea: '',
    socialExperience: '',
    editingExperience: '',
    participationAgreement: false,
    source: '',
    workshopId: ''
  });
  
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('');
  const [workshops, setWorkshops] = useState([]);
  const [loadingWorkshops, setLoadingWorkshops] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/workshops`)
      .then(res => res.json())
      .then(data => {
        if (data && data.success) {
          setWorkshops(data.data);
        }
        setLoadingWorkshops(false);
      })
      .catch(err => {
        console.error(err);
        setLoadingWorkshops(false);
      });

    const handleSelectWs = (e) => {
      if (e.detail?.workshopId) {
        setFormData(prev => ({ ...prev, workshopId: e.detail.workshopId }));
      }
    };
    window.addEventListener('selectWorkshop', handleSelectWs);
    return () => window.removeEventListener('selectWorkshop', handleSelectWs);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');
    
    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage(result.error || 'Something went wrong.');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('Network error, please try again.');
    }
  };

  const selectedWorkshop = workshops.find(w => w.id === formData.workshopId);
  const slotsLeft = selectedWorkshop ? selectedWorkshop.slotsLeft : null;

  if (status === 'success') {
    return (
      <div className="bg-[#0A0A0F] p-10 rounded-2xl shadow-xl max-w-lg w-full mx-auto border border-white/10 text-center">
        <div className="w-16 h-16 bg-[#3B82F6]/20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#3B82F6]">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-white mb-4 uppercase tracking-tight">APPLICATION RECEIVED</h2>
        <p className="text-white/60 mb-8 text-lg">
          Your BanaviAeBrand application has been received. Our team will contact you with the next steps.
        </p>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 py-3 bg-[#3B82F6] text-black font-bold rounded-lg hover:bg-[#2563EB] transition-colors uppercase tracking-wider"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0F] p-8 rounded-2xl shadow-xl max-w-2xl w-full mx-auto relative overflow-hidden border border-white/10">
      <div className="absolute top-0 left-0 w-full h-1 bg-[#3B82F6]"></div>
      
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">APPLY FOR BANAVIAEBRAND</h2>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full text-red-400 text-xs font-black uppercase tracking-wider mt-1 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>માત્ર 5 સીટો ઉપલબ્ધ છે · ONLY 5 SEATS AVAILABLE</span>
        </div>
        <p className="text-white/50 text-xs mt-2 uppercase tracking-wider font-semibold">
          વહેલા તે પહેલાના ધોરણે રજીસ્ટ્રેશન (First Come, First Served)
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">Full Name&nbsp;*</label>
            <input 
              type="text" 
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all"
              placeholder="Your full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">Select Workshop Date&nbsp;*</label>
            <select 
              name="workshopId"
              required
              value={formData.workshopId}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>
                {loadingWorkshops ? 'Loading dates...' : 'Select date & location'}
              </option>
              {!loadingWorkshops && workshops.map(ws => (
                <option key={ws.id} value={ws.id} disabled={ws.isFull}>
                  {ws.date} - {ws.location} {ws.isFull ? '(SOLD OUT)' : '(Only 5 Seats Available)'}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">Mobile Number&nbsp;*</label>
            <input 
              type="tel" 
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all"
              placeholder="WhatsApp number"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">Email Address&nbsp;*</label>
            <input 
              type="email" 
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all"
              placeholder="Your email"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">City&nbsp;*</label>
            <input 
              type="text" 
              name="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all"
              placeholder="Your city"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">Current Profession&nbsp;*</label>
            <input 
              type="text" 
              name="profession"
              required
              value={formData.profession}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all"
              placeholder="e.g. Student, Business Owner"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">Instagram Username</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-white/60 font-bold">@</span>
              <input 
                type="text" 
                name="instagramHandle"
                value={formData.instagramHandle}
                onChange={handleChange}
                className="w-full pl-9 pr-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all"
                placeholder="username"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">Which area interests you most?&nbsp;*</label>
          <select 
            name="interestArea"
            required
            value={formData.interestArea}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all appearance-none"
          >
            <option value="" disabled>Select an area</option>
            <option value="Personal Brand">Personal Brand</option>
            <option value="Business">Business</option>
            <option value="Content Creation">Content Creation</option>
            <option value="Social Media Management">Social Media Management</option>
            <option value="Freelancing">Freelancing</option>
            <option value="Creator/Influencer">Creator/Influencer</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">Why do you want to join BanaviAeBrand?&nbsp;*</label>
          <textarea 
            name="whyJoin"
            required
            value={formData.whyJoin}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all resize-none"
            placeholder="Your main goal..."
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">Current Social Media Exp&nbsp;*</label>
            <select 
              name="socialExperience"
              required
              value={formData.socialExperience}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all appearance-none"
            >
              <option value="" disabled>Select experience level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">Have you edited Reels before?&nbsp;*</label>
            <select 
              name="editingExperience"
              required
              value={formData.editingExperience}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all appearance-none"
            >
              <option value="" disabled>Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-white mb-1 uppercase tracking-wider">How did you hear about BanaviAeBrand?&nbsp;*</label>
          <input 
            type="text" 
            name="source"
            required
            value={formData.source}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-[#101018] border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all"
            placeholder="e.g. Instagram, Word of mouth"
          />
        </div>

        <div className="flex items-start gap-3 mt-4">
          <input 
            type="checkbox"
            id="participationAgreement"
            name="participationAgreement"
            required
            checked={formData.participationAgreement}
            onChange={handleChange}
            className="mt-1 w-5 h-5 rounded border-white/10 text-[#3B82F6] focus:ring-[#3B82F6] bg-[#101018]"
          />
          <label htmlFor="participationAgreement" className="text-sm text-white/60 cursor-pointer">
            I understand that BanaviAeBrand is a practical execution workshop, not just a lecture. I am willing to participate actively for the full day.&nbsp;*
          </label>
        </div>

        {status === 'error' && (
          <div className="p-3 bg-red-900/30 text-red-400 border border-red-500/30 rounded-lg flex items-start gap-2 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <button 
          type="submit" 
          disabled={status === 'submitting' || (selectedWorkshop && selectedWorkshop.isFull) || !formData.workshopId}
          className="w-full py-4 mt-6 bg-[#3B82F6] text-black rounded-lg font-black hover:bg-[#2563EB] transition-colors disabled:opacity-50 flex items-center justify-center uppercase tracking-wider"
        >
          {status === 'submitting' ? 'Submitting...' : 'Apply For BanaviAeBrand (₹10,000)'}
        </button>
      </form>
    </div>
  );
}
