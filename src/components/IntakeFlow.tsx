import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, MessageSquare, CalendarDays, CalendarRange, ArrowLeft } from 'lucide-react';

interface IntakeFlowProps {
  caseType: string;
  onComplete: (intakeData: any) => void;
  onCancel: () => void;
}

const IntakeFlow: React.FC<IntakeFlowProps> = ({ caseType, onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');

  const contactMethods = [
    { id: 'phone', label: 'Phone', icon: Phone },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'text', label: 'Secure text', icon: MessageSquare }
  ];

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
    setSelectedTimeSlot('');
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    setSelectedTimeSlot(timeSlot);
    setTimeout(() => setCurrentStep(1), 250);
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
  };

  const handleSubmit = () => {
    const dateStr = selectedDate ? selectedDate.toLocaleDateString() : '';
    onComplete({
      caseType,
      preferredTime: `${dateStr} at ${selectedTimeSlot}`,
      contactMethod: selectedMethod,
    });
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step0"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center mb-4">
              <button
                className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none"
                onClick={onCancel}
                aria-label="Back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-light text-white">
                Schedule your consultation
              </h2>
            </div>
            <div className="mb-6">
              <p className="text-lg text-white/80 mb-2 text-center">
                Timing matters.
              </p>
              <p className="text-base text-white/60 text-center">
                The next step is a private call with a defense attorney.
              </p>
            </div>

            <h3 className="text-xl text-white mb-6 text-center">When works best?</h3>

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
                className="mt-6"
              >
                <h4 className="text-lg text-white mb-4 text-center">Select a time</h4>
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
          >
            <div className="flex items-center justify-center mb-8">
              <button
                className="mr-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white focus:outline-none"
                onClick={() => setCurrentStep(0)}
                aria-label="Back"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-light text-white">
                How should we connect?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <motion.button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Schedule consultation
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntakeFlow;
