import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let score = 0;
    if (password.length > 6) score++;
    if (password.match(/[A-Z]/) && password.match(/[0-9]/)) score++;
    if (password.match(/[^A-Za-z0-9]/)) score++;
    setStrength(password.length === 0 ? 0 : Math.max(1, score));
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await register(name, email, password);
      // Backend automatically sets role to USER.
      
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthBars = () => {
    const bars = [];
    for (let i = 1; i <= 3; i++) {
      let colorClass = 'bg-surface-container-highest';
      if (strength >= i) {
        if (strength === 1) colorClass = 'bg-error';
        else if (strength === 2) colorClass = 'bg-tertiary';
        else if (strength === 3) colorClass = 'bg-primary';
      }
      bars.push(<div key={i} className={`h-[4px] rounded-[2px] flex-1 transition-all duration-300 ${colorClass}`}></div>);
    }
    return bars;
  };

  const getStrengthText = () => {
    if (strength === 0) return { text: 'Enter a password', color: 'text-outline-variant' };
    if (strength === 1) return { text: 'Weak', color: 'text-error' };
    if (strength === 2) return { text: 'Good', color: 'text-tertiary' };
    return { text: 'Strong', color: 'text-primary' };
  };

  const strText = getStrengthText();

  return (
    <div className="flex min-h-screen items-center justify-center p-md lg:p-xl relative overflow-x-hidden bg-[#020617] text-[#dae2fd]">
      <div className="relative w-full max-w-lg z-10">
        <div className="flex flex-col items-center mb-xl">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl shadow-lg shadow-primary/20 mb-md">
            <span className="material-symbols-outlined text-on-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">PrimeAuth</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Create your enterprise identity</p>
        </div>

        {!success ? (
          <div className="glass-card rounded-xl p-lg md:p-xl transition-all duration-500 transform opacity-100 translate-y-0">
            {error && (
              <div className="mb-4 p-3 bg-error-container text-on-error-container rounded-lg border border-error">
                {error}
              </div>
            )}
            
            <form className="space-y-lg" onSubmit={handleSubmit}>
              <div className="space-y-sm">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest block">Account Role</label>
                <div className="grid grid-cols-2 gap-md">
                  <label className="relative cursor-pointer group">
                    <input 
                      checked={role === 'user'} 
                      onChange={() => setRole('user')}
                      className="peer sr-only" 
                      name="role" 
                      type="radio" 
                      value="user"
                    />
                    <div className="flex items-center gap-md p-md rounded-lg border border-outline-variant bg-surface-container-low transition-all duration-200 group-hover:bg-surface-variant peer-checked:border-primary peer-checked:bg-primary/10">
                      <span className="material-symbols-outlined text-on-surface-variant peer-checked:text-primary">person</span>
                      <span className="font-label-sm text-label-sm text-on-surface peer-checked:text-primary">User</span>
                    </div>
                  </label>
                  <label className="relative cursor-pointer group">
                    <input 
                      checked={role === 'admin'} 
                      onChange={() => setRole('admin')}
                      className="peer sr-only" 
                      name="role" 
                      type="radio" 
                      value="admin"
                    />
                    <div className="flex items-center gap-md p-md rounded-lg border border-outline-variant bg-surface-container-low transition-all duration-200 group-hover:bg-surface-variant peer-checked:border-primary peer-checked:bg-primary/10">
                      <span className="material-symbols-outlined text-on-surface-variant peer-checked:text-primary">admin_panel_settings</span>
                      <span className="font-label-sm text-label-sm text-on-surface peer-checked:text-primary">Admin</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="space-y-md">
                <div className="space-y-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="full_name">Full Name</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-md transition-colors group-focus-within:text-primary">badge</span>
                    <input 
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-11 pr-md py-md font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" 
                      id="full_name" 
                      placeholder="John Doe" 
                      required 
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="email">Work Email</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-md transition-colors group-focus-within:text-primary">mail</span>
                    <input 
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-11 pr-md py-md font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" 
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
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="password">Password</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-md transition-colors group-focus-within:text-primary">lock</span>
                    <input 
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-11 pr-md py-md font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" 
                      id="password" 
                      placeholder="••••••••" 
                      required 
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="pt-sm space-y-xs">
                    <div className="flex gap-sm">
                      {getStrengthBars()}
                    </div>
                    <span className={`font-label-sm text-label-sm ${strText.color}`}>{strText.text}</span>
                  </div>
                </div>

                <div className="space-y-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="confirm_password">Confirm Password</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline text-md transition-colors group-focus-within:text-primary">enhanced_encryption</span>
                    <input 
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg pl-11 pr-md py-md font-body-md text-body-md text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all" 
                      id="confirm_password" 
                      placeholder="••••••••" 
                      required 
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <div className="h-4">
                    {confirmPassword && (
                      password === confirmPassword 
                      ? <span className="text-xs text-primary flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">check</span> Passwords match</span>
                      : <span className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">close</span> Passwords do not match</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-md">
                <button 
                  className="w-full bg-primary text-on-primary font-body-md py-md rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-md disabled:opacity-50" 
                  disabled={loading}
                  type="submit"
                >
                  {loading ? (
                    <><span className="material-symbols-outlined animate-spin text-md">sync</span> Creating account...</>
                  ) : (
                    <>Complete Registration <span className="material-symbols-outlined text-md">arrow_forward</span></>
                  )}
                </button>
              </div>
              <p className="text-center font-body-sm text-body-sm text-on-surface-variant pt-md">
                  Already have an account? <Link className="text-primary hover:underline transition-all" to="/login">Sign In</Link>
              </p>
            </form>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-lg md:p-2xl flex flex-col items-center text-center transition-all duration-700">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-xl relative">
              <div className="absolute inset-[-8px] border-2 border-primary rounded-full animate-pulse-ring"></div>
              <span className="material-symbols-outlined text-primary text-5xl z-10">check_circle</span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">Registration Successful</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-2xl max-w-xs">Your enterprise account has been created. You can now access the management dashboard.</p>
            <Link className="w-full bg-primary text-on-primary font-body-md py-md rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98] transition-all flex items-center justify-center gap-md" to="/login">
              Go to Login
              <span className="material-symbols-outlined text-md">login</span>
            </Link>
            <div className="mt-xl pt-lg border-t border-outline-variant w-full">
              <p className="font-body-sm text-body-sm text-outline-variant">A confirmation email has been sent to your inbox.</p>
            </div>
          </div>
        )}

        <div className="mt-xl flex justify-center gap-xl">
          <a className="font-label-sm text-label-sm text-outline-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
          <a className="font-label-sm text-label-sm text-outline-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
        </div>
      </div>
    </div>
  );
};

export default Register;
