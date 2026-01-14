// Case selection and upload logic
import React from 'react';
import { Pencil, Plus, FileText, Trash2 } from 'lucide-react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
// Case selection and upload logic
const CasesSection: React.FC<{ cases: any[] }> = ({ cases }) => {
  const [selectedCaseId, setSelectedCaseId] = React.useState<string | null>(null);
  const [uploads, setUploads] = React.useState<{ [key: string]: Array<{name: string, uploadedBy: 'client' | 'attorney', date: string}> }>({});
  const fileInputRefs = React.useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileUpload = (caseId: string, files: FileList | null) => {
    if (!files) return;
    const validDocs = Array.from(files).filter(f => f.type.startsWith('application/') || f.type === 'text/plain' || f.type.startsWith('image/'));
    const newFiles = validDocs.map(f => ({
      name: f.name,
      uploadedBy: 'client' as const,
      date: new Date().toISOString()
    }));
    setUploads(prev => ({
      ...prev,
      [caseId]: [...(prev[caseId] || []), ...newFiles]
    }));
    // You can add actual upload logic here (e.g., send to server)
  };

  const handleRemoveFile = (caseId: string, fileName: string) => {
    setUploads(prev => ({
      ...prev,
      [caseId]: (prev[caseId] || []).filter(f => f.name !== fileName)
    }));
  };

  const triggerFileInput = (caseId: string) => {
    fileInputRefs.current[caseId]?.click();
  };

  // Mock attorney uploads for demonstration
  // In a real app, this would come from backend/API
  const getAttorneyUploads = (caseId: string) => {
    // Return mock attorney files for demonstration
    return [
      { name: 'Case_Strategy.pdf', uploadedBy: 'attorney' as const, date: new Date(Date.now() - 86400000 * 2).toISOString() },
      { name: 'Court_Filing_123.pdf', uploadedBy: 'attorney' as const, date: new Date(Date.now() - 86400000).toISOString() },
    ];
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cases.map((c) => (
        <div key={c.id} className="bg-white/5 border border-white/10 p-4 rounded-lg">
          <button
            className={`w-full text-left focus:outline-none`}
            onClick={() => setSelectedCaseId(selectedCaseId === c.id ? null : c.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="text-lg font-medium text-white">{c.title}</div>
                <div className="text-sm text-white/60 mt-1">Status: <span className="text-white">{c.status}</span></div>
              </div>
              <div className="text-sm text-white/40">{new Date(c.createdAt).toLocaleString()}</div>
            </div>
          </button>
          {selectedCaseId === c.id && (
            <div className="mt-4 p-3 rounded bg-black/60 border border-white/10">
              <div className="text-white text-base font-semibold mb-2">Case Details</div>
              <div className="text-white/80 text-sm mb-2">Case ID: {c.id}</div>
              <div className="text-white/80 text-sm mb-2">Created: {new Date(c.createdAt).toLocaleString()}</div>
              <div className="text-white/80 text-sm mb-2">Status: {c.status}</div>
              {/* Add more details as needed */}
              <div className="mt-4">
                <label className="block text-white/80 mb-3 font-medium">Your Documents:</label>
                <div className="flex flex-wrap gap-3">
                  {/* Upload card with plus icon */}
                  <button
                    onClick={() => triggerFileInput(c.id)}
                    className="w-32 h-40 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center hover:border-blue-500 hover:bg-white/5 transition-all group"
                  >
                    <Plus className="w-8 h-8 text-white/60 group-hover:text-blue-500 mb-2" />
                    <span className="text-white/60 text-sm group-hover:text-blue-500">Upload File</span>
                  </button>
                  <input
                    ref={el => fileInputRefs.current[c.id] = el}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.rtf,.odt,.jpg,.jpeg,.png,application/*,text/plain,image/*"
                    multiple
                    className="hidden"
                    onChange={e => handleFileUpload(c.id, e.target.files)}
                  />
                  
                  {/* Display uploaded files */}
                  {uploads[c.id]?.filter(f => f.uploadedBy === 'client').map((file, idx) => (
                    <div
                      key={idx}
                      className="w-32 h-40 border border-white/20 rounded-lg bg-white/5 p-3 flex flex-col items-center justify-between relative group"
                    >
                      <button
                        onClick={() => handleRemoveFile(c.id, file.name)}
                        className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove file"
                      >
                        <Trash2 className="w-3 h-3 text-white" />
                      </button>
                      <FileText className="w-10 h-10 text-blue-400 mt-2" />
                      <div className="text-white/80 text-xs text-center break-words w-full px-1">
                        {file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name}
                      </div>
                      <div className="text-white/40 text-xs">
                        {new Date(file.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Attorney uploaded files section - Always show */}
                <div className="mt-6">
                  <label className="block text-white/80 mb-3 font-medium">Documents from Attorney:</label>
                  <div className="flex flex-wrap gap-3">
                    {getAttorneyUploads(c.id).length > 0 ? (
                      getAttorneyUploads(c.id).map((file, idx) => (
                        <div
                          key={idx}
                          className="w-32 h-40 border border-green-500/30 rounded-lg bg-green-500/5 p-3 flex flex-col items-center justify-between"
                        >
                          <FileText className="w-10 h-10 text-green-400 mt-2" />
                          <div className="text-white/80 text-xs text-center break-words w-full px-1">
                            {file.name.length > 20 ? file.name.substring(0, 17) + '...' : file.name}
                          </div>
                          <div className="text-white/40 text-xs">
                            {new Date(file.date).toLocaleDateString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-white/40 text-sm py-4">
                        No documents uploaded by attorney yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
import React from 'react';
    import Header from '../components/Header';
    import Footer from '../components/Footer';
    import IntakeFlow from '../components/IntakeFlow';
    import { useRouter } from 'next/router';
    
    // Case types (same as Services)
    const caseTypes = [
      { id: 'dui', title: 'DUI / DWI', desc: 'Arrests, checkpoints, breath/blood testing', emoji: '🚔' },
      { id: 'drug', title: 'Drug offenses', desc: 'Possession, distribution, trafficking', emoji: '💊' },
      { id: 'theft', title: 'Theft & Property', desc: 'Shoplifting, burglary, fraud', emoji: '🛒' },
      { id: 'violent', title: 'Violent charges', desc: 'Assault, battery, domestic violence', emoji: '⚖️' },
    ];

    const Dashboard: React.FC = () => {
      const [user, setUser] = React.useState<any>(null);
      const router = useRouter();
      const [showIntakeModal, setShowIntakeModal] = React.useState(false);
      const [selectedCase, setSelectedCase] = React.useState<string | null>(null);
      const [showIntakeFlow, setShowIntakeFlow] = React.useState(false);
      const [showEditModal, setShowEditModal] = React.useState(false);
      const [editFirstName, setEditFirstName] = React.useState('');
      const [editLastName, setEditLastName] = React.useState('');
      const [editEmail, setEditEmail] = React.useState('');
      const [editPhone, setEditPhone] = React.useState('');
      const [editDob, setEditDob] = React.useState('');
      const [showEditCalendar, setShowEditCalendar] = React.useState(false);
      // ...existing code...

      React.useEffect(() => {
        try {
          const raw = localStorage.getItem('defense_user');
          if (raw) {
            setUser(JSON.parse(raw));
          } else {
            router.replace('/');
          }
        } catch (err) {
          console.error('Failed to read user', err);
          router.replace('/');
        }
      }, []);

      const handleLogout = () => {
        try {
          localStorage.removeItem('defense_user');
        } catch (err) {
          console.error('Failed clearing user', err);
        }
        // Reload the page so Home re-runs its effect and shows the form
        window.location.href = '/';
      };

      const handleIntakeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCase) return;
        setShowIntakeModal(false);
        setShowIntakeFlow(true);
      };

      const handleIntakeComplete = (intakeData: any) => {
        const newCase = {
          id: `case_${Date.now()}`,
          title: caseTypes.find(c => c.id === selectedCase)?.title || selectedCase.charAt(0).toUpperCase() + selectedCase.slice(1),
          status: 'Intake scheduled',
          createdAt: new Date().toISOString(),
          preferredTime: intakeData.preferredTime,
          contactMethod: intakeData.contactMethod,
        };
        const updatedUser = {
          ...user,
          cases: [...(user?.cases || []), newCase],
        };
        setUser(updatedUser);
        localStorage.setItem('defense_user', JSON.stringify(updatedUser));
        setShowIntakeFlow(false);
        setSelectedCase(null);
      };

      const handleOpenEditModal = () => {
        setEditFirstName(user?.name || '');
        setEditLastName(user?.lastName || '');
        // Set email and phone based on contact method
        if (user?.contactMethod === 'phone') {
          setEditPhone(user?.contact || '');
          setEditEmail(user?.email || '');
        } else {
          setEditEmail(user?.contact || '');
          setEditPhone(user?.email || '');
        }
        setEditDob(user?.dob || '');
        setShowEditModal(true);
      };

      const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault();
        const updatedUser = {
          ...user,
          name: editFirstName,
          lastName: editLastName,
          email: user?.contactMethod === 'phone' ? editEmail : editPhone,
          contact: user?.contactMethod === 'phone' ? editPhone : editEmail,
          dob: editDob,
        };
        setUser(updatedUser);
        localStorage.setItem('defense_user', JSON.stringify(updatedUser));
        setShowEditModal(false);
      };

      return (
        <div className="min-h-screen bg-black">
          <Header />
          <main className="pt-16">
            <section className="py-16 px-4">
              <div className="max-w-6xl mx-auto">
                {user && (
                  <div className="text-white">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                      <div>
                        <div className="flex items-center gap-2">
                          <h1 className="text-3xl md:text-4xl font-light">Welcome, {user.name}</h1>
                        </div>
                        <button
                          className="flex bg-white/15 items-center gap-2 mt-1 py-1 px-3 rounded hover:bg-white/10 focus:outline-none"
                          title="Edit profile"
                          onClick={handleOpenEditModal}
                        >
                          <Pencil className="w-4 h-4 text-white/60" />
                          <span className="text-white/60">Edit Profile</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-3 mt-6 md:mt-0">
                        <button
                          onClick={() => setShowIntakeModal(true)}
                          className="bg-white/5 border border-white/20 text-white px-4 py-2 rounded-md"
                        >
                          New intake
                        </button>
                              {/* Edit Profile Modal */}
                              {showEditModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                                  <div className="bg-black border border-white/10 rounded-2xl shadow-lg p-8 w-full max-w-lg relative">
                                    <button
                                      className="absolute top-4 right-4 text-white/60 hover:text-white text-xl"
                                      onClick={() => setShowEditModal(false)}
                                      aria-label="Close"
                                    >
                                      &times;
                                    </button>
                                    <h2 className="text-2xl font-semibold text-white mb-6">Edit Profile</h2>
                                    <form onSubmit={handleSaveProfile} className="space-y-4">
                                      <div>
                                        <label className="block text-white text-sm mb-2">First name</label>
                                        <input
                                          type="text"
                                          value={editFirstName}
                                          onChange={(e) => setEditFirstName(e.target.value)}
                                          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-white text-sm mb-2">Last name</label>
                                        <input
                                          type="text"
                                          value={editLastName}
                                          onChange={(e) => setEditLastName(e.target.value)}
                                          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-white text-sm mb-2">Email address</label>
                                        <input
                                          type="email"
                                          value={editEmail}
                                          onChange={(e) => setEditEmail(e.target.value)}
                                          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-white text-sm mb-2">Phone number</label>
                                        <input
                                          type="tel"
                                          value={editPhone}
                                          onChange={(e) => setEditPhone(e.target.value)}
                                          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                          required
                                        />
                                      </div>
                                      <div>
                                        <label className="block text-white text-sm mb-2">Date of birth (optional)</label>
                                        <input
                                          type="text"
                                          value={editDob ? new Date(editDob).toLocaleDateString('en-US') : ''}
                                          onFocus={() => setShowEditCalendar(true)}
                                          readOnly
                                          placeholder="MM/DD/YYYY"
                                          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                                        />
                                        {showEditCalendar && (
                                          <div className="mt-2">
                                            <Calendar
                                              onChange={(date) => {
                                                const d = Array.isArray(date) ? date[0] : date;
                                                setEditDob(d.toISOString().slice(0, 10));
                                                setShowEditCalendar(false);
                                              }}
                                              value={editDob ? new Date(editDob) : undefined}
                                              maxDate={new Date()}
                                            />
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex gap-3 pt-4">
                                        <button
                                          type="submit"
                                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                        >
                                          Save Changes
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => setShowEditModal(false)}
                                          className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              )}

                              {/* Intake Modal */}
                              {showIntakeModal && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                                  <div className="bg-black border border-white/10 rounded-2xl shadow-lg p-12 w-full max-w-xl relative">
                                    <button
                                      className="absolute top-4 right-4 text-white/60 hover:text-white text-xl"
                                      onClick={() => setShowIntakeModal(false)}
                                      aria-label="Close"
                                    >
                                      &times;
                                    </button>
                                    <h2 className="text-2xl font-semibold text-white mb-6">Start New Intake</h2>
                                    <div className="mb-6">
                                      <div className="text-white/80 mb-4">Select your case type:</div>
                                      <div className="grid grid-cols-2 gap-6">
                                        {caseTypes.map((c) => (
                                          <button
                                            key={c.id}
                                            type="button"
                                            className={`flex flex-col items-center justify-center px-6 py-8 rounded-2xl border border-white/20 transition-colors shadow bg-white/5 text-white/80 hover:bg-white/10 hover:bg-blue-600/20`}
                                            onClick={() => {
                                              setSelectedCase(c.id);
                                              setShowIntakeModal(false);
                                              setTimeout(() => {
                                                setShowIntakeFlow(true);
                                              }, 100);
                                            }}
                                          >
                                            <span className="text-4xl mb-2">{c.emoji}</span>
                                            <span className="font-medium text-lg mb-1">{c.title}</span>
                                            <span className="text-xs text-white/60 text-center">{c.desc}</span>
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Intake Flow Modal */}
                              {showIntakeFlow && selectedCase && (
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                                  <div className="bg-black border border-white/10 rounded-2xl shadow-lg p-8 w-full max-w-2xl relative">
                                    <IntakeFlow
                                      caseType={selectedCase}
                                      onComplete={handleIntakeComplete}
                                      onCancel={() => {
                                        setShowIntakeFlow(false);
                                        setSelectedCase(null);
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                        <button
                          onClick={handleLogout}
                          className="bg-red-800 hover:bg-red-900 text-white px-4 py-2 rounded-md"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
    
                    <div className="mb-8">
                      <h2 className="text-2xl font-medium mb-4">Your cases</h2>
                      {Array.isArray(user.cases) && user.cases.length > 0 ? (
                        <CasesSection cases={user.cases} />
                      ) : (
                        <div className="text-white/60">You have no cases yet.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </main>
          <Footer />
        </div>
      );
    };
    
    export default Dashboard;