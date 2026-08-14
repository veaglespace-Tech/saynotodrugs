import { useState } from 'react';
import { Languages, AlertCircle } from 'lucide-react';
import { useCreatePledgeMutation } from '../../redux/api/apiSlice';
import { getPledgePoints } from '../../constants/pledgeTexts';

export default function PledgeForm({ campaignId, siteConfig, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    profession: '',
    city: '',
    state: '',
    consent: false
  });
  
  const [language, setLanguage] = useState('english');
  const [errorStatus, setErrorStatus] = useState(false);
  
  const [createPledge, { isLoading: isCreating }] = useCreatePledgeMutation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) return;
    
    setErrorStatus(false);
    try {
      const res = await createPledge({
        ...formData,
        campaignId,
        language,
        pledgeText: '9 points standard pledge' // Storing a summary since the full text is huge
      }).unwrap();
      
      if (res.success) {
        onSuccess(res.pledgeId);
      } else {
        setErrorStatus(true);
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('Error Status: ' + error?.status + '\nError Data: ' + JSON.stringify(error?.data));
      setErrorStatus(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      {/* Left Card: The Pledge */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200 overflow-hidden flex flex-col h-full animate-fade-in-up-delay-1">
        {/* Tricolor top accent */}
        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="p-6 sm:p-8 bg-gradient-to-r from-[#FFF9F2] to-white border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#FF9933]/15 text-[#FF9933] flex items-center justify-center text-sm font-black">1</span>
            Read & Accept the Pledge
          </h2>
        </div>
        
        <div className="p-6 sm:p-8 flex-1 flex flex-col">
          {/* Language Selector */}
          <div className="p-4 bg-[#FAFAFA] border border-gray-200 rounded-2xl mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Languages className="text-[#FF9933] w-5 h-5" />
              <label className="text-sm font-bold text-[#1a1a1a]">Select Pledge Language</label>
            </div>
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              {[
                { id: 'english', label: 'English' },
                { id: 'hindi', label: 'हिन्दी' },
                { id: 'marathi', label: 'मराठी' }
              ].map(lang => (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setLanguage(lang.id)}
                  className={`py-1.5 sm:py-2 rounded-xl font-medium border text-xs sm:text-sm transition-all ${
                    language === lang.id 
                    ? 'bg-[#FF9933]/10 border-[#FF9933] text-[#E6852E] shadow-sm' 
                    : 'bg-white border-gray-300 text-[#4a4a4a] hover:border-[#FF9933]/40'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-[#FFF9F2] rounded-2xl border border-[#FF9933]/10 p-5 mb-6 flex flex-col">
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar text-left space-y-3" style={{ maxHeight: '350px' }}>
              <ul className="list-decimal pl-5 text-sm text-[#4a4a4a] space-y-3">
                {getPledgePoints(language, siteConfig).map((point, idx) => (
                  <li key={idx} className="leading-relaxed">{point}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <label className="flex items-start gap-3 cursor-pointer group mt-auto p-4 bg-white border border-gray-200 rounded-xl hover:border-[#FF9933]/40 transition-colors">
            <div className="flex h-5 items-center mt-0.5">
              <input
                required
                name="consent"
                type="checkbox"
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 bg-white text-[#FF9933] focus:ring-[#FF9933] focus:ring-offset-white accent-[#FF9933]"
              />
            </div>
            <div className="text-sm text-[#4a4a4a] group-hover:text-[#1a1a1a] transition-colors">
              I agree to take this pledge and allow my details to be used for certificate generation.
            </div>
          </label>
        </div>
      </div>

      {/* Right Card: User Details */}
      <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-200 overflow-hidden flex flex-col h-full animate-fade-in-up-delay-2">
        {/* Tricolor top accent */}
        <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
        
        <div className="p-6 sm:p-8 bg-gradient-to-r from-white to-[#138808]/5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1a1a1a] flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-[#138808]/15 text-[#138808] flex items-center justify-center text-sm font-black">2</span>
            Your Details
          </h2>
        </div>
        
        <div className="p-6 sm:p-8 flex-1 flex flex-col">
          <div className="space-y-5 flex-1">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Full Name *</label>
                <input required type="text" name="name" onChange={handleChange} className="w-full rounded-xl bg-[#FAFAFA] border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-[#FF9933] outline-none text-[#1a1a1a] transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Mobile Number *</label>
                <input required type="tel" name="mobile" pattern="[0-9]{10}" maxLength="10" minLength="10" title="Please enter a valid 10-digit mobile number" onChange={handleChange} className="w-full rounded-xl bg-[#FAFAFA] border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-[#FF9933] outline-none text-[#1a1a1a] transition-all" placeholder="9876543210" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Email Address *</label>
              <input required type="email" name="email" onChange={handleChange} className="w-full rounded-xl bg-[#FAFAFA] border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-[#FF9933] outline-none text-[#1a1a1a] transition-all" placeholder="john@example.com" />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">Profession *</label>
                <select required name="profession" onChange={handleChange} className="w-full rounded-xl bg-[#FAFAFA] border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-[#FF9933] outline-none text-[#4a4a4a] transition-all">
                  <option value="" className="bg-white">Select</option>
                  <option value="Student" className="bg-white">Student</option>
                  <option value="Employee" className="bg-white">Employee</option>
                  <option value="Business Owner" className="bg-white">Business Owner</option>
                  <option value="Professional" className="bg-white">Professional</option>
                  <option value="Teacher" className="bg-white">Teacher</option>
                  <option value="Other" className="bg-white">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">City</label>
                <input type="text" name="city" onChange={handleChange} className="w-full rounded-xl bg-[#FAFAFA] border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-[#FF9933] outline-none text-[#1a1a1a] transition-all" placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#1a1a1a] mb-1.5">State</label>
                <input type="text" name="state" onChange={handleChange} className="w-full rounded-xl bg-[#FAFAFA] border-gray-200 px-4 py-2.5 border focus:bg-white focus:border-[#FF9933] outline-none text-[#1a1a1a] transition-all" placeholder="Maharashtra" />
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
            {errorStatus && (
              <div className="flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 p-4 rounded-xl text-sm font-medium">
                <AlertCircle size={18} className="shrink-0" />
                <span>There was an error processing your pledge. Please try again.</span>
              </div>
            )}

            <button
              disabled={isCreating || !formData.consent}
              type="submit"
              className="w-full flex justify-center py-4 px-4 rounded-xl shadow-[0_0_30px_-5px_rgba(255,153,51,0.4)] text-lg font-bold text-white bg-[#FF9933] hover:bg-[#E6852E] hover:-translate-y-0.5 transition-all outline-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isCreating ? 'PROCESSING...' : 'SUBMIT PLEDGE'}
            </button>
            {!formData.consent && (
              <p className="text-center text-xs text-[#FF9933] font-medium">
                * Please read and accept the pledge on the left to continue.
              </p>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
