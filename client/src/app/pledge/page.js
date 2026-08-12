'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { AlertCircle, HeartHandshake, Languages, ShieldCheck } from 'lucide-react';
import { 
  useCreatePledgeMutation, 
  useInitDonationMutation, 
  useCompletePledgeMutation,
  useGetConfigQuery
} from '../../redux/api/apiSlice';

export default function PledgePage() {
  const searchParams = useSearchParams();
  const campaignId = searchParams.get('campaignId') || 1;
  
  const { data: configData } = useGetConfigQuery();
  const siteConfig = configData?.config || {};

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
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error
  const [pledgeId, setPledgeId] = useState(null);
  const [donationAmount, setDonationAmount] = useState(500);
  const [customAmount, setCustomAmount] = useState('');
  
  const [createPledge, { isLoading: isCreating }] = useCreatePledgeMutation();
  const [initDonation, { isLoading: isDonating }] = useInitDonationMutation();
  const [completePledge, { isLoading: isCompleting }] = useCompletePledgeMutation();

  const getPledgeText = () => {
    if (language === 'hindi') return siteConfig.pledgeHindi || 'मैं नशीली दवाओं और मादक पदार्थों के सेवन को ना कहने की प्रतिज्ञा करता हूँ।';
    if (language === 'marathi') return siteConfig.pledgeMarathi || 'मी अमली पदार्थ आणि व्यसनांना नाही म्हणण्याची प्रतिज्ञा करतो.';
    return siteConfig.pledgeEnglish || 'I pledge to say NO to drugs and substance abuse and to promote awareness, healthy choices and a drug-free society.';
  };

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
    
    setStatus('submitting');
    try {
      const res = await createPledge({
        ...formData,
        campaignId,
        language,
        pledgeText: getPledgeText()
      }).unwrap();
      
      if (res.success) {
        setPledgeId(res.pledgeId);
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Submit Error:', error);
      alert('Error Status: ' + error?.status + '\nError Data: ' + JSON.stringify(error?.data));
      setStatus('error');
    }
  };

  const handleDonate = async () => {
    const amount = customAmount ? parseFloat(customAmount) : donationAmount;
    if (!amount || amount <= 0) return;
    
    try {
      const res = await initDonation({ pledgeId, amount }).unwrap();
      
      if (res.success) {
        const pd = res.payuData;
        
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = process.env.NEXT_PUBLIC_PAYU_URL || 'https://test.payu.in/_payment';
        
        const inputs = {
          key: pd.key,
          txnid: pd.txnid,
          amount: pd.amount,
          productinfo: pd.productinfo,
          firstname: pd.firstname,
          email: pd.email,
          phone: pd.phone,
          surl: pd.surl,
          furl: pd.furl,
          hash: pd.hash
        };
        
        for (const key in inputs) {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = inputs[key];
          form.appendChild(input);
        }
        
        document.body.appendChild(form);
        form.submit();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleNoThanks = async () => {
    try {
      const res = await completePledge({ pledgeId }).unwrap();
      if (res.success) {
        window.location.href = `/pledge/success?id=${pledgeId}&cert=${res.certificateNumber}`;
      }
    } catch (error) {
      console.error(error);
      window.location.href = `/pledge/success?id=${pledgeId}`;
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 py-12">
        <div className="max-w-xl w-full bg-[#111] rounded-3xl shadow-2xl shadow-rose-900/20 overflow-hidden border border-white/10">
          <div className="bg-gradient-to-br from-rose-600 to-rose-900 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <HeartHandshake className="mx-auto h-16 w-16 mb-4 relative z-10 drop-shadow-md" />
            <h2 className="text-3xl font-black tracking-tight mb-2 relative z-10">Support the Cause</h2>
            <p className="text-rose-100 font-medium relative z-10">Your pledge has been recorded. You can optionally support our on-ground initiatives.</p>
          </div>
          
          <div className="p-8">
            {/* Donation Transparency Box */}
            <div className="mb-8 p-6 bg-emerald-900/20 border border-emerald-500/20 rounded-2xl flex gap-4 text-emerald-50">
              <ShieldCheck className="text-emerald-400 shrink-0 w-8 h-8" />
              <div>
                <h4 className="font-bold text-emerald-400 mb-1">How your donation helps</h4>
                <p className="text-sm text-emerald-100/70 leading-relaxed">
                  {siteConfig.donationUsage || 'Your donations will be utilized for conducting De-addiction drives, supporting rehabilitation centers, and promoting Women Safety initiatives.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {[100, 250, 500, 1000].map(amt => (
                <button
                  key={amt}
                  onClick={() => { setDonationAmount(amt); setCustomAmount(''); }}
                  className={`py-3 px-4 rounded-xl font-bold border-2 transition-all ${
                    donationAmount === amt && !customAmount
                      ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                      : 'border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-400 mb-2">Other Amount (₹)</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setDonationAmount(0); }}
                className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:border-rose-500 outline-none text-white"
                placeholder="Enter custom amount"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDonate}
                disabled={isDonating}
                className="w-full bg-rose-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_-5px_rgba(225,29,72,0.5)] hover:bg-rose-500 transition-all disabled:opacity-70"
              >
                {isDonating ? 'PROCESSING...' : 'DONATE NOW'}
              </button>
              <button
                onClick={handleNoThanks}
                disabled={isCompleting}
                className="w-full bg-white/5 text-slate-300 font-medium py-4 rounded-xl border border-white/10 hover:bg-white/10 transition-all disabled:opacity-70"
              >
                {isCompleting ? 'PLEASE WAIT...' : 'NO, THANK YOU'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] py-12 px-4 sm:px-6 lg:px-8 flex justify-center selection:bg-rose-500/30">
      <div className="max-w-2xl w-full bg-[#111] rounded-3xl shadow-2xl shadow-black/50 overflow-hidden border border-white/10">
        <div className="p-8 sm:p-12">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-6">
              <img src="/logo.png" alt="Veagle Space Logo" className="h-16 w-auto object-contain" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight mb-3">Take the Pledge</h1>
            <p className="text-slate-400">Join the movement and receive your official certificate.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Language Selector */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Languages className="text-rose-400 w-5 h-5" />
                <label className="text-sm font-bold text-white">Select Pledge Language</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
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
                      ? 'bg-rose-500/20 border-rose-500 text-rose-400' 
                      : 'bg-transparent border-white/10 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Full Name *</label>
                <input required type="text" name="name" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:border-rose-500 outline-none text-white transition-all" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Mobile Number *</label>
                <input required type="tel" name="mobile" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:border-rose-500 outline-none text-white transition-all" placeholder="9876543210" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email Address *</label>
              <input required type="email" name="email" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:border-rose-500 outline-none text-white transition-all" placeholder="john@example.com" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Profession *</label>
                <select required name="profession" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:border-rose-500 outline-none text-slate-300 transition-all">
                  <option value="" className="bg-[#111]">Select</option>
                  <option value="Student" className="bg-[#111]">Student</option>
                  <option value="Employee" className="bg-[#111]">Employee</option>
                  <option value="Business Owner" className="bg-[#111]">Business Owner</option>
                  <option value="Professional" className="bg-[#111]">Professional</option>
                  <option value="Teacher" className="bg-[#111]">Teacher</option>
                  <option value="Other" className="bg-[#111]">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">City</label>
                <input type="text" name="city" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:border-rose-500 outline-none text-white transition-all" placeholder="Mumbai" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">State</label>
                <input type="text" name="state" onChange={handleChange} className="w-full rounded-xl bg-white/5 border-white/10 px-4 py-3 border focus:border-rose-500 outline-none text-white transition-all" placeholder="Maharashtra" />
              </div>
            </div>

            <div className="mt-8 p-6 bg-rose-950/20 rounded-2xl border border-rose-900/30">
              <h3 className="font-bold text-rose-400 mb-3 text-lg">Your Pledge</h3>
              <p className="text-slate-300 italic mb-6 leading-relaxed font-serif text-lg">"{getPledgeText()}"</p>
              
              <label className="flex items-start gap-3 cursor-pointer group">
                <div className="flex h-6 items-center">
                  <input
                    required
                    name="consent"
                    type="checkbox"
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-white/20 bg-white/5 text-rose-500 focus:ring-rose-500 focus:ring-offset-[#111]"
                  />
                </div>
                <div className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  I agree to take this pledge and allow my submitted details to be used for campaign administration and certificate generation. My certificate will be generated in the language selected above.
                </div>
              </label>
            </div>

            {status === 'error' && (
              <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 p-4 rounded-xl">
                <AlertCircle size={20} />
                <span>There was an error processing your pledge. Please try again.</span>
              </div>
            )}

            <button
              disabled={isCreating}
              type="submit"
              className="w-full flex justify-center py-4 px-4 rounded-xl shadow-[0_0_30px_-5px_rgba(225,29,72,0.4)] text-lg font-bold text-white bg-rose-600 hover:bg-rose-500 hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isCreating ? 'PROCESSING...' : 'SUBMIT PLEDGE'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
