import React, { useState } from 'react';
import { 
  ChevronLeft, Calendar as CalendarIcon, Clock, Phone, Mail,
  CheckCircle, Sparkles, Smile, Shield, Syringe, Activity, AlertCircle, Edit2, ChevronRight, ChevronLeft as ChevronLeftIcon, Star, MapPin
} from 'lucide-react';
import { 
  format, isBefore, startOfDay, isSameDay, 
  startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday
} from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

const services = [
  { id: 'cleaning',   title: 'Cleaning',              desc: 'Routine checkup and professional cleaning',  icon: Sparkles },
  { id: 'whitening',  title: 'Teeth Whitening',        desc: 'Professional whitening treatment',           icon: Smile    },
  { id: 'implants',   title: 'Dental Implants',        desc: 'Permanent tooth replacement',                icon: Shield   },
  { id: 'braces',     title: 'Braces & Orthodontics',  desc: 'Clear aligners and traditional braces',      icon: Activity },
  { id: 'emergency',  title: 'Emergency Appointment',  desc: 'Urgent care for pain or injury',             icon: AlertCircle },
  { id: 'general',    title: 'General Dentistry',      desc: 'Fillings, extractions, and more',            icon: Syringe  },
];

const availableTimeSlots = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '04:30 PM',
];

const stepLabels = ['Service', 'Date & Time', 'Your Details', 'Review'];

// Custom spring transition for premium feel
const transition = { type: 'spring', bounce: 0, duration: 0.6 };
const stepVariants = {
  hidden: { opacity: 0, y: 16, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit: { opacity: 0, y: -16, filter: 'blur(4px)' }
};

/* ─────────── Shared wizard content (used in both layouts) ─────────── */
function WizardContent({
  step, serviceId, selectedDate, selectedTime, contact, errors,
  setContact, setSelectedDate, setSelectedTime,
  handleServiceSelect, nextStep, prevStep, goToStep,
  handleContactSubmit, handleConfirm,
  currentMonth, setCurrentMonth,
  daysInMonth, startWeekDay, emptyDays, today,
  selectedServiceObj, desktop,
}) {
  const btnBase = desktop
    ? 'w-full bg-emerald-600 hover:bg-emerald-700 text-white min-h-[3.25rem] text-base font-medium rounded-full shadow-sm transition-all active:scale-[0.98]'
    : 'w-full bg-emerald-600 hover:bg-emerald-700 text-white min-h-[3.5rem] text-lg font-medium rounded-full shadow-sm transition-all active:scale-[0.98]';

  return (
    <AnimatePresence mode="wait">
      {step === 1 && (
        <motion.div 
          key="step1"
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
        >
          <h2 className={`font-medium text-zinc-900 tracking-tight mb-2 ${desktop ? 'text-4xl' : 'text-3xl'}`}>
            What brings you in?
          </h2>
          <p className={`text-zinc-500 mb-8 ${desktop ? 'text-base' : 'text-base'}`}>Select a service to get started.</p>
          <div className={`grid gap-5 ${desktop ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {services.map(service => {
              const Icon = service.icon;
              const isSel = serviceId === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex items-start group
                    ${isSel ? 'border-emerald-600 bg-emerald-50/50 shadow-[0_4px_20px_-4px_rgba(16,185,129,0.1)]' : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-5 flex-shrink-0 transition-colors
                    ${isSel ? 'bg-emerald-600 text-white' : 'bg-zinc-100 text-zinc-600 group-hover:bg-zinc-200'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="pt-0.5">
                    <h3 className={`text-base font-medium transition-colors ${isSel ? 'text-emerald-950' : 'text-zinc-900'}`}>{service.title}</h3>
                    <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">{service.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div 
          key="step2"
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          className={`${desktop ? '' : 'pb-32'}`}
        >
          <h2 className={`font-medium text-zinc-900 tracking-tight mb-2 ${desktop ? 'text-4xl' : 'text-3xl'}`}>
            Pick a time
          </h2>
          <p className={`text-zinc-500 mb-8 ${desktop ? 'text-base' : 'text-base'}`}>Select a date and time that works.</p>

          <div className={`flex flex-col ${desktop ? 'lg:flex-row lg:items-start lg:gap-10' : ''}`}>
            
            {/* Calendar Container */}
            <div className={`flex-shrink-0 bg-white rounded-2xl border border-zinc-200 shadow-sm mb-8 lg:mb-0 ${desktop ? 'p-6 w-[23rem]' : 'p-6 max-w-sm mx-auto sm:mx-0'}`}>
              <div className="flex items-center justify-between mb-5">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  disabled={isBefore(startOfMonth(currentMonth), startOfMonth(today))}
                  className="p-2 -ml-2 rounded-full hover:bg-zinc-100 disabled:opacity-30 transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5 text-zinc-600" />
                </button>
                <h3 className="font-medium text-base text-zinc-900">{format(currentMonth, 'MMMM yyyy')}</h3>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 -mr-2 rounded-full hover:bg-zinc-100 transition-colors">
                  <ChevronRight className="w-5 h-5 text-zinc-600" />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <div key={d} className="text-center text-[11px] font-medium text-zinc-400 uppercase tracking-wider py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {emptyDays.map((_, i) => <div key={`e-${i}`} className="p-2" />)}
                {daysInMonth.map(date => {
                  const isPast = isBefore(date, today) && !isSameDay(date, today);
                  const isSel  = selectedDate && isSameDay(date, selectedDate);
                  const isTod  = isToday(date);
                  return (
                    <button
                      key={date.toString()}
                      disabled={isPast}
                      onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                      className={`w-10 h-10 sm:w-11 sm:h-11 mx-auto rounded-full flex items-center justify-center text-sm transition-all
                        ${isPast ? 'text-zinc-300 cursor-not-allowed' : 'hover:bg-zinc-100 text-zinc-700'}
                        ${isSel  ? 'bg-emerald-600 text-white shadow-md font-medium' : ''}
                        ${isTod && !isSel ? 'ring-1 ring-inset ring-zinc-300 text-zinc-900 font-medium' : ''}`}
                    >
                      {format(date, 'd')}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Container */}
            <div className={desktop ? 'flex-1 min-w-[300px]' : ''}>
              <AnimatePresence mode="wait">
                {selectedDate ? (
                  <motion.div 
                    key="times"
                    initial={{ opacity: 0, x: desktop ? 20 : 0, y: desktop ? 0 : -10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: desktop ? -20 : 0, y: desktop ? 0 : 10 }}
                    transition={transition}
                  >
                    <h3 className="font-medium text-sm text-zinc-400 uppercase tracking-wider mb-5 flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-zinc-400" />
                      Available on {format(selectedDate, 'MMM d')}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                      {availableTimeSlots.map(time => {
                        const isSel = selectedTime === time;
                        return (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`min-h-[3.25rem] py-2 px-3 rounded-xl text-sm transition-all border
                              ${isSel ? 'bg-zinc-900 border-zinc-900 text-white shadow-md' : 'bg-white border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:bg-zinc-50'}`}
                          >
                            {time}
                          </button>
                        );
                      })}
                    </div>
                    
                    {desktop && selectedTime && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-10">
                        <button onClick={nextStep} className={btnBase}>Continue</button>
                      </motion.div>
                    )}
                  </motion.div>
                ) : (
                  desktop && (
                    <motion.div 
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center text-center p-10 border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50/50"
                    >
                      <CalendarIcon className="w-10 h-10 text-zinc-300 mb-4" />
                      <p className="text-zinc-600 font-medium mb-1">Select a date</p>
                      <p className="text-sm text-zinc-400">Choose a day to see available times.</p>
                    </motion.div>
                  )
                )}
              </AnimatePresence>
            </div>
            
          </div>

          {!desktop && selectedDate && selectedTime && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed sm:absolute bottom-0 left-0 right-0 p-6 sm:px-10 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent pb-8 pt-12 z-20 sm:rounded-b-[2rem] pointer-events-none">
              <button onClick={nextStep} className={`${btnBase} pointer-events-auto`}>Continue</button>
            </motion.div>
          )}
        </motion.div>
      )}

      {step === 3 && (
        <motion.div 
          key="step3"
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          className={`${desktop ? '' : 'pb-32'}`}
        >
          <h2 className={`font-medium text-zinc-900 tracking-tight mb-2 ${desktop ? 'text-4xl' : 'text-3xl'}`}>
            Your details
          </h2>
          <p className={`text-zinc-500 mb-8 ${desktop ? 'text-base' : 'text-base'}`}>We just need a few details to confirm.</p>

          <div className="space-y-6 max-w-md">
            {[
              { id: 'name',  label: 'Full Name',     type: 'text',  placeholder: 'Jane Doe',          key: 'name'  },
              { id: 'phone', label: 'Phone Number',  type: 'tel',   placeholder: '(555) 123-4567',    key: 'phone' },
              { id: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@example.com',  key: 'email' },
            ].map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-zinc-700 mb-2">{field.label}</label>
                <input
                  id={field.id}
                  type={field.type}
                  value={contact[field.key]}
                  onChange={e => setContact({ ...contact, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className={`w-full min-h-[3.5rem] px-5 rounded-xl border text-base bg-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600
                    ${errors[field.key] ? 'border-red-300 focus:border-red-400 focus:ring-red-500/20' : 'border-zinc-200 hover:border-zinc-300'}`}
                />
                {errors[field.key] && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-red-500 text-xs">
                    {errors[field.key]}
                  </motion.p>
                )}
              </div>
            ))}
          </div>

          {desktop ? (
            <div className="mt-12 max-w-md">
              <button onClick={handleContactSubmit} className={btnBase}>Review Appointment</button>
            </div>
          ) : (
            <div className="fixed sm:absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent pb-8 pt-12 z-20 rounded-b-[2rem] pointer-events-none">
              <button onClick={handleContactSubmit} className={`${btnBase} pointer-events-auto`}>Review Appointment</button>
            </div>
          )}
        </motion.div>
      )}

      {step === 4 && (
        <motion.div 
          key="step4"
          variants={stepVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={transition}
          className={`${desktop ? '' : 'pb-40'}`}
        >
          <h2 className={`font-medium text-zinc-900 tracking-tight mb-2 ${desktop ? 'text-4xl' : 'text-3xl'}`}>
            Review & Confirm
          </h2>
          <p className={`text-zinc-500 mb-8 ${desktop ? 'text-base' : 'text-base'}`}>Make sure everything looks correct.</p>

          <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm mb-10 max-w-2xl">
            {[
              {
                icon: selectedServiceObj?.icon,
                label: 'Service',
                value: selectedServiceObj?.title,
                onEdit: () => goToStep(1),
              },
              {
                imgSrc: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150',
                label: 'Dentist',
                value: 'Dr. Amir Haddad',
              },
              {
                IconComp: CalendarIcon,
                label: 'Date & Time',
                value: selectedDate ? `${format(selectedDate, 'MMM d, yyyy')} at ${selectedTime}` : '',
                onEdit: () => goToStep(2),
              },
              {
                IconComp: Phone,
                label: 'Contact',
                value: contact.name,
                sub: contact.phone,
                onEdit: () => goToStep(3),
              },
            ].map((row, i, arr) => {
              const Icon = row.icon;
              const IconComp = row.IconComp;
              return (
                <div key={i} className={`p-6 flex justify-between items-center group transition-colors ${i < arr.length - 1 ? 'border-b border-zinc-100' : ''}`}>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-500 mr-5 overflow-hidden flex-shrink-0 border border-zinc-100">
                      {row.imgSrc && <img src={row.imgSrc} alt="" className="w-full h-full object-cover" />}
                      {Icon && <Icon className="w-5 h-5" />}
                      {IconComp && <IconComp className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">{row.label}</p>
                      <p className="text-base font-medium text-zinc-900">{row.value}</p>
                      {row.sub && <p className="text-sm text-zinc-500">{row.sub}</p>}
                    </div>
                  </div>
                  {row.onEdit && (
                    <button onClick={row.onEdit} className="p-2.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-full transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {desktop ? (
            <div className="max-w-2xl flex justify-end mt-2">
              <button onClick={handleConfirm} className={`${btnBase.replace('w-full', 'w-auto px-10')} flex items-center justify-center`}>
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Appointment
              </button>
            </div>
          ) : (
            <div className="fixed sm:absolute bottom-0 left-0 right-0 p-6 sm:px-10 bg-gradient-to-t from-zinc-50 via-zinc-50 to-transparent pb-8 pt-12 z-20 sm:rounded-b-[2.5rem] pointer-events-none">
              <button onClick={handleConfirm} className={`${btnBase} pointer-events-auto flex items-center justify-center`}>
                <CheckCircle className="w-5 h-5 mr-2" />
                Confirm Appointment
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────── Main App ─────────── */
export default function App() {
  const [step, setStep]           = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serviceId, setServiceId] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [contact, setContact]     = useState({ name: '', phone: '', email: '' });
  const [errors, setErrors]       = useState({});

  const nextStep = () => { window.scrollTo(0,0); setStep(s => s + 1); };
  const prevStep = () => { window.scrollTo(0,0); setStep(s => s - 1); };
  const goToStep = (s) => { window.scrollTo(0,0); setStep(s); };

  const handleServiceSelect = (id) => { setServiceId(id); setTimeout(nextStep, 250); };

  const validateContact = () => {
    const e = {};
    if (!contact.name.trim())  e.name  = 'Full name is required';
    if (!contact.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^\+?[\d\s-]{10,}$/.test(contact.phone)) e.phone = 'Please enter a valid phone number';
    if (!contact.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(contact.email)) e.email = 'Please enter a valid email address';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContactSubmit = () => { if (validateContact()) nextStep(); };
  const handleConfirm       = () => { setIsSubmitted(true); window.scrollTo(0,0); };

  const selectedServiceObj = services.find(s => s.id === serviceId);
  const today = startOfDay(new Date());
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));

  const daysInMonth   = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const startWeekDay  = getDay(startOfMonth(currentMonth));
  const emptyDays     = Array.from({ length: startWeekDay });

  const sharedProps = {
    step, serviceId, selectedDate, selectedTime, contact, errors,
    setContact, setSelectedDate, setSelectedTime,
    handleServiceSelect, nextStep, prevStep, goToStep,
    handleContactSubmit, handleConfirm,
    currentMonth, setCurrentMonth,
    daysInMonth, startWeekDay, emptyDays, today, selectedServiceObj,
  };

  /* ── SUCCESS SCREEN ── */
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
        {/* Mobile/Tablet */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition}
          className="lg:hidden bg-white rounded-3xl shadow-sm border border-zinc-200 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-medium text-zinc-900 mb-2">Appointment Confirmed</h1>
          <p className="text-zinc-500 mb-8 text-sm">We can't wait to see you.</p>
          <div className="bg-zinc-50 rounded-2xl p-5 mb-8 text-left space-y-4 border border-zinc-100">
            <div className="flex items-start">
              <Sparkles className="w-4 h-4 text-zinc-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-zinc-900">{selectedServiceObj?.title}</p>
                <p className="text-xs text-zinc-500 mt-0.5">with Dr. Amir Haddad</p>
              </div>
            </div>
            <div className="flex items-start">
              <CalendarIcon className="w-4 h-4 text-zinc-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm text-zinc-900">{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Date not selected'}</p>
                {selectedTime && <p className="text-xs text-zinc-500 mt-0.5">at {selectedTime}</p>}
              </div>
            </div>
          </div>
          <p className="text-zinc-500 leading-relaxed text-xs">
            A confirmation email has been sent to <span className="font-medium text-zinc-800">{contact.email}</span>.
          </p>
        </motion.div>

        {/* Desktop */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={transition}
          className="hidden lg:flex w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-zinc-200/40 overflow-hidden min-h-[28.75rem] border border-zinc-200"
        >
          <div className="w-2/5 relative p-12 flex flex-col justify-center text-white overflow-hidden">
            <img src="/premium_clinic_hero.png" className="absolute inset-0 w-full h-full object-cover z-0" alt="" />
            <div className="absolute inset-0 bg-emerald-950/80 z-0 mix-blend-multiply" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h1 className="text-3xl font-medium tracking-tight mb-3">You're all set.</h1>
              <p className="text-emerald-50/80 text-sm leading-relaxed">Your appointment has been confirmed with BrightSmile Dental. We look forward to seeing you.</p>
            </div>
          </div>
          <div className="flex-1 p-12 flex flex-col justify-center bg-white">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider mb-8">Appointment Summary</h2>
            <div className="space-y-6 mb-10">
              {[
                { Icon: Sparkles,    label: 'Service',   value: selectedServiceObj?.title, sub: 'with Dr. Amir Haddad' },
                { Icon: CalendarIcon, label: 'Date',     value: selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Date not selected', sub: selectedTime ? `at ${selectedTime}` : '' },
                { Icon: Mail,        label: 'Email',     value: contact.email },
              ].map(({ Icon, label, value, sub }) => (
                <div key={label} className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 mr-4 flex-shrink-0 border border-zinc-100">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1">{label}</p>
                    <p className="font-medium text-sm text-zinc-900">{value}</p>
                    {sub && <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-zinc-500 bg-zinc-50 rounded-xl p-5 border border-zinc-100">
              A confirmation email has been sent to <span className="font-medium text-zinc-800">{contact.email}</span>. 
              If you have dental insurance, reply with a photo of your card.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════
          MOBILE / TABLET  (hidden on lg+)
      ══════════════════════════════════════════════════ */}
      <div className="lg:hidden min-h-screen bg-zinc-50 text-zinc-900 font-sans sm:py-12 sm:px-6 flex flex-col items-center">
        {/* Branding */}
        <div className="max-w-md sm:max-w-xl w-full hidden sm:flex items-center justify-center mb-8">
          <Smile className="w-6 h-6 text-emerald-600 mr-2" />
          <h1 className="text-xl font-medium text-zinc-900 tracking-tight">BrightSmile</h1>
        </div>

        <div className="max-w-md sm:max-w-xl w-full bg-white sm:rounded-[2rem] sm:shadow-sm sm:border sm:border-zinc-200 min-h-screen sm:min-h-[43.75rem] flex flex-col overflow-hidden relative">
          <header className="px-6 pt-10 pb-6 flex items-center justify-between bg-white z-10 relative border-b border-zinc-100">
            <div className="flex items-center">
              {step > 1 && (
                <button onClick={prevStep} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-zinc-50 transition-colors text-zinc-600" aria-label="Go back">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className={`font-medium text-lg text-zinc-900 sm:hidden ${step === 1 ? '' : 'ml-2'}`}>BrightSmile</h2>
            </div>
            <div className="text-xs font-medium text-zinc-500 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">Step {step} of 4</div>
          </header>

          <div className="w-full h-1 bg-zinc-50">
            <motion.div 
              className="h-full bg-zinc-900" 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 4) * 100}%` }} 
              transition={{ ease: "circOut", duration: 0.4 }}
            />
          </div>

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-10 relative">
            <WizardContent {...sharedProps} desktop={false} />
          </main>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          DESKTOP  (hidden below lg, full-viewport two-panel)
      ══════════════════════════════════════════════════ */}
      <div className="hidden lg:flex h-screen w-screen overflow-hidden bg-white">

        {/* ── LEFT PANEL: brand / info / step nav ── */}
        <aside className="w-[21.25rem] xl:w-[26.25rem] flex-shrink-0 text-white flex flex-col justify-between p-12 overflow-hidden relative border-r border-zinc-200">
          <img src="/premium_clinic_hero.png" className="absolute inset-0 w-full h-full object-cover z-0" alt="Clinic interior" />
          <div className="absolute inset-0 bg-zinc-950/80 z-0 mix-blend-multiply" />
          
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center mb-16">
              <div className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center mr-4 border border-white/20">
                <Smile className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-medium tracking-tight">BrightSmile</span>
            </div>

            {/* Step nav */}
            <div className="space-y-1">
              {stepLabels.map((label, i) => {
                const num   = i + 1;
                const done  = step > num;
                const active = step === num;
                return (
                  <div key={num} className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all cursor-default
                    ${active ? 'bg-white/10 backdrop-blur-sm border border-white/10' : 'border border-transparent'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-all
                      ${done ? 'bg-emerald-400 text-emerald-950' : active ? 'bg-white text-zinc-900' : 'bg-white/20 text-white/60'}`}>
                      {done ? <CheckCircle className="w-3.5 h-3.5" /> : num}
                    </div>
                    <span className={`text-sm font-medium transition-all ${active ? 'text-white' : done ? 'text-white/80' : 'text-white/40'}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dentist profile teaser */}
          <div className="relative z-10 mt-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 mr-4 flex-shrink-0 bg-zinc-800">
                  <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150" alt="Dr. Amir Haddad" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-medium text-sm text-white">Dr. Amir Haddad</p>
                  <p className="text-zinc-400 text-xs mt-0.5">General & Cosmetic Dentistry</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-emerald-400 fill-emerald-400" />)}
                <span className="text-xs text-zinc-300 ml-2">4.9 · 320+ reviews</span>
              </div>
              <div className="flex items-center text-xs text-zinc-400">
                <MapPin className="w-3.5 h-3.5 mr-2 opacity-70" />
                123 Bright Ave, Medical District
              </div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT PANEL: wizard form ── */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-zinc-50 relative">

          {/* Top bar */}
          <header className="flex-shrink-0 flex items-center justify-between px-16 py-8 bg-transparent z-10">
            <div className="flex items-center gap-4">
              {step > 1 && (
                <button onClick={prevStep} className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-zinc-200/50 transition-colors text-zinc-600 border border-zinc-200" aria-label="Back">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider mr-2">Step {step} of 4</span>
              {[1,2,3,4].map(n => (
                <div key={n} className={`w-1.5 h-1.5 rounded-full transition-all ${n <= step ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
              ))}
            </div>
          </header>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-16 pb-16 pt-4 flex flex-col justify-center">
            <div className="w-full max-w-3xl mx-auto">
              <WizardContent {...sharedProps} desktop={true} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
