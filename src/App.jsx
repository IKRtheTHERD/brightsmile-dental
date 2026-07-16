import React, { useState } from 'react';
import { 
  ChevronLeft, Calendar as CalendarIcon, Clock, Phone, Mail,
  CheckCircle, Sparkles, Smile, Shield, Syringe, Activity, AlertCircle, Edit2, ChevronRight, ChevronLeft as ChevronLeftIcon, Star, MapPin, Award
} from 'lucide-react';
import { 
  format, isBefore, startOfDay, isSameDay, 
  startOfMonth, endOfMonth, eachDayOfInterval, getDay, addMonths, subMonths, isToday
} from 'date-fns';

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
    ? 'w-full bg-sage-600 hover:bg-sage-700 text-white min-h-[52px] text-base font-semibold rounded-xl shadow-lg shadow-sage-300/40 transition-all active:scale-[0.98]'
    : 'w-full bg-sage-600 hover:bg-sage-700 text-white min-h-[56px] text-lg font-medium rounded-2xl shadow-lg shadow-sage-200 transition-all active:scale-[0.98]';

  return (
    <>
      {/* STEP 1 */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className={`font-semibold text-gray-800 tracking-tight mb-1 ${desktop ? 'text-2xl' : 'text-3xl'}`}>
            What brings you in?
          </h2>
          <p className={`text-sage-600 mb-6 ${desktop ? 'text-sm' : 'text-lg'}`}>Select a service to get started.</p>
          <div className={`grid gap-3 ${desktop ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
            {services.map(service => {
              const Icon = service.icon;
              const isSel = serviceId === service.id;
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 flex items-center group
                    ${isSel ? 'border-sage-500 bg-sage-50/70 shadow-md shadow-sage-100' : 'border-sage-100 hover:border-sage-300 hover:bg-sage-50/30'}`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 transition-colors
                    ${isSel ? 'bg-sage-500 text-white' : 'bg-sage-100 text-sage-600 group-hover:bg-sage-200'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-800">{service.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{service.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className={`animate-slide-up ${desktop ? '' : 'pb-24'}`}>
          <h2 className={`font-semibold text-gray-800 tracking-tight mb-1 ${desktop ? 'text-2xl' : 'text-3xl'}`}>
            Pick a time
          </h2>
          <p className={`text-sage-600 mb-5 ${desktop ? 'text-sm' : 'text-lg'}`}>Select a date and time that works.</p>

          <div className={`bg-white rounded-2xl border border-sage-100 shadow-sm mb-5 ${desktop ? 'p-4' : 'p-5'}`}>
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                disabled={isBefore(startOfMonth(currentMonth), startOfMonth(today))}
                className="p-2 rounded-full hover:bg-sage-50 disabled:opacity-30 transition-colors"
              >
                <ChevronLeftIcon className="w-4 h-4 text-gray-600" />
              </button>
              <h3 className="font-semibold text-sm text-gray-800">{format(currentMonth, 'MMMM yyyy')}</h3>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-full hover:bg-sage-50 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">{d}</div>
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
                    className={`aspect-square rounded-full flex items-center justify-center text-xs font-medium transition-all
                      ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-sage-100 text-gray-700'}
                      ${isSel  ? 'bg-sage-500 text-white hover:bg-sage-600 shadow-md' : ''}
                      ${isTod && !isSel ? 'border-2 border-sage-200 text-sage-700' : ''}`}
                  >
                    {format(date, 'd')}
                  </button>
                );
              })}
            </div>
          </div>

          {selectedDate && (
            <div className="animate-fade-in">
              <h3 className="font-medium text-xs text-gray-500 uppercase tracking-wider mb-3 flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-sage-500" />
                Available on {format(selectedDate, 'MMM d')}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                {availableTimeSlots.map(time => {
                  const isSel = selectedTime === time;
                  return (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`min-h-[44px] py-2 px-1 rounded-xl text-xs font-medium transition-all border-2
                        ${isSel ? 'bg-sage-500 border-sage-500 text-white shadow-md' : 'bg-white border-sage-100 text-gray-700 hover:border-sage-300 hover:bg-sage-50/50'}`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {selectedDate && selectedTime && (
            desktop ? (
              <div className="mt-6">
                <button onClick={nextStep} className={btnBase}>Continue →</button>
              </div>
            ) : (
              <div className="fixed sm:absolute bottom-0 left-0 right-0 p-6 sm:px-10 bg-gradient-to-t from-white via-white to-transparent pb-8 pt-12 animate-slide-up z-20 sm:rounded-b-[2.5rem]">
                <button onClick={nextStep} className={btnBase}>Continue</button>
              </div>
            )
          )}
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className={`animate-slide-up ${desktop ? '' : 'pb-24'}`}>
          <h2 className={`font-semibold text-gray-800 tracking-tight mb-1 ${desktop ? 'text-2xl' : 'text-3xl'}`}>
            Your details
          </h2>
          <p className={`text-sage-600 mb-5 ${desktop ? 'text-sm' : 'text-lg'}`}>We just need a few details to confirm.</p>

          <div className="space-y-4">
            {[
              { id: 'name',  label: 'Full Name',     type: 'text',  placeholder: 'Jane Doe',          key: 'name'  },
              { id: 'phone', label: 'Phone Number',  type: 'tel',   placeholder: '(555) 123-4567',    key: 'phone' },
              { id: 'email', label: 'Email Address', type: 'email', placeholder: 'jane@example.com',  key: 'email' },
            ].map(field => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                <input
                  id={field.id}
                  type={field.type}
                  value={contact[field.key]}
                  onChange={e => setContact({ ...contact, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  className={`w-full min-h-[48px] px-4 rounded-xl border-2 text-base bg-white transition-colors focus:outline-none focus:ring-4 focus:ring-sage-100
                    ${errors[field.key] ? 'border-red-300 focus:border-red-400' : 'border-sage-200 focus:border-sage-400 hover:border-sage-300'}`}
                />
                {errors[field.key] && <p className="mt-1 text-red-500 text-xs animate-fade-in">{errors[field.key]}</p>}
              </div>
            ))}
          </div>

          {desktop ? (
            <div className="mt-6">
              <button onClick={handleContactSubmit} className={btnBase}>Continue →</button>
            </div>
          ) : (
            <div className="fixed sm:absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pb-8 pt-12 z-20 rounded-b-[2.5rem]">
              <button onClick={handleContactSubmit} className={btnBase}>Continue</button>
            </div>
          )}
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <div className={`animate-slide-up ${desktop ? '' : 'pb-32'}`}>
          <h2 className={`font-semibold text-gray-800 tracking-tight mb-1 ${desktop ? 'text-2xl' : 'text-3xl'}`}>
            Review & Confirm
          </h2>
          <p className={`text-sage-600 mb-5 ${desktop ? 'text-sm' : 'text-lg'}`}>Make sure everything looks correct.</p>

          <div className="bg-white border-2 border-sage-100 rounded-2xl overflow-hidden shadow-sm mb-5">
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
                <div key={i} className={`p-4 flex justify-between items-center group hover:bg-sage-50/30 transition-colors ${i < arr.length - 1 ? 'border-b border-sage-50' : ''}`}>
                  <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-sage-100 flex items-center justify-center text-sage-600 mr-3 overflow-hidden flex-shrink-0 border border-sage-200">
                      {row.imgSrc && <img src={row.imgSrc} alt="" className="w-full h-full object-cover" />}
                      {Icon && <Icon className="w-4 h-4" />}
                      {IconComp && <IconComp className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">{row.label}</p>
                      <p className="text-sm font-medium text-gray-800">{row.value}</p>
                      {row.sub && <p className="text-xs text-gray-500">{row.sub}</p>}
                    </div>
                  </div>
                  {row.onEdit && (
                    <button onClick={row.onEdit} className="p-1.5 text-sage-500 hover:bg-sage-100 rounded-full transition-colors">
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {desktop ? (
            <button onClick={handleConfirm} className={`${btnBase} flex items-center justify-center`}>
              <CheckCircle className="w-5 h-5 mr-2" />
              Confirm Appointment
            </button>
          ) : (
            <div className="fixed sm:absolute bottom-0 left-0 right-0 p-6 sm:px-10 bg-gradient-to-t from-white via-white to-transparent pb-8 pt-12 z-20 sm:rounded-b-[2.5rem]">
              <button onClick={handleConfirm} className={`${btnBase} flex items-center justify-center`}>
                <CheckCircle className="w-6 h-6 mr-2" />
                Confirm Appointment
              </button>
            </div>
          )}
        </div>
      )}
    </>
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

  const handleServiceSelect = (id) => { setServiceId(id); setTimeout(nextStep, 150); };

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
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 flex items-center justify-center p-6 animate-fade-in">
        {/* Mobile/Tablet */}
        <div className="lg:hidden bg-white rounded-3xl shadow-xl shadow-sage-200/50 p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-pop-in">
            <CheckCircle className="w-10 h-10 text-sage-600" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Appointment Confirmed!</h1>
          <p className="text-sage-600 mb-8 text-lg">We can't wait to see you.</p>
          <div className="bg-sage-50 rounded-2xl p-5 mb-8 text-left space-y-3">
            <div className="flex items-start">
              <Sparkles className="w-5 h-5 text-sage-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">{selectedServiceObj?.title}</p>
                <p className="text-sm text-gray-500">with Dr. Amir Haddad</p>
              </div>
            </div>
            <div className="flex items-start">
              <CalendarIcon className="w-5 h-5 text-sage-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-800">{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</p>
                <p className="text-sm text-gray-500">at {selectedTime}</p>
              </div>
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            A confirmation email has been sent to <span className="font-medium text-gray-800">{contact.email}</span>.
            If you have dental insurance, you can reply with a photo of your card.
          </p>
        </div>

        {/* Desktop */}
        <div className="hidden lg:flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl shadow-sage-200/50 overflow-hidden min-h-[480px]">
          <div className="w-2/5 bg-gradient-to-br from-sage-600 to-sage-800 p-12 flex flex-col justify-center text-white">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6 animate-pop-in">
              <CheckCircle className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-3">You're all set!</h1>
            <p className="text-sage-200 text-lg leading-relaxed">Your appointment has been confirmed with BrightSmile Dental.</p>
          </div>
          <div className="flex-1 p-12 flex flex-col justify-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Appointment Summary</h2>
            <div className="space-y-4 mb-8">
              {[
                { Icon: Sparkles,    label: 'Service',   value: selectedServiceObj?.title, sub: 'with Dr. Amir Haddad' },
                { Icon: CalendarIcon, label: 'Date',     value: selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy'), sub: `at ${selectedTime}` },
                { Icon: Mail,        label: 'Email',     value: contact.email },
              ].map(({ Icon, label, value, sub }) => (
                <div key={label} className="flex items-start">
                  <div className="w-9 h-9 rounded-xl bg-sage-50 flex items-center justify-center text-sage-600 mr-4 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="font-medium text-gray-800">{value}</p>
                    {sub && <p className="text-sm text-gray-500">{sub}</p>}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 bg-sage-50 rounded-xl p-4">
              A confirmation email has been sent to <span className="font-medium text-gray-700">{contact.email}</span>. 
              If you have dental insurance, reply with a photo of your card.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* ══════════════════════════════════════════════════
          MOBILE / TABLET  (hidden on lg+)
      ══════════════════════════════════════════════════ */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-sage-50 to-sage-100 text-gray-800 font-sans sm:py-12 sm:px-6 flex flex-col items-center">
        {/* Branding */}
        <div className="max-w-md sm:max-w-2xl w-full hidden sm:flex items-center justify-center mb-8">
          <Smile className="w-8 h-8 text-sage-600 mr-2" />
          <h1 className="text-2xl font-semibold text-sage-800 tracking-tight">BrightSmile Dental</h1>
        </div>

        <div className="max-w-md sm:max-w-2xl w-full bg-white sm:rounded-[2.5rem] sm:shadow-xl sm:shadow-sage-200/40 min-h-screen sm:min-h-[700px] flex flex-col overflow-hidden relative">
          <header className="px-6 pt-10 pb-6 flex items-center justify-between bg-white z-10 relative">
            <div className="flex items-center">
              {step > 1 && (
                <button onClick={prevStep} className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center hover:bg-sage-50 transition-colors text-sage-600" aria-label="Go back">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <h2 className={`font-semibold text-xl text-sage-800 sm:hidden ${step === 1 ? '' : 'ml-2'}`}>BrightSmile</h2>
            </div>
            <div className="text-sm font-medium text-sage-500 bg-sage-50 px-3 py-1 rounded-full">Step {step} of 4</div>
          </header>

          <div className="w-full h-1.5 bg-sage-50">
            <div className="h-full bg-sage-400 transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }} />
          </div>

          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-10 relative">
            <WizardContent {...sharedProps} desktop={false} />
          </main>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════
          DESKTOP  (hidden below lg, full-viewport two-panel)
      ══════════════════════════════════════════════════ */}
      <div className="hidden lg:flex h-screen w-screen overflow-hidden bg-gray-50">

        {/* ── LEFT PANEL: brand / info / step nav ── */}
        <aside className="w-[340px] xl:w-[400px] flex-shrink-0 bg-gradient-to-br from-sage-700 to-sage-900 text-white flex flex-col justify-between p-10 overflow-hidden relative">
          {/* subtle decorative circles */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -right-10 w-72 h-72 bg-white/5 rounded-full" />

          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center mb-12">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
                <Smile className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">BrightSmile Dental</span>
            </div>

            {/* Step nav */}
            <div className="space-y-1">
              {stepLabels.map((label, i) => {
                const num   = i + 1;
                const done  = step > num;
                const active = step === num;
                return (
                  <div key={num} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-default
                    ${active ? 'bg-white/15' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all
                      ${done ? 'bg-green-400 text-white' : active ? 'bg-white text-sage-700' : 'bg-white/20 text-white/60'}`}>
                      {done ? <CheckCircle className="w-4 h-4" /> : num}
                    </div>
                    <span className={`text-sm font-medium transition-all ${active ? 'text-white' : done ? 'text-sage-200' : 'text-white/50'}`}>
                      {label}
                    </span>
                    {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dentist profile teaser */}
          <div className="relative z-10">
            <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30 mr-3 flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150&h=150" alt="Dr. Amir Haddad" className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Dr. Amir Haddad</p>
                  <p className="text-sage-300 text-xs">General & Cosmetic Dentistry</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                <span className="text-xs text-sage-200 ml-1">4.9 · 320+ reviews</span>
              </div>
              <div className="flex items-center text-xs text-sage-300">
                <MapPin className="w-3 h-3 mr-1" />
                123 Bright Ave, Medical District
              </div>
            </div>
          </div>
        </aside>

        {/* ── RIGHT PANEL: wizard form ── */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">

          {/* Top bar */}
          <header className="flex-shrink-0 flex items-center justify-between px-10 py-5 bg-white border-b border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button onClick={prevStep} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-sage-50 transition-colors text-sage-600 border border-sage-100" aria-label="Back">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Step {step} of 4</p>
                <p className="text-sm font-semibold text-gray-700">{stepLabels[step - 1]}</p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="flex-1 mx-10">
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-sage-500 rounded-full transition-all duration-500 ease-out" style={{ width: `${(step / 4) * 100}%` }} />
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {[1,2,3,4].map(n => (
                <div key={n} className={`w-2 h-2 rounded-full transition-all ${n <= step ? 'bg-sage-500' : 'bg-gray-200'}`} />
              ))}
            </div>
          </header>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto px-10 xl:px-16 py-8">
            <div className="max-w-2xl mx-auto">
              <WizardContent {...sharedProps} desktop={true} />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
