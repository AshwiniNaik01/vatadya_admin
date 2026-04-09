import { useState, useEffect } from "react";
import Modal from "../components/modal/Modal";
import Cookies from "js-cookie";
import * as Yup from "yup";
import { loginAdmin, verifyOtp, sendOtp, resetPassword } from "../api/adminApi";

const loginValidationSchema = Yup.object().shape({});

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1600",
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1600",
];

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const [currentBg, setCurrentBg] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [reference, setReference] = useState("");
  const [step, setStep] = useState(1);

  const [newPassword, setNewPassword] = useState("");
  const [showForgotModal, setShowForgotModal] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length);
        setTransitioning(false);
      }, 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const nextBg = (currentBg + 1) % BG_IMAGES.length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (apiError) setApiError("");
    if (validationErrors[name])
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSendOtp = async () => {
    try {
      const res = await sendOtp(email);

      setReference(res.data.reference);
      setStep(2);
      console.log(res);
    } catch (err) {
      alert(err.message || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await verifyOtp(reference, otp);
      setStep(3);
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  const handleResetPassword = async () => {
    try {
      await resetPassword(reference, newPassword);
      alert("Password changed successfully");
      setShowForgotModal(false);
    } catch (err) {
      alert("Reset failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");
    setSuccessMessage("");
    setValidationErrors({});
    try {
      await loginValidationSchema.validate(formData, { abortEarly: false });
      const response = await loginAdmin({
        email: formData.email,
        password: formData.password,
      });
      setSuccessMessage("Login successful! Redirecting...");
      if (response.success && response.data?.admin) {
        const admin = response.data.admin;
        Cookies.set("adminToken", response?.data?.token);
        Cookies.set("adminId", admin._id, { expires: 7 });
        localStorage.setItem("adminData", JSON.stringify(admin));
      }
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      if (error.name === "ValidationError") {
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);
      } else {
        if (error.message) setApiError(error.message);
        else if (error.error) setApiError(error.error);
        else
          setApiError(
            "Login failed. Please check your credentials and try again.",
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.0) translate(0%, 0%); }
          100% { transform: scale(1.12) translate(-2%, -1.5%); }
        }
        .kb-animate { animation: kenBurns 8s ease-in-out forwards; }
      `}</style>

      {/* ── ANIMATED BACKGROUND ── */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {/* Current image */}
        <img
          key={`current-${currentBg}`}
          src={BG_IMAGES[currentBg]}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover kb-animate transition-opacity duration-1000 ${
            transitioning ? "opacity-0" : "opacity-100"
          }`}
        />
        {/* Next image (preloaded beneath) */}
        <img
          key={`next-${nextBg}`}
          src={BG_IMAGES[nextBg]}
          alt=""
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            transitioning ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Dark blur overlay */}
        <div className="absolute inset-0 bg-blue-950/50 backdrop-blur-[10px]" />
      </div>

      {/* Dot indicators */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BG_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setTransitioning(true);
              setTimeout(() => {
                setCurrentBg(i);
                setTransitioning(false);
              }, 1000);
            }}
            className={`rounded-full transition-all duration-500 ${
              i === currentBg
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>

      {/* ── CARD ── */}
      <div className="relative z-10 w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.4),0_0_0_1px_rgba(255,255,255,0.07)]">
        {/* ── LEFT PANEL ── */}
        <div className="hidden lg:flex flex-col justify-between flex-1 bg-gradient-to-br from-blue-900/95 via-blue-700/95 to-blue-600/95 p-12 relative overflow-hidden backdrop-blur-sm">
          {/* Decorative rings */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute top-14 right-8 w-52 h-52 rounded-full border border-white/10" />
          <div className="absolute top-24 right-16 w-32 h-32 rounded-full border border-white/10" />

          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1400"
              alt=""
              className="w-full h-full object-cover opacity-10"
            />
          </div>

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-white/20">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Vatadya
            </span>
          </div>

          {/* Body */}
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight">
              Your Journey
              <br />
              <span className="text-blue-200 font-light">Begins Here</span>
            </h1>
            <p className="text-blue-100/75 text-sm leading-relaxed max-w-xs mb-10">
              Access your trekking adventures, manage expeditions, and explore
              the mountains like never before.
            </p>
            <div className="flex flex-col gap-4">
              {[
                {
                  icon: "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7",
                  label: "340+ Trekking Routes",
                },
                {
                  icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
                  label: "28 Regions Covered",
                },
                {
                  icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z",
                  label: "24/7 Expert Support",
                },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-blue-100"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={icon}
                      />
                    </svg>
                  </div>
                  <span className="text-blue-100/85 text-sm">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="flex-1 lg:flex-none lg:w-[420px] flex flex-col justify-center px-8 md:px-12 py-12 bg-white">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-200">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
            </div>
            <span className="font-bold text-lg text-blue-900">Vatadya</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <span className="text-xs font-semibold text-blue-500 tracking-widest uppercase">
              Admin Portal
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-1 mb-1 tracking-tight">
              Welcome back
            </h2>
            <p className="text-sm text-gray-400">
              Sign in to continue your adventure
            </p>
          </div>

          {/* Success alert */}
          {successMessage && (
            <div className="mb-5 flex items-center gap-3 p-3.5 bg-green-50 border border-green-200 rounded-2xl shadow-sm">
              <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-green-700">
                {successMessage}
              </p>
            </div>
          )}

          {/* Error alert */}
          {apiError && (
            <div className="mb-5 flex items-center gap-3 p-3.5 bg-red-50 border border-red-200 rounded-2xl shadow-sm">
              <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-3.5 h-3.5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-red-700">{apiError}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-3 text-sm border rounded-xl outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.email
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white shadow-sm shadow-gray-100"
                  }`}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                  <svg
                    className="w-3 h-3 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setStep(1);
                  }}
                  className="text-xs text-blue-500 hover:text-blue-700 font-medium transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full pl-10 pr-11 py-3 text-sm border rounded-xl outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                    validationErrors.password
                      ? "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white shadow-sm shadow-gray-100"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1">
                  <svg
                    className="w-3 h-3 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-300 font-medium tracking-wide">
              OR
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Sign up */}
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="/registration"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              Create one now
            </a>
          </p>
        </div>
      </div>
      <Modal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        title="Reset Password"
        size="sm"
      >
        {/* STEP 1 */}
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New password"
              className="w-full border p-2 rounded mb-3"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              onClick={handleResetPassword}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Reset Password
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
