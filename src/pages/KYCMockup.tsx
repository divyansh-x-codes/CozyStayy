import React from 'react';
import { 
  Signal, Wifi, Battery, ChevronLeft, Cloud, Lock, Zap, Check, CheckCircle2,
  User, Calendar, ShieldCheck, ArrowRight, Users, Shield
} from 'lucide-react';

const KYCMockup = () => {
  return (
    <div className="min-h-screen bg-[#F4F5F7] py-12 px-4 font-sans text-[#1A1A1A] flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row gap-8 items-center md:items-start justify-center max-w-6xl w-full">
        {/* Left iPhone Screen */}
        <div className="relative w-[393px] h-[852px] bg-white rounded-[56px] shadow-2xl overflow-hidden border-[8px] border-white ring-1 ring-gray-200 shrink-0">
          {/* Dynamic Island / Notch area */}
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center">
            <div className="w-[120px] h-[30px] bg-black rounded-b-3xl"></div>
          </div>
          
          {/* Status Bar */}
          <div className="px-6 pt-3 pb-2 flex justify-between items-center text-sm font-medium z-10 relative">
            <span>9:41</span>
            <div className="flex items-center space-x-1.5">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-5 h-5" />
            </div>
          </div>

          <div className="px-6 pt-4 pb-6 h-full flex flex-col">
            {/* Header / Nav */}
            <div className="flex items-center mb-6">
              <ChevronLeft className="w-6 h-6 mr-3 text-gray-800" />
              <div className="flex-1">
                <div className="flex space-x-1 mb-1.5">
                  <div className="h-1 w-8 bg-[#0B1536] rounded-full"></div>
                  <div className="h-1 w-8 bg-[#0B1536] rounded-full"></div>
                  <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Step 2 of 4 • Verify your ID</p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#0B1536] mb-3 leading-tight">Verify your ID</h1>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              We use DigiLocker to instantly verify your identity. It's secure, fast and paperless.
            </p>

            {/* Main Card */}
            <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex-1 relative flex flex-col">
              
              {/* DigiLocker Brand */}
              <div className="flex items-center mb-5">
                <div className="w-14 h-14 rounded-2xl bg-[#F4EEFF] flex items-center justify-center mr-4 relative">
                  <Cloud className="w-8 h-8 text-[#6A3EEA] fill-[#6A3EEA]" />
                  <div className="absolute bottom-2 right-2 bg-white rounded-full p-0.5">
                    <Shield className="w-3 h-3 text-[#6A3EEA] fill-[#6A3EEA]" />
                  </div>
                </div>
                <div>
                  <h2 className="text-[#6A3EEA] font-bold text-xl">DigiLocker</h2>
                  <p className="text-gray-500 text-xs">Government of India</p>
                </div>
              </div>

              {/* Trust Pills */}
              <div className="flex items-center mb-8">
                <div className="flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  100% Secure • Official • Paperless
                </div>
              </div>

              {/* Feature List */}
              <div className="space-y-6 mb-auto">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#F4EEFF] flex items-center justify-center mr-4 shrink-0 mt-1">
                    <Zap className="w-5 h-5 text-[#6A3EEA]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-[15px]">Instant verification</h3>
                    <p className="text-gray-500 text-[13px] mt-0.5">No manual uploads required</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#F4EEFF] flex items-center justify-center mr-4 shrink-0 mt-1">
                    <Lock className="w-5 h-5 text-[#6A3EEA]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-[15px]">Secure & private</h3>
                    <p className="text-gray-500 text-[13px] mt-0.5">Your data is safe with DigiLocker</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-[#F4EEFF] flex items-center justify-center mr-4 shrink-0 mt-1">
                    <Check className="w-5 h-5 text-[#6A3EEA]" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-[15px]">Accepted by CozyStay</h3>
                    <p className="text-gray-500 text-[13px] mt-0.5">For a safe and verified stay</p>
                  </div>
                </div>
              </div>

              {/* Info Banner */}
              <div className="bg-emerald-50/80 rounded-2xl p-4 flex items-start mt-8 mb-6 border border-emerald-100/50">
                <ShieldCheck className="w-5 h-5 text-emerald-600 mr-3 shrink-0" />
                <p className="text-emerald-800 text-[13px] font-medium leading-snug">
                  Your data is only used for verification and will not be stored.
                </p>
              </div>

              {/* CTA */}
              <button className="w-full bg-[#0B1536] hover:bg-[#152352] transition-colors text-white rounded-[20px] py-4 font-semibold text-[15px] flex justify-center items-center">
                <Cloud className="w-5 h-5 mr-2 fill-current" />
                Continue with DigiLocker
              </button>
              
              {/* Footer Note */}
              <div className="mt-5 flex items-center justify-center text-center text-[12px] text-gray-400 font-medium px-4">
                <Lock className="w-3 h-3 mr-1.5 shrink-0" />
                <p>You will be redirected to DigiLocker<br/>to securely verify your identity.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right iPhone Screen */}
        <div className="relative w-[393px] h-[852px] bg-white rounded-[56px] shadow-2xl overflow-hidden border-[8px] border-white ring-1 ring-gray-200 shrink-0">
          {/* Dynamic Island / Notch area */}
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center">
            <div className="w-[120px] h-[30px] bg-black rounded-b-3xl"></div>
          </div>
          
          {/* Status Bar */}
          <div className="px-6 pt-3 pb-2 flex justify-between items-center text-sm font-medium z-10 relative">
            <span>9:41</span>
            <div className="flex items-center space-x-1.5">
              <Signal className="w-4 h-4" />
              <Wifi className="w-4 h-4" />
              <Battery className="w-5 h-5" />
            </div>
          </div>

          <div className="px-6 pt-4 pb-6 h-full flex flex-col">
            {/* Header / Nav */}
            <div className="flex items-center mb-6">
              <ChevronLeft className="w-6 h-6 mr-3 text-gray-800" />
              <div className="flex-1">
                <div className="flex space-x-1 mb-1.5">
                  <div className="h-1 w-8 bg-[#0B1536] rounded-full"></div>
                  <div className="h-1 w-8 bg-[#0B1536] rounded-full"></div>
                  <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-1 w-8 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">Step 2 of 4 • Verify your ID</p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-[#0B1536] mb-2 leading-tight">Verify your ID</h1>
            <div className="flex items-center text-[12px] font-semibold text-emerald-600 mb-6">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              Verified by DigiLocker
            </div>

            {/* Success Card */}
            <div className="bg-[#F0FDF4] rounded-3xl p-6 border border-emerald-100/50 flex-1 relative flex flex-col items-center pt-10">
              
              {/* Confetti Background effect (simplified) */}
              <div className="absolute top-6 flex space-x-12 opacity-30">
                <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-400 mb-6"></div>
                <div className="w-2 h-2 rounded-full bg-pink-400"></div>
              </div>

              {/* Big Check Icon */}
              <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_8px_30px_rgb(16,185,129,0.2)]">
                <Check className="w-12 h-12 text-white" strokeWidth={3} />
              </div>

              <h2 className="text-[22px] font-bold text-gray-900 mb-2 text-center">Verification Successful!</h2>
              <p className="text-gray-500 text-sm text-center mb-8 px-2">
                Your identity has been verified successfully using DigiLocker.
              </p>

              {/* Inner Details Card */}
              <div className="bg-white rounded-2xl w-full p-5 shadow-sm border border-emerald-50 mb-auto">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500 text-[13px]">
                    <User className="w-4 h-4 mr-3 text-gray-400" />
                    Name
                  </div>
                  <span className="font-semibold text-[14px] text-gray-900">Rahul Sharma</span>
                </div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-500 text-[13px]">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                    Date of Birth
                  </div>
                  <span className="font-semibold text-[14px] text-gray-900">12 May 1995</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-gray-500 text-[13px]">
                    <ShieldCheck className="w-4 h-4 mr-3 text-gray-400" />
                    ID Verified
                  </div>
                  <span className="font-semibold text-[14px] text-emerald-600">Aadhaar Card</span>
                </div>
              </div>

              {/* Success Banner */}
              <div className="w-full bg-emerald-50/80 rounded-2xl p-4 flex items-center mt-6 mb-6 border border-emerald-100/50">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mr-3 shrink-0" />
                <p className="text-emerald-800 text-[13px] font-medium">
                  You can now continue with your booking.
                </p>
              </div>

              {/* CTA */}
              <button className="w-full bg-[#0B1536] hover:bg-[#152352] transition-colors text-white rounded-[20px] py-4 font-semibold text-[15px] flex justify-center items-center">
                Continue to Booking
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              
              {/* Footer Note */}
              <div className="mt-5 flex items-center justify-center text-center text-[12px] text-gray-400 font-medium px-2">
                <Lock className="w-3 h-3 mr-1.5 shrink-0" />
                <p>CozyStay protects your privacy and<br/>ensures a safe stay for everyone.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Feature Cards */}
      <div className="flex flex-col md:flex-row gap-6 mt-12 max-w-[818px] w-full px-4">
        {/* Left Feature Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0B1536] flex items-center justify-center mr-5 shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">For Adults</h3>
            <p className="text-gray-500 text-[13px] leading-snug pr-4">
              Instant Aadhaar/DigiLocker verification. No manual uploads.
            </p>
          </div>
        </div>

        {/* Right Feature Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex-1 flex items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#8B5CF6] flex items-center justify-center mr-5 shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg mb-1">For Minors</h3>
            <p className="text-gray-500 text-[13px] leading-snug pr-4">
              Minor's ID + Guardian verification via DigiLocker.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default KYCMockup;
