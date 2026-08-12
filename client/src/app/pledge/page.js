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

import { Suspense } from 'react';

function PledgeContent() {
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

  const getPledgePoints = () => {
    if (language === 'hindi') {
      if (siteConfig.pledgeHindi) {
        return siteConfig.pledgeHindi.split('\n').filter(p => p.trim());
      }
      return [
        "मैं नशीले पदार्थो और नशे की लत को दृढ़ता से ना कहूँगा/कहूँगी और स्वस्थ, जिम्मेदार एवं सकारात्मक जीवन जीने का प्रयास करूँगा/करूँगी।",
        "मैं अपने शरीर, मन, रिश्तों और भविष्य को नुकसान पहुँचाने वाले अवैध ड्रग्स और मादक पदार्थो से दूर रहूँगा/रहूँगी।",
        "मैं तंबाकू और निकोटीन उत्पादों को ना कहूँगा/कहूँगी, जिनमें सिगरेट, बीड़ी, गुटखा, खैनी, पान मसाला, चबाने वाला तंबाकू, वेपिंग उत्पाद, ई-सिगरेट और अन्य तंबाकू या निकोटीन उत्पाद शामिल हैं।",
        "मैं शराब और हानिकारक पदार्थो के दुरुपयोग से दूर रहूँगा/रहूँगी और इनके दुरुपयोग को बढ़ावा नहीं दूँगा/दूँगी।",
        "मैं प्रिस्क्रिप्शन दवाओं और अन्य दवाओं का उपयोग केवल योग्य चिकित्सकीय विशेषज्ञ की सलाह के अनुसार और जिम्मेदारी से करूँगा/करूँगी।",
        "मैं ड्रग्स, तंबाकू, शराब या अन्य हानिकारक पदार्थों के दुरुपयोग को बढ़ावा नहीं दूँगा/दूँगी, न ही उनकी आपूर्ति, बिक्री या प्रचार करूँगा/करूँगी।",
        "मैं अपने परिवार, मित्रों और समाज के लोगों को स्वस्थ जीवनशैली अपनाने और नशे से दूर रहने के लिए प्रोत्साहित करूँगा/करूँगी।",
        "यदि मैं या मेरे किसी परिचित को नशे की लत या किसी पदार्थ पर निर्भरता से संघर्ष करना पड़ता है, तो मैं उन्हें उचित पेशेवर सहायता, उपचार और सहयोग लेने के लिए प्रोत्साहित करूँगा/करूँगी।",
        "मैं नशे और मादक पदार्थों के हानिकारक प्रभावों के बारे में जागरूकता फैलाने में योगदान दूँगा/दूँगी और एक स्वस्थ, सुरक्षित एवं नशामुक्त समाज बनाने में अपनी भूमिका निभाऊँगा/निभाऊँगी।"
      ];
    }
    if (language === 'marathi') {
      if (siteConfig.pledgeMarathi) {
        return siteConfig.pledgeMarathi.split('\n').filter(p => p.trim());
      }
      return [
        "मी अमली पदार्थ आणि व्यसनाधीनतेला ठामपणे नकार देईन आणि निरोगी, जबाबदार व सकारात्मक जीवन जगण्याचा प्रयत्न करेन.",
        "माझ्या शरीराला, मनाला, नातेसंबंधांना आणि भविष्यातील जीवनाला हानी पोहोचवणाऱ्या बेकायदेशीर अमली पदार्थांपासून व मादक पदार्थांपासून मी दूर राहीन.",
        "मी तंबाखू व निकोटीनयुक्त पदार्थांना नकार देईन, ज्यामध्ये सिगारेट, बीडी, गुटखा, खैनी, पान मसाला, चघळण्याचा तंबाखू, व्हेपिंग उत्पादने, ई-सिगारेट आणि इतर तंबाखू किंवा निकोटीनयुक्त पदार्थांचा समावेश आहे.",
        "मी मद्यपान आणि हानिकारक पदार्थांच्या गैरवापरापासून दूर राहीन आणि त्यांच्या गैरवापरास प्रोत्साहन देणार नाही.",
        "मी प्रिस्क्रिप्शन औषधे आणि इतर औषधांचा वापर केवळ पात्र वैद्यकीय तज्ज्ञांच्या सल्ल्यानुसार आणि जबाबदारीने करेन.",
        "मी अमली पदार्थ, तंबाखू, मद्य किंवा इतर हानिकारक पदार्थांचा गैरवापर करण्यास प्रोत्साहन देणार नाही, त्यांचा पुरवठा, विक्री किंवा प्रसार करणार नाही.",
        "माझे कुटुंब, मित्र आणि समाजातील इतर व्यक्तींना निरोगी जीवनशैली स्वीकारण्यासाठी आणि व्यसनापासून दूर राहण्यासाठी मी प्रोत्साहित करेन.",
        "मला किंवा माझ्या ओळखीतील कोणाला व्यसनाधीनतेशी किंवा पदार्थांच्या अवलंबनतेशी संघर्ष करावा लागत असल्यास, त्यांना योग्य व्यावसायिक मदत, उपचार आणि आधार घेण्यासाठी प्रोत्साहित करेन.",
        "व्यसनाधीनतेच्या आणि अमली पदार्थांच्या दुष्परिणामांबद्दल जनजागृती करण्यासाठी मी योगदान देईन आणि निरोगी, सुरक्षित व व्यसनमुक्त समाज घडविण्यासाठी माझी भूमिका बजावेन."
      ];
    }
    
    if (siteConfig.pledgeEnglish) {
      return siteConfig.pledgeEnglish.split('\n').filter(p => p.trim());
    }
    return [
      "I will say NO to drugs and substance abuse and choose a healthy, responsible and positive life.",
      "I will stay away from illegal drugs and narcotic substances, including substances that can harm my body, mind, relationships and future.",
      "I will say NO to tobacco and nicotine products, including cigarettes, bidis, gutkha, khaini, pan masala, chewing tobacco, vaping products, e-cigarettes and other tobacco or nicotine products.",
      "I will avoid alcohol and harmful substance use and will not encourage or promote their misuse.",
      "I will use prescription medicines and other medicines only responsibly and as advised by a qualified medical professional.",
      "I will not encourage, supply, sell, share or promote the misuse of drugs, tobacco, alcohol or other harmful substances.",
      "I will encourage my family, friends and community to make healthy choices and stay away from substance abuse.",
      "If I or someone I know is struggling with substance dependence or addiction, I will encourage them to seek appropriate professional help, care and support.",
      "I will spread awareness about the harmful effects of substance abuse and contribute to building a healthy, safe and drug-free society."
    ];
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
        pledgeText: '9 points standard pledge' // Storing a summary since the full text is huge
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-12">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl shadow-orange-900/20 overflow-hidden border border-slate-300">
          <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-emerald-600 p-8 text-center text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <HeartHandshake className="mx-auto h-16 w-16 mb-4 relative z-10 drop-shadow-md" />
            <h2 className="text-3xl font-black tracking-tight mb-2 relative z-10">Support the Cause</h2>
            <p className="text-orange-100 font-medium relative z-10">Your pledge has been recorded. You can optionally support our on-ground initiatives.</p>
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
                      ? 'border-orange-500 bg-orange-500/10 text-orange-400'
                      : 'border-slate-300 text-slate-600 hover:border-white/20'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-slate-600 mb-2">Other Amount (₹)</label>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setDonationAmount(0); }}
                className="w-full rounded-xl bg-slate-100 border-slate-300 px-4 py-3 border focus:border-orange-500 outline-none text-slate-900"
                placeholder="Enter custom amount"
              />
            </div>
            
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDonate}
                disabled={isDonating}
                className="w-full bg-orange-600 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_-5px_rgba(249,115,22,0.5)] hover:bg-orange-500 transition-all disabled:opacity-70"
              >
                {isDonating ? 'PROCESSING...' : 'DONATE NOW'}
              </button>
              <button
                onClick={handleNoThanks}
                disabled={isCompleting}
                className="w-full bg-slate-100 text-slate-700 font-medium py-4 rounded-xl border border-slate-300 hover:bg-slate-200 transition-all disabled:opacity-70"
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
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex justify-center selection:bg-orange-500/30">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl shadow-black/50 overflow-hidden border border-slate-300">
        <div className="p-8 sm:p-12">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center mb-6">
              <img src="/logo.png" alt="Veagle Space Logo" className="h-16 w-auto object-contain" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">Take the Pledge</h1>
            <p className="text-slate-600">Join the movement and receive your official certificate.</p>
          </div>
          
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
                  {getPledgePoints().map((point, idx) => (
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

            {status === 'error' && (
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
        </div>
      </div>
    </div>
  );
}

export default function PledgePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div></div>}>
      <PledgeContent />
    </Suspense>
  );
}
