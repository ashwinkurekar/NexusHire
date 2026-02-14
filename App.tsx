
import React, { useState, useEffect } from 'react';
import { Role, StudentProfile, PlacementDrive, Application, ApplicationStatus } from './types';
import { DUMMY_STUDENT, DUMMY_DRIVES } from './constants';
import Layout from './components/Layout';
import StudentDashboard from './views/StudentDashboard';
import PlacementDrives from './views/PlacementDrives';
import MyApplications from './views/MyApplications';
import EligibilitySimulator from './views/EligibilitySimulator';
import StudentProfileView from './views/StudentProfile';
import MockInterview from './views/MockInterview';
import PreparationHub from './views/PreparationHub';
import CompanyDashboard from './views/CompanyDashboard';
import CompanyApplicants from './views/CompanyApplicants';
import CreateDriveView from './views/CreateDrive';
import RoundManagementView from './views/RoundManagement';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role>(Role.STUDENT);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Central State
  const [studentProfile, setStudentProfile] = useState<StudentProfile>(DUMMY_STUDENT);
  const [drives, setDrives] = useState<PlacementDrive[]>(DUMMY_DRIVES);
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'app-1',
      studentId: 's1',
      driveId: 'd1',
      status: ApplicationStatus.ROUND2,
      appliedDate: '2024-11-20',
      lastUpdated: '2024-11-22'
    },
    {
      id: 'app-2',
      studentId: 's1',
      driveId: 'd2',
      status: ApplicationStatus.SHORTLISTED,
      appliedDate: '2024-11-25',
      lastUpdated: '2024-11-25'
    }
  ]);

  const handleLogin = (selectedRole: Role) => {
    setRole(selectedRole);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const applyToDrive = (driveId: string) => {
    if (applications.some(app => app.driveId === driveId)) return;
    
    const newApp: Application = {
      id: `app-${Date.now()}`,
      studentId: studentProfile.id,
      driveId: driveId,
      status: ApplicationStatus.APPLIED,
      appliedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0]
    };
    setApplications([...applications, newApp]);
  };

  const addDrive = (newDrive: PlacementDrive) => {
    setDrives([newDrive, ...drives]);
    setActiveTab('dashboard');
  };

  const updateApplicationStatus = (appId: string, newStatus: ApplicationStatus) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status: newStatus, lastUpdated: new Date().toISOString().split('T')[0] } : app
    ));
  };

  const renderContent = () => {
    if (role === Role.STUDENT) {
      switch (activeTab) {
        case 'dashboard': return <StudentDashboard profile={studentProfile} applications={applications} />;
        case 'drives': return (
          <PlacementDrives 
            drives={drives} 
            studentProfile={studentProfile} 
            applications={applications}
            onApply={applyToDrive}
          />
        );
        case 'applications': return <MyApplications applications={applications} drives={drives} />;
        case 'mock': return <MockInterview profile={studentProfile} drives={drives} />;
        case 'prep': return <PreparationHub profile={studentProfile} />;
        case 'simulator': return <EligibilitySimulator profile={studentProfile} drives={drives} />;
        case 'profile': return <StudentProfileView profile={studentProfile} onUpdate={setStudentProfile} />;
        default: return <StudentDashboard profile={studentProfile} applications={applications} />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <CompanyDashboard drives={drives} applications={applications} />;
        case 'applicants': return (
          <CompanyApplicants 
            drives={drives} 
            applications={applications} 
            onUpdateStatus={updateApplicationStatus} 
          />
        );
        case 'create': return <CreateDriveView onDriveCreated={addDrive} />;
        case 'manage': return (
          <RoundManagementView 
            applications={applications} 
            drives={drives} 
            onUpdateStatus={updateApplicationStatus} 
          />
        );
        default: return <CompanyDashboard drives={drives} applications={applications} />;
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full animate-pulse delay-1000" />
        
        <div className="w-full max-w-xl glass rounded-[48px] p-12 relative z-10 border border-white/5 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-10">
            <div className="w-24 h-24 rounded-[32px] bg-gradient-to-tr from-cyan-500 to-violet-600 flex items-center justify-center shadow-2xl shadow-cyan-500/30">
               <div className="w-10 h-10 border-[6px] border-white rounded-xl flex items-center justify-center">
                 <div className="w-3 h-3 bg-white rounded-full" />
               </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-6xl font-black font-heading tracking-tighter">Nexus<span className="text-white/20">Hire</span></h1>
              <p className="text-white/40 font-medium max-w-sm mx-auto leading-relaxed">The unified interface for campus placement transparency, eligibility simulation, and hiring intelligence.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
               <button 
                onClick={() => handleLogin(Role.STUDENT)}
                className="group relative p-10 rounded-[40px] glass hover:bg-white transition-all duration-700 border border-white/5 overflow-hidden flex flex-col items-start gap-6"
               >
                 <div className="relative z-10 w-14 h-14 rounded-2xl bg-cyan-500/10 group-hover:bg-cyan-500 transition-colors flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-cyan-400 group-hover:border-white rounded" />
                 </div>
                 <div className="relative z-10 text-left">
                   <p className="text-2xl font-black group-hover:text-slate-900 transition-colors tracking-tight">Candidate</p>
                   <p className="text-xs text-white/40 group-hover:text-slate-500 transition-colors font-bold uppercase tracking-widest mt-1">Join the Talent Pool</p>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </button>

               <button 
                onClick={() => handleLogin(Role.COMPANY)}
                className="group relative p-10 rounded-[40px] glass hover:bg-white transition-all duration-700 border border-white/5 overflow-hidden flex flex-col items-start gap-6"
               >
                 <div className="relative z-10 w-14 h-14 rounded-2xl bg-violet-600/10 group-hover:bg-violet-600 transition-colors flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-violet-400 group-hover:border-white rounded-full" />
                 </div>
                 <div className="relative z-10 text-left">
                   <p className="text-2xl font-black group-hover:text-slate-900 transition-colors tracking-tight">Organization</p>
                   <p className="text-xs text-white/40 group-hover:text-slate-500 transition-colors font-bold uppercase tracking-widest mt-1">Launch your Drive</p>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </button>
            </div>

            <div className="pt-8 flex flex-col items-center gap-2">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/10">NextGen Placement Engine v2.5</p>
              <div className="flex gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,1)]" />
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                 <div className="w-1.5 h-1.5 rounded-full bg-violet-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      role={role} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
