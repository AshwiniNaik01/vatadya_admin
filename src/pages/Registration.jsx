// import React, { useState } from "react";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaMountain,
// } from "react-icons/fa";
// import { registerAdmin } from "../api/adminApi";

// export default function Registration() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [touched, setTouched] = useState({});
//   const [isLoading, setIsLoading] = useState(false);
//   const [apiError, setApiError] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }

//     // Clear API error when user starts typing
//     if (apiError) {
//       setApiError("");
//     }
//   };

//   const handleBlur = (field) => {
//     setTouched((prev) => ({ ...prev, [field]: true }));
//     validateField(field);
//   };

//   const validateField = (field) => {
//     let newErrors = { ...errors };

//     switch (field) {
//       case "fullName":
//         if (formData.fullName.trim().length < 2) {
//           newErrors.fullName = "Please enter your full name";
//         } else {
//           delete newErrors.fullName;
//         }
//         break;
//       case "email":
//         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         if (!emailRegex.test(formData.email)) {
//           newErrors.email = "Please enter a valid email address";
//         } else {
//           delete newErrors.email;
//         }
//         break;
//       case "password":
//         if (formData.password.length < 8) {
//           newErrors.password = "Password must be at least 8 characters";
//         } else {
//           delete newErrors.password;
//         }
//         break;
//       case "confirmPassword":
//         if (formData.password !== formData.confirmPassword) {
//           newErrors.confirmPassword = "Passwords do not match";
//         } else {
//           delete newErrors.confirmPassword;
//         }
//         break;
//       default:
//         break;
//     }

//     setErrors(newErrors);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Clear previous messages
//     setApiError("");
//     setSuccessMessage("");

//     setTouched({
//       fullName: true,
//       email: true,
//       password: true,
//       confirmPassword: true,
//     });

//     const newErrors = {};
//     if (formData.fullName.trim().length < 2)
//       newErrors.fullName = "Please enter your full name";
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
//       newErrors.email = "Please enter a valid email";
//     if (formData.password.length < 8)
//       newErrors.password = "Password must be at least 8 characters";
//     if (formData.password !== formData.confirmPassword)
//       newErrors.confirmPassword = "Passwords do not match";

//     setErrors(newErrors);

//     if (Object.keys(newErrors).length === 0) {
//       setIsLoading(true);

//       try {
//         // Create FormData object for API
//         const registrationData = new FormData();
//         registrationData.append("fullName", formData.fullName);
//         registrationData.append("email", formData.email);
//         registrationData.append("password", formData.password);

//         // Call the API
//         const response = await registerAdmin(registrationData);

//         // Handle successful registration
//         setSuccessMessage("Registration successful! Welcome to the adventure!");

//         // Reset form
//         setFormData({
//           fullName: "",
//           email: "",
//           password: "",
//           confirmPassword: "",
//         });
//         setTouched({});

//         // Optional: Redirect to login page after 2 seconds
//         // setTimeout(() => {
//         //   window.location.href = "/login";
//         // }, 2000);
//       } catch (error) {
//         // Handle API errors
//         console.error("Registration error:", error);

//         if (error.message) {
//           setApiError(error.message);
//         } else if (error.error) {
//           setApiError(error.error);
//         } else {
//           setApiError("Registration failed. Please try again later.");
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
//       {/* Registration Card */}
//       <div className="w-full max-w-md bg-linear-to-b from-blue-800/40 to-blue-900/40 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-700/50">
//         {/* Logo */}
//         <div className="flex justify-center mb-6">
//           <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
//             <FaMountain className="text-white text-2xl" />
//           </div>
//         </div>

//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Start Your Journey
//           </h1>
//           <p className="text-blue-200 text-sm">
//             Create an account to explore the peaks
//           </p>
//         </div>

//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
//             <p className="text-blue-200 text-sm text-center">
//               {successMessage}
//             </p>
//           </div>
//         )}

//         {/* Error Message */}
//         {apiError && (
//           <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
//             <p className="text-red-200 text-sm text-center">{apiError}</p>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Full Name */}
//           <div>
//             <label
//               htmlFor="fullName"
//               className="block text-sm font-medium text-white mb-2"
//             >
//               Full Name
//             </label>
//             <div className="relative">
//               <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />
//               <input
//                 type="text"
//                 id="fullName"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 onBlur={() => handleBlur("fullName")}
//                 placeholder="Enter your full name"
//                 disabled={isLoading}
//                 className="w-full pl-11 pr-4 py-3.5 bg-blue-700/30 border-2 border-amber-500/40 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:border-amber-400 focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//             {touched.fullName && errors.fullName && (
//               <p className="text-red-300 text-xs mt-1.5">{errors.fullName}</p>
//             )}
//           </div>

//           {/* Email Address */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-white mb-2"
//             >
//               Email Address
//             </label>
//             <div className="relative">
//               <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 onBlur={() => handleBlur("email")}
//                 placeholder="your.email@example.com"
//                 disabled={isLoading}
//                 className="w-full pl-11 pr-4 py-3.5 bg-blue-700/30 border-2 border-amber-500/40 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:border-amber-400 focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//             </div>
//             {touched.email && errors.email && (
//               <p className="text-red-300 text-xs mt-1.5">{errors.email}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-white mb-2"
//             >
//               Password
//             </label>
//             <div className="relative">
//               <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 onBlur={() => handleBlur("password")}
//                 placeholder="Create a strong password"
//                 disabled={isLoading}
//                 className="w-full pl-11 pr-12 py-3.5 bg-blue-700/30 border-2 border-amber-500/40 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:border-amber-400 focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 disabled={isLoading}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors disabled:opacity-50"
//               >
//                 {showPassword ? (
//                   <FaEyeSlash className="text-sm" />
//                 ) : (
//                   <FaEye className="text-sm" />
//                 )}
//               </button>
//             </div>
//             {touched.password && errors.password && (
//               <p className="text-red-300 text-xs mt-1.5">{errors.password}</p>
//             )}
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label
//               htmlFor="confirmPassword"
//               className="block text-sm font-medium text-white mb-2"
//             >
//               Confirm Password
//             </label>
//             <div className="relative">
//               <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 onBlur={() => handleBlur("confirmPassword")}
//                 placeholder="Re-enter your password"
//                 disabled={isLoading}
//                 className="w-full pl-11 pr-12 py-3.5 bg-blue-700/30 border-2 border-amber-500/40 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:border-amber-400 focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 disabled={isLoading}
//                 className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors disabled:opacity-50"
//               >
//                 {showConfirmPassword ? (
//                   <FaEyeSlash className="text-sm" />
//                 ) : (
//                   <FaEye className="text-sm" />
//                 )}
//               </button>
//             </div>
//             {touched.confirmPassword && errors.confirmPassword && (
//               <p className="text-red-300 text-xs mt-1.5">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={isLoading}
//             className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
//           >
//             {isLoading ? "Creating Account..." : "Create Account"}
//           </button>
//         </form>

//         {/* Divider */}
//         <div className="relative my-6">
//           <div className="absolute inset-0 flex items-center">
//             <div className="w-full border-t border-blue-600/50"></div>
//           </div>
//           <div className="relative flex justify-center text-sm">
//             <span className="px-4 bg-transparent text-blue-300">or</span>
//           </div>
//         </div>

//         {/* Sign In Link */}
//         <p className="text-center text-blue-200 text-sm">
//           Already have an account?{" "}
//           <a
//             href="/"
//             className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
//           >
//             Sign In
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

import React, { useState } from "react";
import * as Yup from "yup";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaMountain,
} from "react-icons/fa";
import { registerAdmin } from "../api/adminApi";

const registrationValidationSchema = Yup.object().shape({
  // Full Name validation - must be at least 2 characters
  // fullName: Yup.string()
  //   .min(2, "Full name must be at least 2 characters")
  //   .max(50, "Full name must not exceed 50 characters")
  //   .required("Full name is required")
  //   .matches(
  //     /^[a-zA-Z\s]+$/,
  //     "Full name should only contain letters and spaces",
  //   ),

  // // Email validation - must be valid email format
  // email: Yup.string()
  //   .email("Please enter a valid email address")
  //   .required("Email is required"),

  // // Password validation - minimum 8 characters with complexity requirements
  // password: Yup.string()
  //   .min(8, "Password must be at least 8 characters")
  //   .max(100, "Password must not exceed 100 characters")
  //   .matches(
  //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  //     "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  //   )
  //   .required("Password is required"),

  // // Confirm Password validation - must match password field
  // confirmPassword: Yup.string()
  //   .oneOf([Yup.ref("password"), null], "Passwords do not match")
  //   .required("Please confirm your password"),
});

export default function Registration() {
  // Form data state - stores all form field values
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation errors from Yup schema
  const [validationErrors, setValidationErrors] = useState({});

  // Loading state for API calls
  const [isLoading, setIsLoading] = useState(false);

  // API error messages (from server)
  const [apiError, setApiError] = useState("");

  // Success message after successful registration
  const [successMessage, setSuccessMessage] = useState("");

  /**
   * Handle input field changes
   * Updates form data state and clears relevant errors
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update form data
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Clear API error when user starts typing
    if (apiError) {
      setApiError("");
    }
  };

  /**
   * Handle form submission
   * Validates data with Yup schema and makes API call if valid
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setApiError("");
    setSuccessMessage("");
    setValidationErrors({});
    setIsLoading(true);

    try {
      // Step 1: Validate form data using Yup schema
      // abortEarly: false ensures all errors are collected, not just the first one
      await registrationValidationSchema.validate(formData, {
        abortEarly: false,
      });

      // Step 2: If validation passes, prepare data for API
     const response = await registerAdmin({
  name: formData.fullName, // map fullName → name
  email: formData.email,
  password: formData.password,
});
      // Step 4: Handle successful registration
      setSuccessMessage("Registration successful! Welcome to the adventure!");

      // Step 5: Reset form to initial state
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      // Optional: Redirect to login page after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    } catch (error) {
      // Handle Yup validation errors
      if (error.name === "ValidationError") {
        // Create an object with field names as keys and error messages as values
        const errors = {};
        error.inner.forEach((err) => {
          errors[err.path] = err.message;
        });
        setValidationErrors(errors);
      } else {
        // Handle API errors (from server)
        console.error("Registration error:", error);

        if (error.message) {
          setApiError(error.message);
        } else if (error.error) {
          setApiError(error.error);
        } else {
          setApiError("Registration failed. Please try again later.");
        }
      }
    } finally {
      // Always set loading to false, whether success or error
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
      {/* Registration Card Container */}
      <div className="w-full max-w-md bg-linear-to-b from-blue-800/40 to-blue-900/40 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-700/50">
        {/* Logo Section */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
            <FaMountain className="text-white text-2xl" />
          </div>
        </div>

        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Start Your Journey
          </h1>
          <p className="text-blue-200 text-sm">
            Create an account to explore the peaks
          </p>
        </div>

        {/* Success Message Display */}
        {successMessage && (
          <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
            <p className="text-blue-200 text-sm text-center">
              {successMessage}
            </p>
          </div>
        )}

        {/* API Error Message Display */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-200 text-sm text-center">{apiError}</p>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name Input Field */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-white mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              {/* Icon */}
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />

              {/* Input */}
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                disabled={isLoading}
                className={`w-full pl-11 pr-4 py-3.5 bg-blue-700/30 border-2 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.fullName
                  ? "border-red-500 focus:border-red-500"
                  : "border-amber-500/40 focus:border-amber-400"
                  }`}
              />
            </div>

            {/* Validation Error Message */}
            {validationErrors.fullName && (
              <p className="text-red-300 text-xs mt-1.5 font-medium">
                {validationErrors.fullName}
              </p>
            )}
          </div>

          {/* Email Address Input Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              {/* Icon */}
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />

              {/* Input */}
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                disabled={isLoading}
                className={`w-full pl-11 pr-4 py-3.5 bg-blue-700/30 border-2 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.email
                  ? "border-red-500 focus:border-red-500"
                  : "border-amber-500/40 focus:border-amber-400"
                  }`}
              />
            </div>

            {/* Validation Error Message */}
            {validationErrors.email && (
              <p className="text-red-300 text-xs mt-1.5 font-medium">
                {validationErrors.email}
              </p>
            )}
          </div>

          {/* Password Input Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2"
            >
              Password
            </label>
            <div className="relative">
              {/* Icon */}
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />

              {/* Input */}
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                disabled={isLoading}
                className={`w-full pl-11 pr-12 py-3.5 bg-blue-700/30 border-2 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.password
                  ? "border-red-500 focus:border-red-500"
                  : "border-amber-500/40 focus:border-amber-400"
                  }`}
              />

              {/* Password visibility toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors disabled:opacity-50"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-sm" />
                ) : (
                  <FaEye className="text-sm" />
                )}
              </button>
            </div>

            {/* Validation Error Message */}
            {validationErrors.password && (
              <p className="text-red-300 text-xs mt-1.5 font-medium">
                {validationErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input Field */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              {/* Icon */}
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />

              {/* Input */}
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                disabled={isLoading}
                className={`w-full pl-11 pr-12 py-3.5 bg-blue-700/30 border-2 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${validationErrors.confirmPassword
                  ? "border-red-500 focus:border-red-500"
                  : "border-amber-500/40 focus:border-amber-400"
                  }`}
              />

              {/* Password visibility toggle button */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-200 transition-colors disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="text-sm" />
                ) : (
                  <FaEye className="text-sm" />
                )}
              </button>
            </div>

            {/* Validation Error Message */}
            {validationErrors.confirmPassword && (
              <p className="text-red-300 text-xs mt-1.5 font-medium">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-600/50"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-blue-300">or</span>
          </div>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-blue-200 text-sm">
          Already have an account?{" "}
          <a
            href="/"
            className="text-blue-400 font-semibold hover:text-blue-300 transition-colors"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
