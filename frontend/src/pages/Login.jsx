import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      
      // Show success toast
      setShowToast(true);
      
      setTimeout(() => {
        setShowToast(false);
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials');
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-on-background font-body-md overflow-hidden auth-gradient">
      {/* Success Toast */}
      <div 
        className={`fixed top-8 right-8 z-[100] transform transition-transform duration-500 ease-out ${showToast ? 'translate-y-0' : 'translate-y-[-200%]'}`}
      >
        <div className="bg-inverse-surface text-inverse-on-surface px-lg py-md rounded-xl flex items-center gap-md shadow-2xl border border-primary">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          <span className="font-label-sm text-label-sm">Session established successfully. Redirecting...</span>
        </div>
      </div>

      {/* Left Side: Illustration & Branding */}
      <section className="hidden lg:flex flex-col w-1/2 relative p-2xl justify-between overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="z-10">
          <div className="flex items-center gap-sm mb-xl">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            </div>
            <span className="font-headline-md text-headline-md font-bold text-primary tracking-tight">PrimeAuth</span>
          </div>
          <h1 className="font-display-lg text-display-lg max-w-lg mb-lg leading-tight">
            Engineered for <span className="text-primary">Performance</span> & <span className="text-secondary">Security</span>.
          </h1>
          <div className="space-y-md">
            <div className="flex items-center gap-md group">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary text-sm">lock</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Secure JWT Flow with automated token rotation</p>
            </div>
            <div className="flex items-center gap-md group">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary text-sm">admin_panel_settings</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Enterprise RBAC with granular permission controls</p>
            </div>
            <div className="flex items-center gap-md group">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant group-hover:border-primary transition-colors">
                <span className="material-symbols-outlined text-primary text-sm">monitoring</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Real-time threat detection and audit logging</p>
            </div>
          </div>
        </div>
        <div className="z-10 relative">
          <div className="glass-card rounded-2xl p-lg max-w-md border-primary/20">
            <div className="flex items-center gap-sm mb-sm">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse-ring"></div>
              <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Network Status</span>
            </div>
            <p className="font-code-md text-code-md text-primary opacity-80">primeauth-prod-v1.4.2 // Latency: 12ms</p>
          </div>
        </div>
        {/* Illustration Area */}
        <div className="absolute bottom-0 right-0 w-[80%] h-1/2 opacity-20 pointer-events-none">
          <img alt="Premium Illustration" className="w-full h-full object-contain object-bottom" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPlHDlqxjr4GoR9pMyBALSNNav1_O-uRofwvYWqbBMXh7BFO50ksn-YphoNj82fQZDo58gyma3FkBfpKfPFsomb7xbdjwFlJ5AmhXQp8CsIhOBlGSaWlX0Z_zeT1F_Mg9hN0DP4kY_nFbUmSKtq3keXhhGIj8K0hs92mi6J3IaZ8lP2FtxmT9bLHNIvPSQoRdjeL2y3loaKsiO773BPgcFV1mXq4_wUY_bpaAwbkiz0MgAVJMgICED36bxj82SW6M3dxvJOpf5ZZ5B"/>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="w-full lg:w-1/2 flex items-center justify-center p-md lg:p-2xl bg-surface-container-lowest">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-sm mb-xl justify-center">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>shield_person</span>
            </div>
            <span className="font-headline-md text-headline-md font-bold text-primary">PrimeAuth</span>
          </div>

          <div className="glass-card rounded-2xl p-xl shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <header className="mb-xl">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Welcome back</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">Enter your credentials to access the console</p>
              </header>

              {error && (
                <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg border border-error">
                  {error}
                </div>
              )}

              <form className="space-y-lg" onSubmit={handleSubmit}>
                <div className="space-y-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">Work Email</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-lg">mail</span>
                    <input 
                      className="w-full bg-surface-container border border-outline-variant rounded-lg pl-11 pr-md py-md text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
                      id="email" 
                      placeholder="name@company.com" 
                      required 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-xs">
                  <div className="flex justify-between items-center">
                    <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Password</label>
                    <a className="font-label-sm text-label-sm text-primary hover:text-secondary transition-colors" href="#">Forgot Password?</a>
                  </div>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline group-focus-within:text-primary transition-colors text-lg">lock</span>
                    <input 
                      className="w-full bg-surface-container border border-outline-variant rounded-lg pl-11 pr-md py-md text-on-surface placeholder:text-outline focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none" 
                      id="password" 
                      placeholder="••••••••" 
                      required 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="absolute right-md top-1/2 -translate-y-1/2 text-outline hover:text-on-surface" type="button">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-sm">
                  <input className="w-4 h-4 rounded border-outline-variant bg-surface-container text-primary focus:ring-primary" id="remember" type="checkbox"/>
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="remember">Remember this device</label>
                </div>

                <button 
                  className="w-full bg-primary text-on-primary font-label-sm text-label-sm py-md rounded-lg flex items-center justify-center gap-md hover:bg-primary/90 active:scale-[0.98] transition-all shadow-lg shadow-primary/20 disabled:opacity-50" 
                  disabled={loading}
                  type="submit"
                >
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                  {loading && (
                    <div>
                      <svg className="animate-spin h-5 w-5 text-on-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
                      </svg>
                    </div>
                  )}
                </button>
              </form>

              <div className="mt-xl pt-lg border-t border-outline-variant flex flex-col gap-md">
                <p className="font-body-sm text-body-sm text-on-surface-variant text-center">
                  Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Get started</Link>
                </p>
                <div className="flex justify-center gap-xl">
                  <button className="p-sm rounded-lg hover:bg-surface-variant transition-colors">
                    <img alt="Google" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5Dhw_ize32L3EqAo5CHoX2X4sZ-j-ZTLXCVd3rmOrsclM2MzFHmtNhmTjV7zcPGNMjQoAp-m884lCOyCqOxbGMVok-CXw0RjUzzKJx7wcNZlkb45lOnvgjWa0yGwtzYFdFFV6w7tmEmHitpL3vTpupUzQeOiAysprVC_hM5Y6Tam47bfwoSvLcedsOYH22qUvn7KclTpT2dHRW39R8GGhMKBsAhG6eGk3kgAs5k3OQlOkTwkPzOlCK_dL0wyJyYZQyPH4UDOzWLUu"/>
                  </button>
                  <button className="p-sm rounded-lg hover:bg-surface-variant transition-colors">
                    <img alt="GitHub" className="w-5 h-5 invert" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAhw2WHzEOG6vXm9_kp-_dGUN3vM42YoB8n1SKf4rMv1WSQtEsFs-tEnYYBaTwKL5Pxrqx3uqcZtX88vYzEO4zQEKlES0sDzIE6sthgROkyL1Dnz-4aHGEKJZOvUOKjsHKzKPPyU8HI1hi2dtmmcVT1JYBag-UTwCzj_l3Rr_NCCjK3NFi3ZJm-x6GOE0ye7I9j3VW2uWEbJgaHrRtFQhkxCnXhpjadEik0Ya6rdgbbShx193Lm2S_nRFD1gJ7Uvwc2V6ODj7XNDbk"/>
                  </button>
                  <button className="p-sm rounded-lg hover:bg-surface-variant transition-colors">
                    <img alt="Microsoft" className="w-5 h-5" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCr8HWm5jQFbRu22EuM8aa9HjuhSurmxnstw5zsMzXhjh1UGRmKd_wrvJ86EbQCgqwUySeDwRsi5CEUqQViloDrVB08ksCKDEKqnGEOW_-7vb-AIput_iMm_yprNapfIU1UaW_vojqFJWzGtl-PixyoAs8AUTosi05kpnh_DJrI2aw4Vn736HX8ml9kUjRXPWqVp-03EDJ2MN5sGvCc_9s9zNk1UjwlOWYWdD1oU0RJYE5W_L5niyYmWonCToSvp2ImsDSmx3RC6wSZ"/>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <footer className="mt-xl text-center">
            <p className="font-label-sm text-label-sm text-outline">© 2024 PrimeAuth Engineering. All rights reserved.</p>
          </footer>
        </div>
      </section>
    </div>
  );
};

export default Login;
