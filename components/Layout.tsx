
import React from 'react';
import { Role } from '../types';
import { 
  LayoutDashboard, 
  UserCircle, 
  Briefcase, 
  FileText, 
  Settings, 
  LogOut, 
  Moon, 
  Sun,
  MonitorCheck,
  Building2,
  Users,
  PlusCircle,
  TrendingUp,
  MessageSquare,
  Award,
  Sparkles
} from 'lucide-react';

interface LayoutProps {
  role: Role;
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ role, children, activeTab, setActiveTab, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#050505';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [isDarkMode]);

  const studentNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'drives', label: 'Placement Drives', icon: Briefcase },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'mock', label: 'Mock Interviews', icon: Award },
    { id: 'prep', label: 'Prep Hub', icon: Sparkles },
    { id: 'simulator', label: 'Eligibility Sim', icon: MonitorCheck },
  ];

  const companyNav = [
    { id: 'dashboard', label: 'Overview', icon: TrendingUp },
    { id: 'create', label: 'Create Drive', icon: PlusCircle },
    { id: 'applicants', label: 'Applicants', icon: Users },
    { id: 'manage', label: 'Round Management', icon: Settings },
  ];

  const navItems = role === Role.STUDENT ? studentNav : companyNav;

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f8fafc] text-slate-900'} transition-colors duration-500`}>
      {/* Sidebar */}
      <aside className={`w-72 border-r flex flex-col fixed inset-y-0 left-0 glass z-50 transition-colors duration-500 ${isDarkMode ? 'border-white/5' : 'border-slate-200'}`}>
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Briefcase size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight font-heading">NexusHire</span>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-violet-500/10 text-cyan-400 border border-cyan-500/20 shadow-inner shadow-cyan-500/5' 
                  : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-cyan-400' : 'group-hover:text-cyan-400'} />
                <span className="font-medium text-[14px] tracking-tight">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/5 space-y-4">
          <div className={`p-4 rounded-2xl border transition-colors ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
             <div className="flex items-center gap-3 mb-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <UserCircle size={18} className={isDarkMode ? 'text-slate-400' : 'text-slate-600'} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{role}</p>
                  <p className="text-sm font-bold truncate">{role === Role.STUDENT ? 'Aiden Vance' : 'Admin @ Stellar'}</p>
                </div>
             </div>
             <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all text-xs font-black uppercase tracking-widest ${
                isDarkMode ? 'bg-white/5 hover:bg-white/10 text-white/60' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
              }`}
             >
              {isDarkMode ? <Sun size={14} /> : <Moon size={14} />}
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
             </button>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors font-bold text-sm tracking-tight"
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72 flex-1 relative overflow-y-auto min-h-screen">
        <div className={`absolute top-0 left-0 w-full h-64 pointer-events-none transition-colors duration-500 ${isDarkMode ? 'bg-gradient-to-b from-cyan-500/10 to-transparent' : 'bg-gradient-to-b from-cyan-500/5 to-transparent'}`} />
        <div className="p-10 relative z-10">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
