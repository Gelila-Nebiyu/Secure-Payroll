import React, { useState, useEffect, useRef, useCallback } from 'react';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import {
  ShieldCheck, Lock, Users, FileText, Clock, AlertTriangle,
  CheckCircle, BrainCircuit, Settings,
  Database, Activity, Server, LogOut, Key, Fingerprint,
  Moon, Sun, DollarSign, Plus, Trash2, Edit, AlertCircle, Mail, Download, FileSpreadsheet, LockKeyhole, Menu,
  Eye, EyeOff, Bell, ShieldQuestion, Calendar, Cpu, UserCheck
} from 'lucide-react';
import { mongo } from './services/mockDatabase';
import { evaluateAccess } from './services/accessControlService';
import { analyzeSecurityEvent } from './services/geminiService';
import { createSystemLog, createUserLog } from './services/loggingService';
import { createBackup } from './services/backupService';
import { loginUser, registerUser, verifyMfa, changePassword, toggleMfa, verifyEmail, assignUserRole, getAllUsers, deleteUser, initiatePasswordReset, resetPasswordWithOtp } from './services/authService';
import { User, Resource, AccessLog, SystemState, SensitivityLevel, LogSeverity, Backup, AuthSession, UserRole, Department, AccessRequest, RequestStatus } from './types';
import { validatePasswordStrength } from './services/cryptoService';

const HCAPTCHA_SITE_KEY = process.env.REACT_APP_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001";

export default function App() {
  // Always Light Mode
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Auth State
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authStage, setAuthStage] = useState<'LOGIN' | 'REGISTER' | 'MFA' | 'EMAIL_VERIFY' | 'FORGOT_PASS' | 'RESET_PASS'>('LOGIN');
  const [tempUser, setTempUser] = useState<User | null>(null);
 
  // App Logic State
  const [resources, setResources] = useState<Resource[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [accessRequests, setAccessRequests] = useState<AccessRequest[]>([]);
  const [accessLogs, setAccessLogs] = useState<AccessLog[]>([]);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  const [criticalAlerts, setCriticalAlerts] = useState<AccessLog[]>([]);
  const [view, setView] = useState<'files' | 'logs' | 'backups' | 'profile' | 'users' | 'finance' | 'admin_requests' | 'security_engine'>('files');
  
  // RuBAC Simulation State
  const [systemState, setSystemState] = useState<SystemState>({ 
    currentTime: new Date().getHours(), 
    isWeekend: false 
  });

  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [loadingAi, setLoadingAi] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSuccess, setAuthSuccess] = useState('');
  const [passStrength, setPassStrength] = useState<{valid: boolean, errors: string[]}>({valid: false, errors: []});
 
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<HCaptcha>(null);

  const [showAddResource, setShowAddResource] = useState(false);
  const [newRes, setNewRes] = useState({
    name: '', amount: 0, type: 'PAYROLL_RECORD' as any, content: '',
    sensitivity: SensitivityLevel.CONFIDENTIAL,
    baseSalary: 0, tax: 0, deductions: 0
  });

  const [confirmDialog, setConfirmDialog] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const refreshData = useCallback(async () => {
    const res = await mongo.resources.find({});
    setResources(res);
    if (session?.user.role === UserRole.ADMIN) {
      const users = await getAllUsers();
      setAllUsers(users);
      const reqs = await mongo.requests.find({ status: RequestStatus.PENDING });
      setAccessRequests(reqs);
    }
  }, [session]);

  useEffect(() => { refreshData(); }, [refreshData]);

  const clearAuthMessages = () => { setAuthError(''); setAuthSuccess(''); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthMessages();
    if (!captchaToken) { setAuthError('Complete captcha challenge.'); return; }
    const result = await loginUser(email, password);
    if (result.success) {
      if (result.mfaRequired && result.tempUser) { setTempUser(result.tempUser); setAuthStage('MFA'); }
      else if (result.session) completeLogin(result.session);
    } else setAuthError(result.error || 'Login failed');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthMessages();
    const result = await registerUser(fullName, email, password);
    if (result.success) { setAuthStage('EMAIL_VERIFY'); setAuthSuccess('Verify your email.'); }
    else setAuthError(result.error || 'Registration failed');
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (tempUser) {
      const result = await verifyMfa(tempUser, mfaCode);
      if (result.success && result.session) completeLogin(result.session);
      else setAuthError(result.error || 'Invalid code');
    }
  };

  const handleEmailVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyEmail(email, mfaCode);
    if (success) { setAuthStage('LOGIN'); setAuthSuccess('Verified! Login.'); }
  };

  const completeLogin = (newSession: AuthSession) => {
    setSession(newSession);
    setAccessLogs(prev => [createUserLog(newSession.user, 'LOGIN', undefined, undefined, true, 'User Logged In', 'AUTH', LogSeverity.INFO), ...prev]);
    setView(newSession.user.role === UserRole.FINANCE_MANAGER ? 'finance' : 'files');
  };

  const handleLogout = () => { setSession(null); setAuthStage('LOGIN'); };

  const handleAccessRequest = async (resource: Resource) => {
    if (!session) return;
    setSelectedResource(resource);
    setAiAnalysis("");
    const resultLog = evaluateAccess(session.user, resource, systemState);
    setAccessLogs(prev => [resultLog, ...prev]);
    if (process.env.API_KEY) {
        setLoadingAi(true);
        const analysis = await analyzeSecurityEvent(session.user, resource, resultLog, systemState);
        setAiAnalysis(analysis);
        setLoadingAi(false);
    } else setAiAnalysis("No API_KEY detected.");
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!session) return;
    const net = (newRes.baseSalary || 0) - (newRes.tax || 0) - (newRes.deductions || 0);
    const res: Resource = {
      _id: `r_${Date.now()}`,
      name: newRes.name,
      type: newRes.type,
      content: newRes.content,
      amount: net, baseSalary: newRes.baseSalary, tax: newRes.tax, deductions: newRes.deductions, netPay: net,
      status: 'PENDING', sensitivityLevel: newRes.sensitivity, department: session.user.department,
      ownerId: session.user._id, accessControlList: [session.user._id], dateCreated: new Date().toISOString()
    };
    await mongo.resources.insertOne(res);
    refreshData();
    setShowAddResource(false);
  };

  const handleDownloadFile = (resource: Resource) => {
      if (!session) return;
      const res = evaluateAccess(session.user, resource, systemState);
      setAccessLogs(prev => [res, ...prev]);
      if (!res.granted) { alert(`BLOCKED: ${res.denialReason}`); return; }
      const element = document.createElement("a");
      element.href = URL.createObjectURL(new Blob([resource.content], {type: 'text/plain'}));
      element.download = `${resource.name.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element); element.click();
  };

  const handleRoleChange = async (userId: string, newRole: UserRole, newDept: Department, newClearance: SensitivityLevel) => {
    if(!session) return;
    const res = await assignUserRole(session.user._id, userId, newRole, newDept, newClearance);
    if(res.success) refreshData();
  };

  const handleDeleteUser = async (userId: string) => {
    if (!session) return;
    setConfirmDialog({
      show: true, title: "Erase Identity", message: "Permanently delete this user from registry?",
      onConfirm: async () => { await deleteUser(session.user._id, userId); refreshData(); setConfirmDialog(null); }
    });
  };

  const handleApproveRequest = async (req: AccessRequest) => {
    if (!session || session.user.role !== UserRole.ADMIN) return;
    await mongo.requests.updateOne({ id: req.id }, { status: RequestStatus.APPROVED });
    const resource = await mongo.resources.findOne({ _id: req.resourceId });
    if (resource && !resource.accessControlList.includes(req.userId)) {
        await mongo.resources.updateOne({ _id: req.resourceId }, { accessControlList: [...resource.accessControlList, req.userId] });
    }
    refreshData();
  };

  const handleRejectRequest = async (req: AccessRequest) => {
    if (!session || session.user.role !== UserRole.ADMIN) return;
    await mongo.requests.updateOne({ id: req.id }, { status: RequestStatus.REJECTED });
    refreshData();
  };

  const getVisibleResources = useCallback(() => {
    if (!session) return [];
    if (session.user.role === UserRole.ADMIN || session.user.role === UserRole.AUDITOR) return resources;
    return resources.filter(res => 
      res.sensitivityLevel === SensitivityLevel.PUBLIC || 
      res.department === session.user.department ||
      res.ownerId === session.user._id ||
      res.accessControlList.includes(session.user._id)
    );
  }, [session, resources]);

  const handleExportCSV = () => {
    const header = ['Name,Base,Tax,Net\n'];
    const rows = resources.filter(r => r.type === 'PAYROLL_RECORD').map(r => `${r.name},${r.baseSalary},${r.tax},${r.netPay}`);
    const blob = new Blob([header.concat(rows).join('\n')], { type: 'text/csv' });
    const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = "ledger.csv"; link.click();
  };

  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [profileMsg, setProfileMsg] = useState('');

  const handleChangePass = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await changePassword(session!.user._id, oldPass, newPass);
    setProfileMsg(res.success ? 'Identity updated.' : 'Error: ' + res.error);
    setOldPass(''); setNewPass('');
  };

  const handleToggleMfa = async () => {
    const updated = await toggleMfa(session!.user._id, !session!.user.mfaEnabled);
    if (updated) setSession({...session!, user: updated});
  };

  const RuBACRuleCard = ({ title, description, isActive, icon: Icon }: any) => (
    <div className={`p-6 rounded-[2.5rem] border flex items-start gap-5 transition-all ${isActive ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
      <div className={`p-4 rounded-2xl ${isActive ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}><Icon size={24} /></div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h5 className="font-bold text-xs uppercase tracking-widest text-slate-800">{title}</h5>
          <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${isActive ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>{isActive ? 'Blocking' : 'Operational'}</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">{description}</p>
      </div>
    </div>
  );

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 text-slate-900">
        <div className="max-w-md w-full p-10 rounded-[3.5rem] shadow-xl border bg-white border-slate-200">
          <div className="flex flex-col items-center mb-10">
            <ShieldCheck className="w-16 h-16 text-emerald-600 mb-4" />
            <h1 className="text-3xl font-black tracking-tighter">SENTINEL</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Light Mode Authorization</p>
          </div>

          {authError && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-6 text-xs font-bold text-center">{authError}</div>}
          {authSuccess && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl mb-6 text-xs font-bold text-center">{authSuccess}</div>}

          {authStage === 'LOGIN' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder-slate-400" placeholder="admin@sentinel.com" />
              <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 placeholder-slate-400" placeholder="admin123" />
              <div className="flex justify-center mb-4"><HCaptcha sitekey={HCAPTCHA_SITE_KEY} onVerify={setCaptchaToken} ref={captchaRef} /></div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg transition-all uppercase tracking-widest text-xs">Authorize Access</button>
              <div className="text-center mt-4"><button type="button" onClick={() => setAuthStage('REGISTER')} className="text-xs font-bold text-emerald-600 hover:underline">Register New Vector</button></div>
            </form>
          )}

          {authStage === 'MFA' && (
             <form onSubmit={handleMfaVerify} className="space-y-6 text-center">
                <Fingerprint className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Identity Verification</h3>
                <p className="text-xs text-slate-500">Check browser console for simulation code.</p>
                <input required type="text" value={mfaCode} onChange={e => setMfaCode(e.target.value)} className="w-full text-center text-3xl font-black bg-slate-50 border border-slate-300 p-6 rounded-[2rem] outline-none text-slate-900 tracking-[0.5em] focus:border-emerald-500" placeholder="000000" />
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl shadow-lg uppercase tracking-widest text-xs">Commit Verify</button>
                <button type="button" onClick={() => setAuthStage('LOGIN')} className="text-xs font-bold text-slate-400 hover:text-slate-600">Abort & Reset</button>
             </form>
          )}

          {authStage === 'EMAIL_VERIFY' && (
            <form onSubmit={handleEmailVerify} className="space-y-6 text-center">
              <Mail className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <h3 className="text-lg font-black text-slate-800">Verify Registry</h3>
              <input required type="text" value={mfaCode} onChange={e => setMfaCode(e.target.value)} className="w-full text-center text-xl font-black bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900" placeholder="0000" />
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest">Verify Email</button>
            </form>
          )}
          
          <div className="mt-10 text-center text-[10px] text-slate-400 font-mono tracking-tighter opacity-50 uppercase">DB: MONGODB_PERSISTENT_SIM // LIGHT_ONLY</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      <aside className="w-72 border-r bg-white border-slate-200 flex flex-col p-8 space-y-10 h-screen sticky top-0">
        <div className="flex items-center gap-3 text-emerald-600"><ShieldCheck className="w-8 h-8" /><h1 className="text-2xl font-black tracking-tighter">SENTINEL</h1></div>
        
        <nav className="flex-1 space-y-2">
          {[
            { id: 'security_engine', label: 'Security Engine', icon: ShieldQuestion },
            { id: 'finance', label: 'Finance Hub', icon: DollarSign, role: [UserRole.ADMIN, UserRole.FINANCE_MANAGER] },
            { id: 'files', label: 'Payroll Vault', icon: LockKeyhole },
            { id: 'admin_requests', label: 'Access Control', icon: Bell, role: [UserRole.ADMIN] },
            { id: 'logs', label: 'Audit Forensics', icon: Activity },
            { id: 'users', label: 'Identity Matrix', icon: Users, role: [UserRole.ADMIN] },
            { id: 'backups', label: 'Persistence', icon: Database },
            { id: 'profile', label: 'Identity Config', icon: Settings }
          ].map(item => (!item.role || item.role.includes(session.user.role)) && (
            <button key={item.id} onClick={() => setView(item.id as any)} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${view === item.id ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-100'}`}>
              <item.icon size={18} /> {item.label}
              {item.id === 'admin_requests' && accessRequests.length > 0 && <span className="bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full ml-auto">{accessRequests.length}</span>}
            </button>
          ))}
        </nav>

        <div className="pt-8 border-t border-slate-200 flex flex-col gap-4">
           <div className="flex items-center gap-4 overflow-hidden">
             <img src={session.user.avatar} className="w-10 h-10 rounded-full border-2 border-emerald-600" />
             <div className="truncate text-[10px] font-black uppercase text-slate-800">{session.user.name}</div>
           </div>
           <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all">Sign Out</button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-20 border-b bg-white border-slate-200 flex items-center justify-between px-10 shrink-0">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">{view.replace('_', ' ')}</h2>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-[10px] font-mono text-slate-600 shadow-inner">
               <span className="flex items-center gap-2"><Clock size={12}/> {systemState.currentTime}:00</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span className={`font-bold ${systemState.isWeekend ? 'text-red-600' : 'text-emerald-600'}`}>{systemState.isWeekend ? 'WEEKEND LOCK' : 'OPERATIONAL'}</span>
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-10 bg-slate-50">
          
          {view === 'security_engine' && (
            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-500">
               <div className="bg-emerald-600 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden">
                  <Cpu className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10" />
                  <h3 className="text-4xl font-black tracking-tighter mb-4">RuBAC <span className="opacity-60">Control Panel</span></h3>
                  <p className="text-sm font-medium opacity-80 max-w-lg">Modify environmental state to test Rule-Based Access Policies.</p>
               </div>

               <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-10 rounded-[3rem] border bg-white border-slate-200 shadow-sm">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2"><Settings size={14}/> Operational Day</h4>
                    <div className="flex gap-4">
                       <button onClick={() => setSystemState({...systemState, isWeekend: false})} className={`flex-1 py-4 rounded-2xl font-black text-[11px] border transition-all ${!systemState.isWeekend ? 'bg-emerald-600 border-emerald-500 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>WEEKDAY</button>
                       <button onClick={() => setSystemState({...systemState, isWeekend: true})} className={`flex-1 py-4 rounded-2xl font-black text-[11px] border transition-all ${systemState.isWeekend ? 'bg-red-600 border-red-500 text-white shadow-md' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>WEEKEND</button>
                    </div>
                  </div>

                  <div className="p-10 rounded-[3rem] border bg-white border-slate-200 shadow-sm">
                    <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 flex items-center gap-2"><Clock size={14}/> Global Curfew</h4>
                    <input type="range" min="0" max="23" value={systemState.currentTime} onChange={e => setSystemState({...systemState, currentTime: parseInt(e.target.value)})} className="w-full accent-emerald-600 mb-4 h-2 rounded-lg" />
                    <div className="flex justify-between font-mono text-[10px] text-slate-600"><span>00:00</span><span className="text-xl font-black text-emerald-600">{systemState.currentTime}:00</span><span>23:00</span></div>
                  </div>
               </section>

               <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <RuBACRuleCard title="Working Hours Curfew" description="Blocks sensitive data outside 08:00 - 20:00." icon={Clock} isActive={systemState.currentTime < 8 || systemState.currentTime > 20} />
                  <RuBACRuleCard title="Weekend Lockdown" description="Environmental block for sensitive records on Saturdays/Sundays." icon={Calendar} isActive={systemState.isWeekend} />
               </section>
            </div>
          )}

          {view === 'files' && (
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
               <div className="flex-1 space-y-8 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center">
                    <h3 className="text-3xl font-black text-slate-800">Secure <span className="text-emerald-600">Vault</span></h3>
                    {session.user.role !== UserRole.EMPLOYEE && (
                        <button onClick={() => setShowAddResource(true)} className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black text-[11px] tracking-widest uppercase shadow-md hover:bg-emerald-700 transition-all"><Plus size={16}/> New Entry</button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {getVisibleResources().map(res => (
                      <div key={res._id} onClick={() => handleAccessRequest(res)} className={`p-8 rounded-[2.5rem] border cursor-pointer transition-all hover:scale-[1.02] ${selectedResource?._id === res._id ? 'border-emerald-600 bg-emerald-50 ring-4 ring-emerald-500/5' : 'bg-white border-slate-200 shadow-sm'}`}>
                         <div className="flex justify-between items-start mb-8">
                            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600"><LockKeyhole size={24}/></div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-[9px] font-black px-4 py-1.5 rounded-full uppercase border bg-slate-900 border-slate-700 text-slate-100">LVL: {SensitivityLevel[res.sensitivityLevel]}</span>
                                {/* DAC Badge Implementation */}
                                {res.ownerId === session.user._id ? (
                                    <span className="flex items-center gap-1 text-[8px] font-black uppercase text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full"><UserCheck size={10}/> DAC: Owner</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-[8px] font-black uppercase text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full"><Users size={10}/> DAC: ACL Access</span>
                                )}
                            </div>
                         </div>
                         <h4 className="font-black text-lg mb-1 text-slate-800">{res.name}</h4>
                         <p className="text-[10px] text-slate-400 font-mono mb-8 uppercase tracking-widest">{res.type} // {res.department}</p>
                         <div className="flex gap-3">
                            <button className="flex-1 py-3 bg-slate-100 border border-slate-200 rounded-2xl text-[9px] font-black uppercase text-slate-500">Audit Info</button>
                            <button onClick={e => {e.stopPropagation(); handleDownloadFile(res);}} className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 shadow-md"><Download size={16}/></button>
                         </div>
                      </div>
                    ))}
                  </div>
               </div>

               <aside className="w-full lg:w-[420px] shrink-0">
                  {selectedResource ? (
                    <div className="sticky top-10 space-y-6 animate-in slide-in-from-right-5">
                       <div className={`p-10 rounded-[3.5rem] border shadow-xl ${accessLogs[0]?.granted ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                          <div className="flex justify-between items-center mb-8">
                             <h3 className="text-xl font-black uppercase tracking-tighter text-slate-800">Policy Verdict</h3>
                             <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase ${accessLogs[0]?.granted ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>{accessLogs[0]?.granted ? 'Passed' : 'Blocked'}</div>
                          </div>
                          <div className="space-y-6">
                             <div className="flex justify-between text-[10px] font-black uppercase text-slate-500"><span>Trigger Layer</span><span className="text-emerald-600">{accessLogs[0]?.policyTypeTriggered}</span></div>
                             <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-inner"><p className="text-xs italic text-slate-500 leading-relaxed font-mono">"{accessLogs[0]?.denialReason}"</p></div>
                          </div>
                          {accessLogs[0]?.granted && (
                             <div className="mt-10 pt-10 border-t border-slate-200">
                                <p className="text-[10px] font-black uppercase text-slate-400 mb-4 tracking-widest">Decrypted Data</p>
                                <div className="bg-white border border-slate-200 p-6 rounded-3xl font-mono text-[11px] text-slate-700 leading-relaxed">{selectedResource.content}</div>
                             </div>
                          )}
                       </div>
                       <div className="p-8 rounded-[2.5rem] border bg-white border-slate-200 shadow-md">
                          <div className="flex items-center gap-3 mb-4 text-emerald-600 font-black text-[10px] uppercase tracking-widest"><BrainCircuit size={18}/><span>AI Auditor Neural Reasoning</span></div>
                          <div className="text-[11px] leading-relaxed text-slate-600 italic">{loadingAi ? <div className="h-4 bg-slate-100 rounded-full animate-pulse w-full"></div> : aiAnalysis || "Awaiting evaluation trigger..."}</div>
                       </div>
                    </div>
                  ) : <div className="h-64 border-2 border-dashed border-slate-300 rounded-[3rem] flex flex-col items-center justify-center text-slate-400 font-black uppercase text-xs gap-3 bg-white"><ShieldQuestion size={32}/> Select Record to Evaluate</div>}
               </aside>
            </div>
          )}

          {view === 'users' && session.user.role === UserRole.ADMIN && (
             <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="p-8 rounded-[3rem] border bg-white border-slate-200 overflow-hidden shadow-sm">
                  <table className="w-full text-left text-xs font-medium">
                    <thead className="bg-slate-50 text-slate-400 font-black uppercase tracking-widest border-b border-slate-200">
                      <tr><th className="p-8">Identity</th><th className="p-8">RBAC Role</th><th className="p-8">ABAC Dept</th><th className="p-8">MAC Clearance</th><th className="p-8">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-600">
                      {allUsers.map(u => (
                        <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                           <td className="p-8 font-bold text-slate-800">{u.name}</td>
                           <td className="p-8">
                             <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value as UserRole, u.department, u.clearanceLevel)} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] uppercase font-black outline-none">
                                {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
                             </select>
                           </td>
                           <td className="p-8">
                             <select value={u.department} onChange={(e) => handleRoleChange(u._id, u.role, e.target.value as Department, u.clearanceLevel)} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] uppercase font-black outline-none">
                                {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                             </select>
                           </td>
                           <td className="p-8">
                             <select value={u.clearanceLevel} onChange={(e) => handleRoleChange(u._id, u.role, u.department, parseInt(e.target.value) as SensitivityLevel)} className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-[10px] uppercase font-black outline-none">
                                {Object.entries(SensitivityLevel).filter(([k, v]) => isNaN(Number(k))).map(([k, v]) => <option key={v} value={v}>{k}</option>)}
                             </select>
                           </td>
                           <td className="p-8">
                             {u._id !== session.user._id && <button onClick={() => handleDeleteUser(u._id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={16}/></button>}
                           </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          )}

          {view === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
              {profileMsg && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl text-sm font-bold">{profileMsg}</div>}
              
              <div className="p-8 rounded-[3rem] border bg-white border-slate-200 shadow-md">
                <h3 className="text-xl font-black mb-10 flex items-center gap-3 text-slate-800"><Settings size={24}/> Identity Vectors</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Registry Credentials</h4>
                    <form onSubmit={handleChangePass} className="space-y-4">
                      <input type="password" placeholder="Existing Secret" value={oldPass} onChange={e => setOldPass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900" />
                      <input type="password" placeholder="New Neural Key" value={newPass} onChange={e => setNewPass(e.target.value)} className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-slate-900" />
                      <button type="submit" className="w-full px-6 py-4 bg-slate-800 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-md">Update Credentials</button>
                    </form>
                  </div>
                  
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-4">Access Characteristics</h4>
                    
                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                       <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">MAC CLEARANCE LEVEL</p>
                         <p className="text-sm font-black text-slate-800">{SensitivityLevel[session.user.clearanceLevel]}</p>
                       </div>
                       <div className={`p-3 rounded-xl bg-white border ${session.user.clearanceLevel === SensitivityLevel.TOP_SECRET ? 'text-red-600 border-red-100' : 'text-emerald-600 border-emerald-100'}`}><ShieldCheck size={20}/></div>
                    </div>

                    <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                       <div>
                         <p className="text-[9px] font-black text-slate-400 uppercase mb-1">MFA STATE</p>
                         <p className="text-sm font-black text-slate-800">{session.user.mfaEnabled ? 'OPERATIONAL' : 'DISABLED'}</p>
                       </div>
                       <button onClick={handleToggleMfa} className={`px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest ${session.user.mfaEnabled ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                        {session.user.mfaEnabled ? 'OFF' : 'ON'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'backups' && (
            <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
              <h3 className="text-3xl font-black mb-8 text-slate-800">Persistence <span className="text-emerald-600">Registry</span></h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {backups.map(bk => (
                  <div key={bk.id} className="p-8 rounded-[2.5rem] border bg-white border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <Database className="w-8 h-8 text-emerald-600" />
                      <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-slate-100 text-slate-500">{bk.type}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{new Date(bk.timestamp).toLocaleString()}</p>
                    <p className="text-lg font-black mt-2 text-slate-800">{bk.totalRecords} Records Verified</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {view === 'finance' && (
             <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                  <h3 className="text-3xl font-black text-slate-800">Finance <span className="text-emerald-600">Hub</span></h3>
                  <button onClick={handleExportCSV} className="flex items-center gap-3 bg-slate-800 text-white px-6 py-3 rounded-2xl font-black text-[11px] tracking-widest uppercase shadow-md"><FileSpreadsheet size={16}/> Export Ledger</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Gross Liability', val: resources.filter(r => r.type === 'PAYROLL_RECORD').reduce((acc, r) => acc + (r.baseSalary || 0), 0), color: 'text-slate-800' },
                    { label: 'Tax Liabilities', val: resources.filter(r => r.type === 'PAYROLL_RECORD').reduce((acc, r) => acc + (r.tax || 0), 0), color: 'text-red-600' },
                    { label: 'Net Liquidity', val: resources.filter(r => r.type === 'PAYROLL_RECORD').reduce((acc, r) => acc + (r.netPay || 0), 0), color: 'text-emerald-600' }
                  ].map(stat => (
                    <div key={stat.label} className="p-8 rounded-[2.5rem] border bg-white border-slate-200 shadow-sm">
                       <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2">{stat.label}</h4>
                       <p className={`text-2xl font-black ${stat.color}`}>${stat.val.toLocaleString()}</p>
                    </div>
                  ))}
                  <button onClick={() => setShowAddResource(true)} className="p-8 rounded-[2.5rem] border-2 border-dashed border-emerald-400 flex flex-col items-center justify-center text-emerald-600 font-black uppercase text-[11px] gap-2 bg-white hover:bg-emerald-50 transition-all"><Plus size={16}/> <span>Add Entry</span></button>
                </div>
             </div>
          )}
        </main>
      </div>

      {showAddResource && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-[100]">
          <div className="w-full max-w-xl p-12 rounded-[4rem] shadow-2xl border bg-white border-slate-200">
            <h3 className="text-3xl font-black mb-10 tracking-tighter text-slate-800">Vault <span className="text-emerald-600">Genesis</span></h3>
            <form onSubmit={handleAddResource} className="space-y-6">
               <input required value={newRes.name} onChange={e => setNewRes({...newRes, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-5 rounded-[2rem] text-slate-900 outline-none" placeholder="Resource Name" />
               <div className="grid grid-cols-2 gap-6">
                  <select value={newRes.sensitivity} onChange={e => setNewRes({...newRes, sensitivity: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-5 rounded-[2rem] text-slate-900 outline-none">
                    <option value={SensitivityLevel.INTERNAL}>Internal</option>
                    <option value={SensitivityLevel.CONFIDENTIAL}>Confidential</option>
                    <option value={SensitivityLevel.TOP_SECRET}>Top Secret</option>
                  </select>
                  <input type="number" placeholder="Gross Value" value={newRes.baseSalary} onChange={e => setNewRes({...newRes, baseSalary: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 p-5 rounded-[2rem] text-slate-900 outline-none" />
               </div>
               <textarea required value={newRes.content} onChange={e => setNewRes({...newRes, content: e.target.value})} className="w-full bg-slate-50 border border-slate-200 p-5 rounded-[2rem] text-slate-900 outline-none h-40" placeholder="Encrypted payload contents..." />
               <div className="flex gap-6 pt-6">
                 <button type="button" onClick={() => setShowAddResource(false)} className="flex-1 py-5 border border-slate-200 rounded-[2rem] font-black uppercase text-xs text-slate-400">Abort</button>
                 <button type="submit" className="flex-1 py-5 bg-emerald-600 rounded-[2rem] text-white font-black uppercase text-xs shadow-lg shadow-emerald-200">Commit to DB</button>
               </div>
            </form>
          </div>
        </div>
      )}

      {confirmDialog && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 z-[200]">
          <div className="w-full max-w-md p-10 rounded-[3.5rem] border bg-white border-slate-200 shadow-2xl">
            <h4 className="text-2xl font-black mb-4 tracking-tighter uppercase text-slate-800">{confirmDialog.title}</h4>
            <p className="text-slate-500 text-sm mb-10 italic">"{confirmDialog.message}"</p>
            <div className="flex gap-4">
              <button onClick={() => setConfirmDialog(null)} className="flex-1 py-4 border border-slate-200 rounded-2xl font-black uppercase text-xs text-slate-400">Cancel</button>
              <button onClick={confirmDialog.onConfirm} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg shadow-red-200">Confirm Erase</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
