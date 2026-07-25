/**
 * @file AuthModal.tsx
 * @description پنجره مدیریت حساب کاربری، مشخصات پروفایل و سوئیچ بین اکانت‌ها در سامانه هم‌نگار
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { LogIn, UserPlus, LogOut, Shield, KeyRound, User, Mail, Briefcase, AlertCircle, CheckCircle2, UserCheck, RefreshCw, Camera, Upload, Check } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, loginUser, logoutUser, registerUser, updateUserProfile, currentRole } = useWorkspace();
  const [activeTab, setActiveTab] = useState<'profile' | 'login' | 'register'>(currentUser ? 'profile' : 'login');
  const [profileMessage, setProfileMessage] = useState('');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);
  
  // Login State
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regNameEn, setRegNameEn] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regJobTitle, setRegJobTitle] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  if (!isOpen) return null;

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'manager': return 'مدیر سیستم و تیم';
      case 'editor': return 'ویرایش‌گر مدلساز';
      case 'reviewer': return 'مسئول ارزیابی و بازبینی';
      default: return 'مشاهده‌کننده فرآیندها';
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!usernameOrEmail.trim() || !password) {
      setLoginError('لطفاً نام کاربری/ایمیل و کلمه عبور را وارد کنید.');
      return;
    }

    const res = loginUser(usernameOrEmail, password);
    if (res.success) {
      setUsernameOrEmail('');
      setPassword('');
      onClose();
    } else {
      setLoginError(res.error || 'خطا در ورود به سامانه.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword) return;

    registerUser({
      name: regName.trim(),
      nameEn: regNameEn.trim(),
      email: regEmail.trim(),
      username: regUsername.trim() || regEmail.trim().split('@')[0],
      password: regPassword,
      jobTitle: regJobTitle.trim()
    });

    setRegisterSuccess(true);
    setTimeout(() => {
      setRegisterSuccess(false);
      onClose();
    }, 1200);
  };

  const fillQuickAccount = (uname: string, pass: string) => {
    setUsernameOrEmail(uname);
    setPassword(pass);
    setLoginError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4" dir="rtl">
      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">مدیریت حساب کاربری هم‌نگار</h3>
              <p className="text-xs text-slate-400">مشخصات کاربر جاری، نقش سازمانی و احراز هویت</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg p-1.5 rounded-xl hover:bg-white/10 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tabs Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 p-1.5">
          {currentUser && (
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>پروفایل من</span>
            </button>
          )}
          <button
            onClick={() => { setActiveTab('login'); setLoginError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>{currentUser ? 'تعویض حساب' : 'ورود'}</span>
          </button>
          <button
            onClick={() => { setActiveTab('register'); setLoginError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200/60 dark:border-slate-700/60'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>ثبت‌نام جدید</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'profile' && currentUser ? (
            <div className="space-y-5">
              
              {profileMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{profileMessage}</span>
                </div>
              )}

              {/* User Identity Card with Profile Picture Upload */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row items-center gap-4">
                
                {/* Avatar with Camera Overlay */}
                <div className="relative group shrink-0">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md transition-transform group-hover:scale-105"
                  />
                  <label
                    htmlFor="avatar-file-input"
                    className="absolute inset-0 bg-slate-900/70 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer text-white p-1 text-center"
                    title="برای تغییر عکس پروفایل کلیک کنید"
                  >
                    <Camera className="w-5 h-5 mb-0.5 text-indigo-300" />
                    <span className="text-[10px] font-bold">تغییر عکس</span>
                  </label>
                  <input
                    id="avatar-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          alert("حجم تصویر نباید بیشتر از ۵ مگابایت باشد.");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            updateUserProfile({ avatar: reader.result });
                            setProfileMessage('تصویر پروفایل شما با موفقیت آپلود و بروزرسانی شد.');
                            setTimeout(() => setProfileMessage(''), 3000);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>

                <div className="space-y-1.5 text-center sm:text-right flex-1">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {currentUser.name}
                  </h4>
                  {currentUser.nameEn && (
                    <p className="text-xs text-slate-400 font-mono dir-ltr text-center sm:text-right">{currentUser.nameEn}</p>
                  )}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-0.5">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-500/20">
                      <UserCheck className="w-3.5 h-3.5" />
                      {getRoleLabel(currentRole)}
                    </span>

                    <label
                      htmlFor="avatar-file-input"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-semibold cursor-pointer transition shadow-sm"
                    >
                      <Upload className="w-3 h-3" />
                      <span>آپلود عکس</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowAvatarUrlInput(!showAvatarUrlInput)}
                      className="text-[11px] text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 underline cursor-pointer"
                    >
                      آدرس تصویر (URL)
                    </button>
                  </div>
                </div>
              </div>

              {/* URL Avatar Input Form */}
              {showAvatarUrlInput && (
                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 animate-fade-in">
                  <label className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block">
                    لینک یا آدرس مستقیم تصویر پروفایل:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://example.com/avatar.jpg"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (customAvatarUrl.trim()) {
                          updateUserProfile({ avatar: customAvatarUrl.trim() });
                          setProfileMessage('تصویر پروفایل با موفقیت بروزرسانی شد.');
                          setCustomAvatarUrl('');
                          setShowAvatarUrlInput(false);
                          setTimeout(() => setProfileMessage(''), 3000);
                        }
                      }}
                      className="px-3 py-1.5 bg-indigo-600 text-white text-xs rounded-lg font-bold hover:bg-indigo-700 cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      اعمال
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>نام کاربری:</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block font-mono">@{currentUser.username || 'user'}</span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" />
                    <span>ایمیل سازمانی:</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block font-mono">{currentUser.email}</span>
                </div>

                <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-1 sm:col-span-2">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                    <span>سمت / عنوان شغلی:</span>
                  </span>
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{currentUser.jobTitle || 'کارشناس فرآیند'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => {
                    logoutUser();
                    onClose();
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج از حساب کاربری</span>
                </button>
                <button
                  onClick={() => setActiveTab('login')}
                  className="px-4 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold hover:bg-slate-300 dark:hover:bg-slate-700 transition flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>تعویض حساب</span>
                </button>
              </div>

            </div>
          ) : activeTab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  نام کاربری یا ایمیل سازمانی <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="مثال: ali.rezaei یا m.ahmadi@enterprise.com"
                    value={usernameOrEmail}
                    onChange={(e) => setUsernameOrEmail(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dir-ltr text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  کلمه عبور <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-9 pl-3 py-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dir-ltr text-right"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>ورود به سیستم عملیاتی</span>
              </button>

              {/* Quick Accounts Hint Box */}
              <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-2">
                  اکانت‌های پیش‌فرض سازمانی (جهت تست سریع):
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('ali.rezaei', '123')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-right border border-slate-200/80 dark:border-slate-700/60 transition cursor-pointer"
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-200">علی رضایی (مدیر)</div>
                    <div className="text-[10px] text-slate-400 font-mono">ali.rezaei / 123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('m.ahmadi', '123')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-right border border-slate-200/80 dark:border-slate-700/60 transition cursor-pointer"
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-200">مریم احمدی (بازبین)</div>
                    <div className="text-[10px] text-slate-400 font-mono">m.ahmadi / 123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('sara.h', '123')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-right border border-slate-200/80 dark:border-slate-700/60 transition cursor-pointer"
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-200">سارا حسینی (ویرایشگر)</div>
                    <div className="text-[10px] text-slate-400 font-mono">sara.h / 123</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('reza.m', '123')}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 hover:bg-slate-200 dark:hover:bg-slate-800 text-right border border-slate-200/80 dark:border-slate-700/60 transition cursor-pointer"
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-200">رضا محمدی (مشاهده‌گر)</div>
                    <div className="text-[10px] text-slate-400 font-mono">reza.m / 123</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {registerSuccess && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-2xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>ثبت‌نام با موفقیت انجام شد! در حال انتقال...</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام و نام خانوادگی <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مانند: کامران جعفری"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  نام کاربری (Username) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="k.jafari"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  آدرس ایمیل سازمانی <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="k.jafari@company.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  کلمه عبور <span className="text-rose-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="رمز عبور دلخواه..."
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 dir-ltr text-right"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  عنوان شغلی
                </label>
                <input
                  type="text"
                  placeholder="کارشناس ارشد تحلیل و تضمین کیفیت"
                  value={regJobTitle}
                  onChange={(e) => setRegJobTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs transition shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>ثبت‌نام و ایجاد حساب جدید</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
