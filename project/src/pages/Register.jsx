import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { USER_ROLES } from '../utils/constants';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { BasicDetailsStep } from '../components/auth/signup/BasicDetailsStep';
import { AadhaarVerificationStep } from '../components/auth/signup/AadhaarVerificationStep';
import { ProfileCompletionStep } from '../components/auth/signup/ProfileCompletionStep';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const Register = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [basicData, setBasicData] = useState(null);
  const [aadhaarData, setAadhaarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const handleBasicNext = (data) => {
    setBasicData(data);
    setStep(2);
    setSubmitError('');
  };

  const handleAadhaarNext = (data) => {
    setAadhaarData(data);
    setStep(3);
    setSubmitError('');
  };

  const handleFinalSubmit = async (profileData) => {
    setLoading(true);
    setSubmitError('');

    try {
      // ✅ FIX: safer payload + no backend-breaking fields
      const finalPayload = {
        username: basicData?.username,
        email: basicData?.email,
        name: basicData?.name,
        phone: basicData?.phone,
        password: basicData?.password,
        confirm_password: basicData?.confirmPassword,
        role: profileData?.role,
      };

      const result = await registerUser(finalPayload);

      if (result?.error) {
        setSubmitError(result.error);
        setLoading(false);
        return;
      }

      if (result?.user) {
        const role = (result.user.role || '').toLowerCase();

        const dashboard =
          role === USER_ROLES.FARMER ? 'farmer-dashboard' : 'labour-dashboard';

        navigate(`/${dashboard}`);
      } else {
        setSubmitError('Registration successful but user data is missing.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: t('Basic Details') },
    { number: 2, label: t('Verification') },
    { number: 3, label: t('Profile') },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-800">
        <div className="absolute inset-0">
          <img
            src="/images/signup-hero.png"
            alt="Agriculture"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-lg">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-green-600 flex items-center justify-center mb-4">
              <Sparkles className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold">{t('Create Your Account')}</h1>
          </div>

          {/* Steps */}
          <div className="flex justify-between mb-8">
            {steps.map((s) => (
              <div key={s.number} className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= s.number ? 'bg-green-600 text-white' : 'bg-gray-300'
                  }`}
                >
                  {step > s.number ? <CheckCircle2 /> : s.number}
                </div>
                <span className="text-xs mt-2">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Error */}
          {submitError && (
            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">
              {submitError}
            </div>
          )}

          {/* Forms */}
          <AnimatePresence mode="wait">
            {step === 1 && (
              <BasicDetailsStep onNext={handleBasicNext} />
            )}

            {step === 2 && (
              <AadhaarVerificationStep
                onNext={handleAadhaarNext}
                onBack={() => setStep(1)}
              />
            )}

            {step === 3 && (
              <ProfileCompletionStep
                onSubmit={handleFinalSubmit}
                onBack={() => setStep(2)}
                loading={loading}
              />
            )}
          </AnimatePresence>

          {/* Login link */}
          <div className="text-center mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 font-semibold">
              Sign in <ArrowRight className="inline w-4 h-4" />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;