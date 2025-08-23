import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from '@/routes/hooks';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import { resendOtp, validateRequestOtp } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';

export default function Otp() {
  const [otp, setOtp] = useState(Array(4).fill(''));
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isCooldownActive, setIsCooldownActive] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const email = localStorage.getItem('tp_otp_email');

  // Input Handlers (unchanged)
  const handleKeyDown = (e) => {
    const index = inputRefs.current.indexOf(e.target);

    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== 'Backspace' &&
      e.key !== 'Delete' &&
      e.key !== 'Tab' &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === 'Backspace' || e.key === 'Delete') {
      setOtp((prevOtp) => {
        const updatedOtp = [...prevOtp];
        updatedOtp[index] = '';
        return updatedOtp;
      });

      if (e.key === 'Backspace' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (target.value) {
      setOtp((prevOtp) => [
        ...prevOtp.slice(0, index),
        target.value,
        ...prevOtp.slice(index + 1)
      ]);
      if (index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split('');
    setOtp(digits);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (!email) {
      router.push('/forgot-password');
      return;
    }
    const result: any = await dispatch(
      validateRequestOtp({ email, otp: otpCode })
    );
    if (result?.payload?.success) {
      const decoded = jwtDecode(result?.payload?.data?.resetToken);
      localStorage.setItem(
        'tp_user_data',
        JSON.stringify({ ...decoded, token: result?.payload?.data?.resetToken })
      );
      router.push('/new-password');
    } else {
      setError('Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      await dispatch(resendOtp({ email }));
      setResendCooldown(30);
      setIsCooldownActive(true);
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    }
  };

  useEffect(() => {
    let timer;
    if (isCooldownActive && resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (resendCooldown === 0) {
      setIsCooldownActive(false);
    }
    return () => clearTimeout(timer);
  }, [isCooldownActive, resendCooldown]);

  return (
    <div
      className="relative flex h-screen w-full items-center justify-between bg-cover bg-center"
      style={{
        backgroundImage: "url('/login.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-black/50" />

      {/* Left Side - Branded Content */}
      <div className="relative z-10 ml-16 flex w-full  flex-col items-start justify-center p-6 lg:p-12">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-4xl font-bold text-white">
            University Management
          </span>
        </div>

        <div className="text-left text-white">
          <p className="mb-1 text-lg font-medium">VERIFICATION</p>
          <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
            Enter Your Code
          </h1>
          <p className="mb-6 max-w-xs text-sm text-gray-100">
            We've sent a 4-digit code to <strong>{email}</strong>. Enter it below to continue.
          </p>
        </div>

        {/* Navigation Tabs */}
        {/* <div className="flex overflow-hidden rounded-lg border border-gray-300 shadow-sm">
          <Link
            to="/login"
            className="flex-1 bg-transparent px-6 py-3 text-center font-medium text-white transition-colors duration-200 hover:bg-white/20"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="flex-1 bg-white px-6 py-3 text-center font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
          >
            Register
          </Link>
        </div> */}
      </div>

      {/* Right Side - OTP Form */}
      <div className="relative z-10 flex h-full w-full items-center justify-end p-6 lg:p-12">
        <Card className="w-full max-w-md rounded-xl border-none bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Verify OTP</h2>
            <p className="mt-2 text-sm text-gray-600">Enter the 4-digit code</p>
          </div>

          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

          {/* OTP Inputs */}
          <form
            id="otp-form"
            className="flex justify-between gap-2"
            onSubmit={handleOtpSubmit}
          >
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onPaste={handlePaste}
                ref={(el) => (inputRefs.current[index] = el)}
                className="flex h-12 w-12 items-center justify-center rounded-lg border border-gray-400 bg-white text-center text-xl font-medium shadow-sm outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed sm:h-14 sm:w-14 sm:text-2xl"
                disabled={isCooldownActive || otp.some(d => d === '')}
              />
            ))}
          </form>

          {/* Verify Button */}
          <Button
            disabled={otp.some((digit) => digit === '') || isCooldownActive}
            onClick={handleOtpSubmit}
            className="mt-6 w-full bg-theme text-white hover:bg-theme/90 disabled:opacity-70"
          >
            {isCooldownActive ? 'Verifying...' : 'Verify OTP'}
          </Button>

          {/* Resend OTP */}
          <div className="mt-6 flex items-center justify-center space-x-1 text-sm">
            <span className="text-muted-foreground">Didn't receive the code?</span>
            <button
              type="button"
              className={`font-medium ${isCooldownActive ? 'cursor-not-allowed opacity-70' : 'text-theme hover:text-theme/90'}`}
              onClick={handleResendOtp}
              disabled={isCooldownActive}
            >
              {isCooldownActive ? (
                <span className="flex items-center justify-center">
                  <svg className="mr-1 h-3 w-3 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Resend in {resendCooldown}s
                </span>
              ) : (
                <span className="text-theme">Resend code</span>
              )}
            </button>
          </div>

          {/* Back to Forgot Password */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="text-sm text-gray-600 hover:text-theme "
            >
              ← Back to login
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}