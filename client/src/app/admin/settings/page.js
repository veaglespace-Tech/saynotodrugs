'use client';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { User, Mail, Shield, Save, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Calendar } from 'lucide-react';
import { useGetAdminProfileQuery, useUpdateAdminProfileMutation } from '../../../redux/api/apiSlice';
import { setCredentials } from '../../../redux/slice/appSlice';

export default function AdminProfilePage() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.app.token);
  const { data: profileData, isLoading } = useGetAdminProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateAdminProfileMutation();

  // Profile form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (profileData?.admin) {
      setName(profileData.admin.name || '');
      setEmail(profileData.admin.email || '');
    }
  }, [profileData]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMessage({ type: '', text: '' });

    if (!name.trim() || !email.trim()) {
      setProfileMessage({ type: 'error', text: 'Name and email are required.' });
      return;
    }

    try {
      const res = await updateProfile({ name: name.trim(), email: email.trim() }).unwrap();
      if (res.success) {
        // Update Redux store with new admin data and token
        dispatch(setCredentials({ user: res.admin, token: res.token }));
        setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        setTimeout(() => setProfileMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setProfileMessage({ type: 'error', text: err?.data?.message || 'Failed to update profile.' });
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });

    if (!currentPassword || !newPassword) {
      setPasswordMessage({ type: 'error', text: 'Both password fields are required.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    try {
      const res = await updateProfile({ currentPassword, newPassword }).unwrap();
      if (res.success) {
        dispatch(setCredentials({ user: res.admin, token: res.token }));
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
        setTimeout(() => setPasswordMessage({ type: '', text: '' }), 4000);
      }
    } catch (err) {
      setPasswordMessage({ type: 'error', text: err?.data?.message || 'Failed to change password.' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const admin = profileData?.admin;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Profile</h1>
        <p className="text-slate-600 mt-1">Manage your account details and security settings.</p>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-orange-500 via-orange-600 to-amber-500">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAyYzguODM3IDAgMTYgNy4xNjMgMTYgMTZzLTcuMTYzIDE2LTE2IDE2LTE2LTcuMTYzLTE2LTE2IDcuMTYzLTE2IDE2LTE2eiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-30"></div>
        </div>
        <div className="px-8 pb-8 -mt-12 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-lg border-4 border-white">
              {admin?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 pt-2">
              <h2 className="text-2xl font-bold text-slate-900">{admin?.name || 'Admin User'}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Shield size={16} className="text-orange-500" />
                  <span className="font-medium capitalize text-sm">{(admin?.role || 'super_admin').replace('_', ' ')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Mail size={16} className="text-orange-500" />
                  <span className="text-sm">{admin?.email}</span>
                </div>
                {admin?.createdAt && (
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <Calendar size={16} className="text-orange-500" />
                    <span className="text-sm">Joined {new Date(admin.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Edit Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Profile Details</h3>
          <p className="text-sm text-slate-600 mt-0.5">Update your personal information.</p>
        </div>
        
        <form onSubmit={handleProfileUpdate} className="p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6">
            <button
              type="submit"
              disabled={isUpdating}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_20px_-5px_rgba(249,115,22,0.4)] disabled:opacity-50"
            >
              <Save size={18} />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
            {profileMessage.text && (
              <div className={`flex items-center gap-2 text-sm font-medium ${profileMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                {profileMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {profileMessage.text}
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Password Change Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h3 className="text-lg font-bold text-slate-900">Security</h3>
          <p className="text-sm text-slate-600 mt-0.5">Change your login password.</p>
        </div>

        <form onSubmit={handlePasswordUpdate} className="p-6 sm:p-8">
          <div className="max-w-md space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-12 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="submit"
                disabled={isUpdating}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-all disabled:opacity-50"
              >
                <Lock size={18} />
                {isUpdating ? 'Updating...' : 'Update Password'}
              </button>
              {passwordMessage.text && (
                <div className={`flex items-center gap-2 text-sm font-medium ${passwordMessage.type === 'success' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {passwordMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {passwordMessage.text}
                </div>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
