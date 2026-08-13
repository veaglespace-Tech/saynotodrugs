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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Language Selector */}
      <div className="p-4 bg-slate-100 border border-slate-300 rounded-2xl mb-8">
        <div className="flex items-center gap-2 mb-3">
          <Languages className="text-orange-500 w-5 h-5" />
          <label className="text-sm font-bold text-slate-900">Select Pledge Language</label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {[
            { id: 'english', label: 'English' },
            { id: 'hindi', label: 'हिन्दी' },
            { id: 'marathi', label: 'मराठी' }
          ].map(lang => (
            <button
              key={lang.id}
              type="button"
              onClick={() => setLanguage(lang.id)}
              className={`py-2 rounded-xl font-medium border text-sm transition-all ${
                language === lang.id 
                ? 'bg-orange-500/20 border-orange-500 text-orange-400' 
                : 'bg-transparent border-slate-300 text-slate-600 hover:border-slate-400'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Full Name *</label>
          <input required type="text" name="name" onChange={handleChange} className="w-full rounded-xl bg-slate-100 border-slate-300 px-4 py-3 border focus:border-orange-500 outline-none text-slate-900 transition-all" placeholder="John Doe" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Mobile Number *</label>
          <input required type="tel" name="mobile" pattern="[0-9]{10}" maxLength="10" minLength="10" title="Please enter a valid 10-digit mobile number" onChange={handleChange} className="w-full rounded-xl bg-slate-100 border-slate-300 px-4 py-3 border focus:border-orange-500 outline-none text-slate-900 transition-all" placeholder="9876543210" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-600 mb-2">Email Address *</label>
        <input required type="email" name="email" onChange={handleChange} className="w-full rounded-xl bg-slate-100 border-slate-300 px-4 py-3 border focus:border-orange-500 outline-none text-slate-900 transition-all" placeholder="john@example.com" />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Profession *</label>
          <select required name="profession" onChange={handleChange} className="w-full rounded-xl bg-slate-100 border-slate-300 px-4 py-3 border focus:border-orange-500 outline-none text-slate-700 transition-all">
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
          <label className="block text-sm font-medium text-slate-600 mb-2">City</label>
          <input type="text" name="city" onChange={handleChange} className="w-full rounded-xl bg-slate-100 border-slate-300 px-4 py-3 border focus:border-orange-500 outline-none text-slate-900 transition-all" placeholder="Mumbai" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">State</label>
          <input type="text" name="state" onChange={handleChange} className="w-full rounded-xl bg-slate-100 border-slate-300 px-4 py-3 border focus:border-orange-500 outline-none text-slate-900 transition-all" placeholder="Maharashtra" />
        </div>
      </div>

      <div className="mt-8 p-6 bg-orange-50 rounded-2xl border border-orange-200">
        <h3 className="font-bold text-orange-600 mb-3 text-lg">Your Pledge</h3>
        <div className="max-h-64 overflow-y-auto pr-3 mb-6 space-y-3 custom-scrollbar text-left bg-white p-4 rounded-xl border border-orange-100">
          <ul className="list-decimal pl-5 text-sm text-slate-700 space-y-2">
            {getPledgePoints(language, siteConfig).map((point, idx) => (
              <li key={idx} className="leading-relaxed">{point}</li>
            ))}
          </ul>
        </div>
        
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="flex h-6 items-center">
            <input
              required
              name="consent"
              type="checkbox"
              onChange={handleChange}
              className="h-5 w-5 rounded border-slate-300 bg-white text-orange-500 focus:ring-orange-500 focus:ring-offset-white"
            />
          </div>
          <div className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors">
            I agree to take this pledge and allow my submitted details to be used for campaign administration and certificate generation. My certificate will be generated in the language selected above.
          </div>
        </label>
      </div>

      {errorStatus && (
        <div className="flex items-center gap-2 text-orange-600 bg-orange-50 border border-orange-200 p-4 rounded-xl">
          <AlertCircle size={20} />
          <span>There was an error processing your pledge. Please try again.</span>
        </div>
      )}

      <button
        disabled={isCreating}
        type="submit"
        className="w-full flex justify-center py-4 px-4 rounded-xl shadow-[0_0_30px_-5px_rgba(249,115,22,0.4)] text-lg font-bold text-white bg-orange-600 hover:bg-orange-500 hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {isCreating ? 'PROCESSING...' : 'SUBMIT PLEDGE'}
      </button>
    </form>
  );
}
