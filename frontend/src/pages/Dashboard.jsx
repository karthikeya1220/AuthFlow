import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks based on role
    const fetchTasks = async () => {
      try {
        const url = user.role === 'ADMIN' ? '/tasks/all' : '/tasks';
        const res = await api.get(url);
        setTasks(res.data.tasks || []);
      } catch (err) {
        console.error('Failed to fetch tasks', err);
      }
    };
    fetchTasks();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="font-body-md text-body-md overflow-x-hidden min-h-screen bg-background text-on-background">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-screen w-64 py-md px-sm bg-surface-container-low border-r border-outline-variant z-50">
        <div className="flex items-center gap-md px-md mb-xl">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary-container" style={{ fontVariationSettings: "'FILL' 1" }}>security</span>
          </div>
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary leading-none">PrimeAuth</h1>
            <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70">Enterprise Auth</p>
          </div>
        </div>
        <nav className="flex-1 space-y-sm">
          <Link to="/dashboard" className="flex items-center gap-md px-md py-sm bg-primary-container text-on-primary-container rounded-lg active:translate-x-1 transition-transform">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label-sm text-label-sm">Dashboard</span>
          </Link>
          {user.role === 'ADMIN' && (
            <Link to="/dashboard" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all duration-200">
              <span className="material-symbols-outlined">group</span>
              <span className="font-label-sm text-label-sm">User Management</span>
            </Link>
          )}
          <Link to="/dashboard" className="flex items-center gap-md px-md py-sm text-on-surface-variant hover:bg-surface-variant/50 rounded-lg transition-all duration-200">
            <span className="material-symbols-outlined">assignment</span>
            <span className="font-label-sm text-label-sm">Entity Tasks</span>
          </Link>
        </nav>
        
        <div className="mt-auto px-md py-md space-y-xs">
          <button onClick={handleLogout} className="flex items-center gap-md text-error hover:brightness-125 transition-colors py-xs w-full text-left">
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span className="font-label-sm text-label-sm">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="h-16 px-lg flex items-center justify-between fixed top-0 right-0 left-0 lg:left-64 bg-surface/80 backdrop-blur-md border-b border-outline-variant z-40">
          <div className="flex items-center gap-md max-w-xl w-full">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="w-full bg-surface-container-low border-outline-variant rounded-full pl-10 pr-4 py-sm text-body-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Search resources, users, or API logs..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <div className="flex items-center gap-sm cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="font-label-sm text-label-sm leading-none">{user.name}</p>
                <p className="text-[10px] text-on-surface-variant">{user.role}</p>
              </div>
              <div className="w-8 h-8 rounded-full border border-outline-variant group-hover:border-primary transition-colors flex items-center justify-center bg-primary text-on-primary font-bold">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Canvas */}
        <div className="mt-16 p-lg flex-1 max-w-container-max mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Platform Overview</h2>
              <p className="text-on-surface-variant font-body-md">Your task dashboard and statistics.</p>
            </div>
            <div className="flex gap-sm">
              <button className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-sm hover:brightness-110 transition-all flex items-center gap-xs shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                New Task
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-lg mb-xl">
            <div className="glass-card p-lg rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-on-surface-variant font-label-sm uppercase tracking-wider">Total Tasks</p>
                  <h3 className="text-display-md font-display-md">{tasks.length}</h3>
                </div>
                <div className="p-sm bg-primary/10 rounded-lg text-primary">
                  <span className="material-symbols-outlined">assignment</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed / Tasks List */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            <div className="lg:col-span-2 glass-card rounded-xl flex flex-col overflow-hidden">
              <div className="p-lg border-b border-outline-variant flex items-center justify-between">
                <h4 className="font-headline-md text-headline-md">Your Tasks</h4>
              </div>
              <div className="flex-1">
                <div className="divide-y divide-outline-variant/30">
                  {tasks.length === 0 ? (
                    <div className="p-lg text-on-surface-variant text-center">No tasks found.</div>
                  ) : (
                    tasks.map(task => (
                      <div key={task.id} className="p-lg flex items-start gap-md hover:bg-surface-variant/20 transition-colors">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-secondary/10 text-secondary'
                        }`}>
                          <span className="material-symbols-outlined text-[20px]">
                            {task.status === 'COMPLETED' ? 'task_alt' : 'assignment'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-body-md"><span className="font-semibold">{task.title}</span></p>
                          <p className="text-on-surface-variant text-body-sm mt-xs">Priority: <span className="text-primary">{task.priority}</span> • Status: {task.status}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
