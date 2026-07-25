/**
 * @file LoginScreen.tsx
 * @description صفحه اختصاصی ورود و ثبت‌نام سامانه هم‌نگار
 * @architecture
 * - Single Responsibility Principle (SRP): احراز هویت الزامی کاربران پیش از ورود به ماژول‌های سامانه هم‌نگار
 */

import React, { useState } from 'react';
import { useWorkspace } from '../context/WorkspaceContext';
import { Workflow, Shield, LogIn, UserPlus, KeyRound, User, Mail, Briefcase, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { INITIAL_USERS } from '../data/initialData';

export const LoginScreen: React.FC = () => {
  const { loginUser, registerUser } = useWorkspace();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // فرم ورود
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // فرم ثبت‌نام
  const [regName, setRegName] = useState('');
  const [regNameEn, setRegNameEn] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regJobTitle, setRegJobTitle] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!usernameOrEmail.trim() || !password) {
      setLoginError('لطفاً نام کاربری/ایمیل و کلمه عبور را وارد کنید.');
      return;
    }

    const res = loginUser(usernameOrEmail, password);
    if (!res.success) {
      setLoginError(res.error || 'اطلاعات ورود اشتباه است.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
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
  };

  const fillQuickAccount = (uname: string, pass: string) => {
    setUsernameOrEmail(uname);
    setPassword(pass);
    setLoginError('');
    loginUser(uname, pass);
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans" dir="rtl">
      
      {/* جلوه گرافیکی پس‌زمینه */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 relative z-10">
        
        {/* ستون راست: برندینگ و معرفی هم‌نگار */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-l border-slate-800">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Workflow className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white tracking-tight">سامانه هم‌نگار</h1>
                <p className="text-xs text-indigo-300">مدیریت و مدلسازی فرآیندهای سازمانی</p>
              </div>
            </div>

            <div className="space-y-4 my-8">
              <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50">
                <h4 className="text-xs font-bold text-indigo-400 mb-1">مدلسازی تعاملی BPMN 2.0</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  طراحی دیاگرام‌های استاندارد، بازبینی هوشمند، شبیه‌سازی توکن و خروجی‌های چندگانه.
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50">
                <h4 className="text-xs font-bold text-emerald-400 mb-1">مدیریت نسخه و نظرات یکپارچه</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  ثبت تاریخچه تغییرات، مقایسه بصری نسخه‌ها (Visual Diff) و ثبت نظرات بازبینان.
                </p>
              </div>

              <div className="p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/50">
                <h4 className="text-xs font-bold text-amber-400 mb-1">همکاری تیمی و کنترل دسترسی (RBAC)</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  سطوح دسترسی مدیر، ویرایش‌گر، بازبین و مشاهده‌کننده همراه با ساختار درختی پوشه‌ها.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 border-t border-slate-800/80 pt-4">
            سامانه هم‌نگار • نسخه‌ی ۲.۵ (ویژه سازمان‌ها و شرکت‌های پیشرو)
          </div>
        </div>

        {/* ستون چپ: فرم ورود / ثبت‌نام */}
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-6">
          
          {/* تب سوئیچ بین ورود و ثبت نام */}
          <div className="flex items-center p-1 bg-slate-800/80 rounded-2xl border border-slate-700/80">
            <button
              type="button"
              onClick={() => { setMode('login'); setLoginError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                mode === 'login'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>ورود به سامانه</span>
            </button>
            
            <button
              type="button"
              onClick={() => { setMode('register'); setLoginError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 ${
                mode === 'register'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>ثبت‌نام کاربر جدید</span>
            </button>
          </div>

          {/* فرم ورود */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-white mb-1">ورود به حساب کاربری هم‌نگار</h3>
                <p className="text-xs text-slate-400">جهت دسترسی به داشبورد و مدلساز ابتدا وارد شوید.</p>
              </div>

              {loginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">نام کاربری یا ایمیل:</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="مثال: ali.rezaei یا ali.rezaei@enterprise.com"
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      className="w-full pr-9 pl-3 py-2.5 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">کلمه عبور:</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pr-9 pl-3 py-2.5 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2"
              >
                <span>ورود و ورود به فضای کاری هم‌نگار</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              {/* ورود سریع آزمایشی */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 block">ورود سریع با کاربران نمونه هم‌نگار:</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('ali.rezaei', '123')}
                    className="p-2 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-right text-xs transition"
                  >
                    <span className="font-bold text-white block">علی رضایی</span>
                    <span className="text-[10px] text-indigo-400 block">👑 مدیر ارشد فرآیند</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickAccount('m.ahmadi', '123')}
                    className="p-2 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-right text-xs transition"
                  >
                    <span className="font-bold text-white block">مریم احمدی</span>
                    <span className="text-[10px] text-emerald-400 block">🔍 ممیز و بازبینی‌کننده</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickAccount('sara.h', '123')}
                    className="p-2 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-right text-xs transition"
                  >
                    <span className="font-bold text-white block">سارا حسینی</span>
                    <span className="text-[10px] text-amber-400 block">✏️ طراح و ویرایش‌گر</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => fillQuickAccount('reza.m', '123')}
                    className="p-2 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700 rounded-xl text-right text-xs transition"
                  >
                    <span className="font-bold text-white block">رضا محمدی</span>
                    <span className="text-[10px] text-slate-400 block">👁️ ناظر و مشاهده‌کننده</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* فرم ثبت نام */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3">
              <div>
                <h3 className="text-base font-bold text-white mb-1">ثبت‌نام کاربر جدید در هم‌نگار</h3>
                <p className="text-xs text-slate-400">اطلاعات حساب کاربری خود را جهت پیوستن به تیم وارد کنید.</p>
              </div>

              {registerSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-3 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>ثبت‌نام با موفقیت انجام شد! در حال انتقال به فضای کاری...</span>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">نام و نام خانوادگی:</label>
                      <input
                        type="text"
                        required
                        placeholder="مثال: حسین کاظمی"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">سمت شغلی:</label>
                      <input
                        type="text"
                        placeholder="مثال: تحلیل‌گر ارشد کسب‌وکار"
                        value={regJobTitle}
                        onChange={(e) => setRegJobTitle(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">ایمیل سازمانی:</label>
                      <input
                        type="email"
                        required
                        placeholder="h.kazemi@enterprise.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-300 mb-1">نام کاربری:</label>
                      <input
                        type="text"
                        placeholder="h.kazemi"
                        value={regUsername}
                        onChange={(e) => setRegUsername(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 mb-1">کلمه عبور:</label>
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-800/80 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 mt-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>تکمیل ثبت‌نام و ورود به هم‌نگار</span>
                  </button>
                </>
              )}
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
