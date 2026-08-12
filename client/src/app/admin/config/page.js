'use client';
import { useState, useEffect } from 'react';
import { Save, Languages, Shield, FileText } from 'lucide-react';
import { useGetConfigQuery, useUpdateConfigMutation } from '../../../redux/api/apiSlice';

export default function SiteConfigPage() {
  const { data, isLoading } = useGetConfigQuery();
  const [updateConfig, { isLoading: isUpdating }] = useUpdateConfigMutation();
  
  const [formData, setFormData] = useState({
    donationUsage: '',
    pledgeEnglish: '',
    pledgeHindi: '',
    pledgeMarathi: '',
    certificateFormat: ''
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    if (data?.config) {
      setFormData({
        donationUsage: data.config.donationUsage || '',
        pledgeEnglish: data.config.pledgeEnglish || '',
        pledgeHindi: data.config.pledgeHindi || '',
        pledgeMarathi: data.config.pledgeMarathi || '',
        certificateFormat: data.config.certificateFormat || ''
      });
    }
  }, [data]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const res = await updateConfig(formData).unwrap();
      if (res.success) {
        setMessage('Configuration saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (err) {
      console.error(err);
      setMessage('Failed to save configuration.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Site Configuration</h1>
        <p className="text-slate-600 mt-1">Manage public texts, certificates, and multi-language pledges.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Certificate Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-100 flex items-center gap-3">
            <FileText className="text-orange-400" />
            <h2 className="text-xl font-bold text-slate-900">Certificate Format</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Certificate Introductory Text (Use <code>{'{name}'}</code> as placeholder)
            </label>
            <textarea
              name="certificateFormat"
              value={formData.certificateFormat}
              onChange={handleChange}
              rows="3"
              className="block w-full px-4 py-3 border border-slate-300 bg-slate-100 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="This certificate is proudly presented to {name}..."
            />
          </div>
        </div>

        {/* Donation Usage Section */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-100 flex items-center gap-3">
            <Shield className="text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-900">Donation Usage (Concern Page)</h2>
          </div>
          <div className="p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Where will the donations be used? (Displayed to users before payment)
            </label>
            <textarea
              name="donationUsage"
              value={formData.donationUsage}
              onChange={handleChange}
              rows="4"
              className="block w-full px-4 py-3 border border-slate-300 bg-slate-100 rounded-xl text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
              placeholder="Funds will be used for Women Safety..."
            />
          </div>
        </div>

        {/* Multi-Language Pledges */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 bg-slate-100 flex items-center gap-3">
            <Languages className="text-amber-400" />
            <h2 className="text-xl font-bold text-slate-900">Pledges (3 Languages)</h2>
          </div>
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">English Pledge (Enter one point per line)</label>
              <textarea
                name="pledgeEnglish"
                value={formData.pledgeEnglish}
                onChange={handleChange}
                rows="10"
                className="block w-full px-4 py-3 border border-slate-300 bg-slate-100 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Hindi Pledge (हिन्दी) (Enter one point per line)</label>
              <textarea
                name="pledgeHindi"
                value={formData.pledgeHindi}
                onChange={handleChange}
                rows="10"
                className="block w-full px-4 py-3 border border-slate-300 bg-slate-100 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Marathi Pledge (मराठी) (Enter one point per line)</label>
              <textarea
                name="pledgeMarathi"
                value={formData.pledgeMarathi}
                onChange={handleChange}
                rows="10"
                className="block w-full px-4 py-3 border border-slate-300 bg-slate-100 rounded-xl text-slate-900 focus:ring-2 focus:ring-amber-500 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] disabled:opacity-50"
          >
            <Save size={20} />
            {isUpdating ? 'Saving...' : 'Save Configuration'}
          </button>
          {message && (
            <span className={`font-medium ${message.includes('success') ? 'text-emerald-400' : 'text-red-400'}`}>
              {message}
            </span>
          )}
        </div>
        
      </form>
    </div>
  );
}
