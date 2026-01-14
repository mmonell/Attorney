import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, MessageSquare, Clock, Calendar as CalendarIcon, CalendarDays, CalendarRange, ArrowLeft, Accessibility, Volume2, Cookie, X } from 'lucide-react';
import { useRouter } from 'next/router';

    const DecisionTunnel = () => {
      const [currentStep, setCurrentStep] = useState(0);
      const [selectedSituation, setSelectedSituation] = useState('');
      const [selectedTime, setSelectedTime] = useState('');
      const [selectedDate, setSelectedDate] = useState<Date | null>(null);
      const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
      const [selectedMethod, setSelectedMethod] = useState('');
      const [contact, setContact] = useState('');
      const [clientName, setClientName] = useState('');
      const [clientLastName, setClientLastName] = useState('');
      const [clientEmail, setClientEmail] = useState('');
      const [clientDob, setClientDob] = useState('');
      const [showCalendar, setShowCalendar] = useState(false);
      const [loginEmail, setLoginEmail] = useState('');
      const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
      const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
      const [showCookieBanner, setShowCookieBanner] = useState(false);
      const [showCookieSettings, setShowCookieSettings] = useState(false);
      const [cookiePreferences, setCookiePreferences] = useState({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false
      });

      const router = useRouter();

      // Check if user has already consented to cookies
      useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
          setShowCookieBanner(true);
        } else {
          try {
            const prefs = JSON.parse(consent);
            setCookiePreferences(prefs);
          } catch (e) {
            setShowCookieBanner(true);
          }
        }
      }, []);

      const situations = [
        { id: 'arrested', label: 'Arrested / Just released', icon: '🚔' },
        { id: 'charged', label: 'Charged but not arrested', icon: '📄' },
        { id: 'court', label: 'Court date coming up', icon: '⚖️' },
        { id: 'family', label: 'Someone I love needs help', icon: '👤' },
        { id: 'unsure', label: 'Not sure yet', icon: '❓' }
      ];

      const timeOptions = [
        { id: 'now', label: 'Now', icon: Clock },
        { id: 'today', label: 'Today', icon: CalendarIcon },
        { id: 'tomorrow', label: 'Tomorrow', icon: CalendarDays },
        { id: 'week', label: 'This week', icon: CalendarRange }
      ];

      const contactMethods = [
        { id: 'phone', label: 'Phone', icon: Phone },
        { id: 'video', label: 'Video', icon: Video },
        { id: 'text', label: 'Secure text', icon: MessageSquare }
      ];

      const handleSituationSelect = (situation: string) => {
        setSelectedSituation(situation);
        setTimeout(() => setCurrentStep(2), 250);
      };

      const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
        setTimeout(() => setCurrentStep(3), 250);
      };

      const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 9; hour <= 18; hour++) {
          const time12hr = hour > 12 ? hour - 12 : hour;
          const period = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour === 12 ? 12 : time12hr;
          slots.push({
            value: `${hour}:00`,
            label: `${displayHour}:00 ${period}`
          });
        }
        return slots;
      };

      const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        setSelectedTimeSlot(''); // Reset time slot when date changes
      };

      const handleTimeSlotSelect = (timeSlot: string) => {
        setSelectedTimeSlot(timeSlot);
        const dateStr = selectedDate ? selectedDate.toLocaleDateString() : '';
        setSelectedTime(`${dateStr} at ${timeSlot}`);
        setTimeout(() => setCurrentStep(3), 250);
      };

      const handleMethodSelect = (method: string) => {
        // Reset contact field if switching between phone and (video/text)
        if (selectedMethod) {
          const wasPhone = selectedMethod === 'phone';
          const isPhone = method === 'phone';
          // Clear field if switching from phone to video/text or vice versa
          if (wasPhone !== isPhone) {
            setContact('');
          }
        }
        setSelectedMethod(method);
      };

      const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Proceed to collect minimal client info
        setCurrentStep(4);
      };

      const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Check if user exists in localStorage
        try {
          const storedUser = localStorage.getItem('defense_user');
          if (storedUser) {
            const user = JSON.parse(storedUser);
            // Simple check: if email matches contact info
            if (user.contact === loginEmail) {
              router.push('/dashboard');
              return;
            }
          }
          // If no match, show error or proceed anyway
          alert('No account found with that email. Please create a new account.');
        } catch (err) {
          console.error('Login error', err);
        }
      };

      const acceptAllCookies = () => {
        const allAccepted = {
          necessary: true,
          functional: true,
          analytics: true,
          marketing: true
        };
        setCookiePreferences(allAccepted);
        localStorage.setItem('cookie_consent', JSON.stringify(allAccepted));
        setShowCookieBanner(false);
        setShowCookieSettings(false);
      };

      const acceptNecessaryOnly = () => {
        const necessaryOnly = {
          necessary: true,
          functional: false,
          analytics: false,
          marketing: false
        };
        setCookiePreferences(necessaryOnly);
        localStorage.setItem('cookie_consent', JSON.stringify(necessaryOnly));
        setShowCookieBanner(false);
        setShowCookieSettings(false);
      };

      const saveCustomPreferences = () => {
        localStorage.setItem('cookie_consent', JSON.stringify(cookiePreferences));
        setShowCookieBanner(false);
        setShowCookieSettings(false);
      };

      const speak = (text: string) => {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Cancel any ongoing speech
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1;
          utterance.volume = 1;
          window.speechSynthesis.speak(utterance);
        }
      };

      const handleElementHover = (e: Event) => {
        if (!screenReaderEnabled) return;
        const target = e.target as HTMLElement;
        const text = target.getAttribute('aria-label') || 
                    target.getAttribute('placeholder') || 
                    target.textContent || 
                    target.getAttribute('alt') || 
                    'Interactive element';
        if (text && text.trim()) {
          speak(text.trim());
        }
      };

      const toggleScreenReader = () => {
        const newState = !screenReaderEnabled;
        setScreenReaderEnabled(newState);
        if (newState) {
          speak('Screen reader enabled. Hovering over any button or field will read it aloud.');
        } else {
          speak('Screen reader disabled.');
          window.speechSynthesis.cancel();
        }
      };

      // Attach/reattach event listeners whenever screen reader state or DOM changes
      useEffect(() => {
        if (screenReaderEnabled) {
          const attachListeners = () => {
            const elements = document.querySelectorAll('button, input, a, h1, h2, h3, label, textarea, select');
            elements.forEach(el => {
              el.addEventListener('mouseenter', handleElementHover);
              el.addEventListener('focus', handleElementHover);
            });
          };

          // Attach immediately
          attachListeners();

          // Reattach after a short delay to catch any dynamically rendered content
          const timeoutId = setTimeout(attachListeners, 300);

          return () => {
            clearTimeout(timeoutId);
            const elements = document.querySelectorAll('button, input, a, h1, h2, h3, label, textarea, select');
            elements.forEach(el => {
              el.removeEventListener('mouseenter', handleElementHover);
              el.removeEventListener('focus', handleElementHover);
            });
          };
        }
      }, [screenReaderEnabled, currentStep]);

      const handleFinalSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const createdAt = new Date().toISOString();
        // Minimal "user" object stored locally to simulate logged-in session
        const user = {
          name: clientName || 'Client',
          lastName: clientLastName || '',
          email: clientEmail,
          contact,
          contactMethod: selectedMethod,
          situation: selectedSituation,
          preferredTime: selectedTime,
          dob: clientDob || null,
          createdAt,
          cases: [
            {
              id: `case_${Date.now()}`,
              title: selectedSituation ? selectedSituation.charAt(0).toUpperCase() + selectedSituation.slice(1).replace(/_/g, ' ') : 'New case',
              status: 'Intake scheduled',
              createdAt,
            },
          ],
        };

        try {
          localStorage.setItem('defense_user', JSON.stringify(user));
        } catch (err) {
          // ignore storage errors
          console.error('Failed saving user', err);
        }

        // Navigate to dashboard
        router.push('/dashboard');
      };

      const stepVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
      };

      return (
        <div className="min-h-screen bg-black flex items-center justify-center px-4">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step0"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <motion.h1
                    className="text-4xl md:text-6xl font-light text-white mb-12 leading-tight"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    You don't have to handle this alone.
                  </motion.h1>

                  <motion.button
                    onClick={() => setCurrentStep(1)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-medium rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    I need a criminal lawyer now
                  </motion.button>

                  <div className="mt-8">
                    <button
                      onClick={() => setCurrentStep(5)}
                      className="text-white/70 hover:text-white text-lg transition-colors focus:outline-none"
                    >
                      I already have an account
                    </button>
                  </div>
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-12">
                    <button
                      className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none"
                      onClick={() => setCurrentStep(0)}
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-3xl md:text-4xl font-light text-white">
                      What are you dealing with right now?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                    {situations.map((situation) => (
                      <motion.button
                        key={situation.id}
                        onClick={() => handleSituationSelect(situation.id)}
                        className="bg-white/5 hover:bg-white/10 border border-white/20 text-white p-6 rounded-lg text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-2xl mb-2">{situation.icon}</div>
                        <div className="text-lg">{situation.label}</div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-4">
                    <button
                      className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none"
                      onClick={() => setCurrentStep(1)}
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-3xl md:text-4xl font-light text-white">
                      This is fixable.
                    </h2>
                  </div>
                  <div className="mb-8">
                    <p className="text-xl text-white/80 mb-4">
                      Timing matters.
                    </p>
                    <p className="text-lg text-white/60">
                      The next step is a private call with a defense attorney.
                    </p>
                  </div>

                  <h3 className="text-2xl text-white mb-8">When works best?</h3>

                  <div className="max-w-2xl mx-auto">
                    <div className="flex justify-center mb-6">
                      <Calendar
                        onChange={handleDateSelect}
                        value={selectedDate}
                        minDate={new Date()}
                      />
                    </div>

                    {selectedDate && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8"
                      >
                        <h4 className="text-xl text-white mb-4">Select a time</h4>
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                          {generateTimeSlots().map((slot) => (
                            <motion.button
                              key={slot.value}
                              onClick={() => handleTimeSlotSelect(slot.label)}
                              className={`p-3 rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                                selectedTimeSlot === slot.label
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              {slot.label}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-12">
                    <button
                      className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none"
                      onClick={() => setCurrentStep(2)}
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-3xl md:text-4xl font-light text-white">
                      How should we connect?
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-12">
                    {contactMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <motion.button
                          key={method.id}
                          onClick={() => handleMethodSelect(method.id)}
                          className={`border text-white p-6 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30 ${
                            selectedMethod === method.id
                              ? 'bg-white/20 border-white/40'
                              : 'bg-white/5 hover:bg-white/10 border-white/20'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <IconComponent className="w-8 h-8 mx-auto mb-2" />
                          <div className="text-lg">{method.label}</div>
                        </motion.button>
                      );
                    })}
                  </div>

                  {selectedMethod && (
                    <motion.form
                      onSubmit={handleContactSubmit}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-md mx-auto"
                    >
                      <label className="block text-white text-lg mb-4">
                        Where should we reach you?
                      </label>
                      <input
                        type={selectedMethod === 'phone' ? 'tel' : 'email'}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder={selectedMethod === 'phone' ? 'Your phone number' : 'Your email address'}
                        className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                        required
                      />
                      <motion.button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg mt-6 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Continue
                      </motion.button>
                    </motion.form>
                  )}
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-6">
                    <button
                      className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none"
                      onClick={() => setCurrentStep(3)}
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-3xl md:text-4xl font-light text-white">
                      Quick info so we can identify you
                    </h2>
                  </div>
                  <p className="text-lg text-white/60 mb-8">
                    We only need the essentials. Attorney will gather details on the call.
                  </p>

                  <motion.form
                    onSubmit={handleFinalSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto text-left"
                  >

                    <label className="block text-white text-sm mb-2">First name</label>
                    <input
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="First name"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 mb-4"
                      required
                    />

                    <label className="block text-white text-sm mb-2">Last name</label>
                    <input
                      value={clientLastName}
                      onChange={(e) => setClientLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 mb-4"
                      required
                    />

                    {selectedMethod === 'phone' && (
                      <>
                        <label className="block text-white text-sm mb-2">Email address</label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 mb-4"
                          required
                        />
                      </>
                    )}

                    {(selectedMethod === 'video' || selectedMethod === 'text') && (
                      <>
                        <label className="block text-white text-sm mb-2">Phone number</label>
                        <input
                          type="tel"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          placeholder="Your phone number"
                          className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 mb-4"
                          required
                        />
                      </>
                    )}

                    <label className="block text-white text-sm mb-2">Date of birth (optional)</label>
                    <input
                      value={clientDob ? new Date(clientDob).toLocaleDateString('en-US') : ''}
                      onFocus={() => setShowCalendar(true)}
                      readOnly
                      placeholder="MM/DD/YYYY"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40 mb-6 cursor-pointer"
                    />
                    {showCalendar && (
                      <div className="flex justify-center mb-6">
                        <Calendar
                          onChange={(date) => {
                            const d = Array.isArray(date) ? date[0] : date;
                            setClientDob(d.toISOString().slice(0, 10));
                            setShowCalendar(false);
                          }}
                          value={clientDob ? new Date(clientDob) : undefined}
                          maxDate={new Date()}
                          className="rounded-lg shadow-lg bg-black text-white border border-white/20"
                        />
                      </div>
                    )}

                    <motion.button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Schedule confidential call
                    </motion.button>
                  </motion.form>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div
                  key="step5"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <div className="flex items-center justify-center mb-12">
                    <button
                      className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none"
                      onClick={() => setCurrentStep(0)}
                      aria-label="Back"
                    >
                      <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h2 className="text-3xl md:text-4xl font-light text-white">
                      Log into your account
                    </h2>
                  </div>

                  <motion.form
                    onSubmit={handleLoginSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md mx-auto"
                  >
                    <label className="block text-white text-lg mb-4">
                      Enter your email address
                    </label>
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-white/10 border border-white/20 text-white placeholder-white/50 px-4 py-3 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
                      required
                    />
                    <motion.button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg mt-6 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Log in
                    </motion.button>
                  </motion.form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* ADA Accessibility Widget */}
          <div className="fixed bottom-6 right-6 z-[60]">
            <AnimatePresence>
              {showAccessibilityMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mb-4 bg-white rounded-lg shadow-2xl p-4 w-72"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Accessibility Options</h3>
                  <div className="space-y-2">
                    <button
                      onClick={toggleScreenReader}
                      className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-800 transition-colors flex items-center gap-2 ${screenReaderEnabled ? 'bg-blue-100' : ''}`}
                    >
                      <Volume2 className="w-4 h-4" />
                      {screenReaderEnabled ? 'Disable' : 'Enable'} Screen Reader
                    </button>
                    <button
                      onClick={() => document.body.style.fontSize = document.body.style.fontSize === '120%' ? '100%' : '120%'}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-800 transition-colors"
                    >
                      Increase Text Size
                    </button>
                    <button
                      onClick={() => document.body.classList.toggle('high-contrast')}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-800 transition-colors"
                    >
                      High Contrast
                    </button>
                    <button
                      onClick={() => {
                        const links = document.querySelectorAll('a, button');
                        links.forEach(el => (el as HTMLElement).classList.toggle('focus-highlight'));
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-800 transition-colors"
                    >
                      Highlight Links
                    </button>
                    <button
                      onClick={() => document.body.classList.toggle('readable-font')}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-gray-800 transition-colors"
                    >
                      Readable Font
                    </button>
                  </div>
                  <button
                    onClick={() => setShowAccessibilityMenu(false)}
                    className="w-full mt-3 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800 transition-colors"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <motion.button
              onClick={() => setShowAccessibilityMenu(!showAccessibilityMenu)}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-500/50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Accessibility Options"
            >
              <Accessibility className="w-6 h-6" />
            </motion.button>
          </div>

          {/* GDPR Cookie Consent Banner */}
          <AnimatePresence>
            {showCookieBanner && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t border-gray-200 z-50 p-6"
              >
                {!showCookieSettings ? (
                  <div className="max-w-6xl mx-auto">
                    <div className="flex items-start gap-4">
                      <Cookie className="w-8 h-8 text-blue-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">We value your privacy</h3>
                        <p className="text-gray-700 mb-4">
                          We use cookies to enhance your browsing experience, provide personalized content, and analyze our traffic. 
                          By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or accept only necessary cookies.
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={acceptAllCookies}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                          >
                            Accept All
                          </button>
                          <button
                            onClick={acceptNecessaryOnly}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                          >
                            Necessary Only
                          </button>
                          <button
                            onClick={() => setShowCookieSettings(true)}
                            className="border border-gray-300 hover:bg-gray-50 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                          >
                            Customize
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={acceptNecessaryOnly}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close and accept necessary only"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Cookie Preferences</h3>
                      <button
                        onClick={() => setShowCookieSettings(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-6 h-6" />
                      </button>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Necessary Cookies</h4>
                          <p className="text-sm text-gray-600">Required for the website to function properly. Cannot be disabled.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={true}
                          disabled
                          className="mt-1 w-5 h-5"
                        />
                      </div>
                      <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Functional Cookies</h4>
                          <p className="text-sm text-gray-600">Enable enhanced functionality and personalization.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={cookiePreferences.functional}
                          onChange={(e) => setCookiePreferences({...cookiePreferences, functional: e.target.checked})}
                          className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer"
                        />
                      </div>
                      <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h4>
                          <p className="text-sm text-gray-600">Help us understand how visitors interact with our website.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={cookiePreferences.analytics}
                          onChange={(e) => setCookiePreferences({...cookiePreferences, analytics: e.target.checked})}
                          className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer"
                        />
                      </div>
                      <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">Marketing Cookies</h4>
                          <p className="text-sm text-gray-600">Used to track visitors and display relevant ads.</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={cookiePreferences.marketing}
                          onChange={(e) => setCookiePreferences({...cookiePreferences, marketing: e.target.checked})}
                          className="mt-1 w-5 h-5 accent-blue-600 cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={saveCustomPreferences}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Save Preferences
                      </button>
                      <button
                        onClick={acceptAllCookies}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
                      >
                        Accept All
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    };

    export default DecisionTunnel;