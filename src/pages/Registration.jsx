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

// ====================================================================================================

// import React, { useState } from "react";
// import * as Yup from "yup";
// import {
//   FaUser,
//   FaEnvelope,
//   FaLock,
//   FaEye,
//   FaEyeSlash,
//   FaMountain,
// } from "react-icons/fa";
// import { registerAdmin } from "../api/adminApi";

// const registrationValidationSchema = Yup.object().shape({
//   // Full Name validation - must be at least 2 characters
//   // fullName: Yup.string()
//   //   .min(2, "Full name must be at least 2 characters")
//   //   .max(50, "Full name must not exceed 50 characters")
//   //   .required("Full name is required")
//   //   .matches(
//   //     /^[a-zA-Z\s]+$/,
//   //     "Full name should only contain letters and spaces",
//   //   ),
//   // // Email validation - must be valid email format
//   // email: Yup.string()
//   //   .email("Please enter a valid email address")
//   //   .required("Email is required"),
//   // // Password validation - minimum 8 characters with complexity requirements
//   // password: Yup.string()
//   //   .min(8, "Password must be at least 8 characters")
//   //   .max(100, "Password must not exceed 100 characters")
//   //   .matches(
//   //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//   //     "Password must contain at least one uppercase letter, one lowercase letter, and one number",
//   //   )
//   //   .required("Password is required"),
//   // // Confirm Password validation - must match password field
//   // confirmPassword: Yup.string()
//   //   .oneOf([Yup.ref("password"), null], "Passwords do not match")
//   //   .required("Please confirm your password"),
// });

// export default function Registration() {
//   // Form data state - stores all form field values
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//   });

//   // Password visibility toggles
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   // Validation errors from Yup schema
//   const [validationErrors, setValidationErrors] = useState({});

//   // Loading state for API calls
//   const [isLoading, setIsLoading] = useState(false);

//   // API error messages (from server)
//   const [apiError, setApiError] = useState("");

//   // Success message after successful registration
//   const [successMessage, setSuccessMessage] = useState("");

//   /**
//    * Handle input field changes
//    * Updates form data state and clears relevant errors
//    */
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Update form data
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     // Clear validation error for this field when user starts typing
//     if (validationErrors[name]) {
//       setValidationErrors((prev) => ({ ...prev, [name]: "" }));
//     }

//     // Clear API error when user starts typing
//     if (apiError) {
//       setApiError("");
//     }
//   };

//   /**
//    * Handle form submission
//    * Validates data with Yup schema and makes API call if valid
//    */
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Clear previous messages
//     setApiError("");
//     setSuccessMessage("");
//     setValidationErrors({});
//     setIsLoading(true);

//     try {
//       // Step 1: Validate form data using Yup schema
//       // abortEarly: false ensures all errors are collected, not just the first one
//       await registrationValidationSchema.validate(formData, {
//         abortEarly: false,
//       });

//       // Step 2: If validation passes, prepare data for API
//       const response = await registerAdmin({
//         name: formData.fullName, // map fullName → name
//         email: formData.email,
//         password: formData.password,
//       });
//       // Step 4: Handle successful registration
//       setSuccessMessage("Registration successful! Welcome to the adventure!");

//       // Step 5: Reset form to initial state
//       setFormData({
//         fullName: "",
//         email: "",
//         password: "",
//         confirmPassword: "",
//       });

//       // Optional: Redirect to login page after 2 seconds
//       setTimeout(() => {
//         window.location.href = "/";
//       }, 2000);
//     } catch (error) {
//       // Handle Yup validation errors
//       if (error.name === "ValidationError") {
//         // Create an object with field names as keys and error messages as values
//         const errors = {};
//         error.inner.forEach((err) => {
//           errors[err.path] = err.message;
//         });
//         setValidationErrors(errors);
//       } else {
//         // Handle API errors (from server)
//         console.error("Registration error:", error);

//         if (error.message) {
//           setApiError(error.message);
//         } else if (error.error) {
//           setApiError(error.error);
//         } else {
//           setApiError("Registration failed. Please try again later.");
//         }
//       }
//     } finally {
//       // Always set loading to false, whether success or error
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-blue-900 via-blue-800 to-blue-950 flex items-center justify-center p-4">
//       {/* Registration Card Container */}
//       <div className="w-full max-w-md bg-linear-to-b from-blue-800/40 to-blue-900/40 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-blue-700/50">
//         {/* Logo Section */}
//         <div className="flex justify-center mb-6">
//           <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
//             <FaMountain className="text-white text-2xl" />
//           </div>
//         </div>

//         {/* Header Section */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-white mb-2">
//             Start Your Journey
//           </h1>
//           <p className="text-blue-200 text-sm">
//             Create an account to explore the peaks
//           </p>
//         </div>

//         {/* Success Message Display */}
//         {successMessage && (
//           <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
//             <p className="text-blue-200 text-sm text-center">
//               {successMessage}
//             </p>
//           </div>
//         )}

//         {/* API Error Message Display */}
//         {apiError && (
//           <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
//             <p className="text-red-200 text-sm text-center">{apiError}</p>
//           </div>
//         )}

//         {/* Registration Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Full Name Input Field */}
//           <div>
//             <label
//               htmlFor="fullName"
//               className="block text-sm font-medium text-white mb-2"
//             >
//               Full Name
//             </label>
//             <div className="relative">
//               {/* Icon */}
//               <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />

//               {/* Input */}
//               <input
//                 type="text"
//                 id="fullName"
//                 name="fullName"
//                 value={formData.fullName}
//                 onChange={handleChange}
//                 placeholder="Enter your full name"
//                 disabled={isLoading}
//                 className={`w-full pl-11 pr-4 py-3.5 bg-blue-700/30 border-2 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
//                   validationErrors.fullName
//                     ? "border-red-500 focus:border-red-500"
//                     : "border-amber-500/40 focus:border-amber-400"
//                 }`}
//               />
//             </div>

//             {/* Validation Error Message */}
//             {validationErrors.fullName && (
//               <p className="text-red-300 text-xs mt-1.5 font-medium">
//                 {validationErrors.fullName}
//               </p>
//             )}
//           </div>

//           {/* Email Address Input Field */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-white mb-2"
//             >
//               Email Address
//             </label>
//             <div className="relative">
//               {/* Icon */}
//               <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />

//               {/* Input */}
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="your.email@example.com"
//                 disabled={isLoading}
//                 className={`w-full pl-11 pr-4 py-3.5 bg-blue-700/30 border-2 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
//                   validationErrors.email
//                     ? "border-red-500 focus:border-red-500"
//                     : "border-amber-500/40 focus:border-amber-400"
//                 }`}
//               />
//             </div>

//             {/* Validation Error Message */}
//             {validationErrors.email && (
//               <p className="text-red-300 text-xs mt-1.5 font-medium">
//                 {validationErrors.email}
//               </p>
//             )}
//           </div>

//           {/* Password Input Field */}
//           <div>
//             <label
//               htmlFor="password"
//               className="block text-sm font-medium text-white mb-2"
//             >
//               Password
//             </label>
//             <div className="relative">
//               {/* Icon */}
//               <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />

//               {/* Input */}
//               <input
//                 type={showPassword ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 placeholder="Create a strong password"
//                 disabled={isLoading}
//                 className={`w-full pl-11 pr-12 py-3.5 bg-blue-700/30 border-2 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
//                   validationErrors.password
//                     ? "border-red-500 focus:border-red-500"
//                     : "border-amber-500/40 focus:border-amber-400"
//                 }`}
//               />

//               {/* Password visibility toggle button */}
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

//             {/* Validation Error Message */}
//             {validationErrors.password && (
//               <p className="text-red-300 text-xs mt-1.5 font-medium">
//                 {validationErrors.password}
//               </p>
//             )}
//           </div>

//           {/* Confirm Password Input Field */}
//           <div>
//             <label
//               htmlFor="confirmPassword"
//               className="block text-sm font-medium text-white mb-2"
//             >
//               Confirm Password
//             </label>
//             <div className="relative">
//               {/* Icon */}
//               <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300 text-sm" />

//               {/* Input */}
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 id="confirmPassword"
//                 name="confirmPassword"
//                 value={formData.confirmPassword}
//                 onChange={handleChange}
//                 placeholder="Re-enter your password"
//                 disabled={isLoading}
//                 className={`w-full pl-11 pr-12 py-3.5 bg-blue-700/30 border-2 rounded-xl text-white placeholder-blue-300/60 focus:outline-none focus:bg-blue-700/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
//                   validationErrors.confirmPassword
//                     ? "border-red-500 focus:border-red-500"
//                     : "border-amber-500/40 focus:border-amber-400"
//                 }`}
//               />

//               {/* Password visibility toggle button */}
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

//             {/* Validation Error Message */}
//             {validationErrors.confirmPassword && (
//               <p className="text-red-300 text-xs mt-1.5 font-medium">
//                 {validationErrors.confirmPassword}
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

// ==================================================================================================================

import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { registerAdmin } from "../api/adminApi";

const registrationValidationSchema = Yup.object().shape({
  // fullName: Yup.string()
  //   .min(2, "Full name must be at least 2 characters")
  //   .max(50, "Full name must not exceed 50 characters")
  //   .required("Full name is required")
  //   .matches(/^[a-zA-Z\s]+$/, "Full name should only contain letters and spaces"),
  // email: Yup.string()
  //   .email("Please enter a valid email address")
  //   .required("Email is required"),
  // password: Yup.string()
  //   .min(8, "Password must be at least 8 characters")
  //   .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and a number")
  //   .required("Password is required"),
  // confirmPassword: Yup.string()
  //   .oneOf([Yup.ref("password"), null], "Passwords do not match")
  //   .required("Please confirm your password"),
});

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=90&w=1920",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=90&w=1920",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=90&w=1920",
  "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=90&w=1920",
];

export default function Registration() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Background slideshow
  const [currentBg, setCurrentBg] = useState(0);
  const [nextBg, setNextBg] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentBg((prev) => (prev + 1) % BG_IMAGES.length);
        setNextBg((prev) => (prev + 1) % BG_IMAGES.length);
        setTransitioning(false);
      }, 1500);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name])
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    if (apiError) setApiError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");
    setValidationErrors({});
    setIsLoading(true);
    try {
      await registrationValidationSchema.validate(formData, {
        abortEarly: false,
      });
      const response = await registerAdmin({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
      });
      setSuccessMessage("Registration successful! Welcome to the adventure!");
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
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
        else setApiError("Registration failed. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase =
    "w-full pl-10 pr-4 py-3 text-sm border rounded-xl outline-none transition-all duration-200 text-gray-900 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed";
  const inputNormal =
    "border-gray-200 bg-gray-50 hover:border-gray-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 focus:bg-white shadow-sm shadow-gray-100";
  const inputError =
    "border-red-400 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-100";

  return (
    <>
      <style>{`
        @keyframes kenBurns {
          0%   { transform: scale(1.0) translate(0%, 0%); }
          100% { transform: scale(1.12) translate(-2%, -1.5%); }
        }
        @keyframes kenBurnsReverse {
          0%   { transform: scale(1.12) translate(-2%, -1.5%); }
          100% { transform: scale(1.0) translate(0%, 0%); }
        }
        .kb-animate { animation: kenBurns 8s ease-in-out forwards; }
        .kb-animate-reverse { animation: kenBurnsReverse 8s ease-in-out forwards; }
      `}</style>

      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* ── ANIMATED BACKGROUND ── */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            key={`current-${currentBg}`}
            src={BG_IMAGES[currentBg]}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ${transitioning ? "opacity-0" : "opacity-100"} kb-animate`}
          />
          <img
            key={`next-${nextBg}`}
            src={BG_IMAGES[nextBg]}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ${transitioning ? "opacity-100" : "opacity-0"} kb-animate-reverse`}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/80 via-blue-900/70 to-slate-900/80" />
          <div className="absolute inset-0 bg-gradient-to-t from-blue-950/60 via-transparent to-transparent" />
        </div>

        {/* Dot indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {BG_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentBg(i);
                setNextBg((i + 1) % BG_IMAGES.length);
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
        <div className="relative z-10 w-full max-w-5xl flex rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.07)]">
          {/* ── LEFT PANEL ── */}
          <div className="hidden lg:flex flex-col justify-between flex-1 p-12 relative overflow-hidden bg-white/5 backdrop-blur-sm border-r border-white/10">
            {/* Decorative rings */}
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blue-400/10" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-blue-400/10" />
            <div className="absolute top-14 right-8 w-52 h-52 rounded-full border border-white/10" />
            <div className="absolute top-24 right-16 w-32 h-32 rounded-full border border-white/10" />

            {/* Brand */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/30 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg border border-blue-300/20">
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
              <span className="text-white font-bold text-xl tracking-tight drop-shadow-sm">
                Vatadya
              </span>
            </div>

            {/* Body */}
            <div className="relative z-10">
              <h1 className="text-4xl font-bold text-white leading-tight mb-4 tracking-tight drop-shadow-md">
                Join the
                <br />
                <span className="text-blue-200 font-light">Adventure</span>
              </h1>
              <p className="text-blue-100/75 text-sm leading-relaxed max-w-xs mb-10">
                Create your account and get access to hundreds of trekking
                routes, expedition tools, and expert guidance.
              </p>

              {/* Steps */}
              <div className="flex flex-col gap-5">
                {[
                  {
                    num: "01",
                    label: "Create your account",
                    desc: "Fill in your details below",
                  },
                  {
                    num: "02",
                    label: "Explore routes",
                    desc: "Browse 340+ curated treks",
                  },
                  {
                    num: "03",
                    label: "Start your journey",
                    desc: "Book and manage expeditions",
                  },
                ].map(({ num, label, desc }) => (
                  <div key={num} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                      <span className="text-blue-200 text-xs font-bold">
                        {num}
                      </span>
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold leading-none mb-1">
                        {label}
                      </p>
                      <p className="text-blue-200/60 text-xs">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="flex-1 lg:flex-none lg:w-[460px] flex flex-col justify-center px-8 md:px-12 py-10 bg-white overflow-y-auto">
            {/* Mobile brand */}
            <div className="flex lg:hidden items-center gap-3 mb-6">
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
            <div className="mb-7">
              <span className="text-xs font-semibold text-blue-500 tracking-widest uppercase">
                Admin Portal
              </span>
              <h2 className="text-3xl font-bold text-gray-900 mt-1 mb-1 tracking-tight">
                Create account
              </h2>
              <p className="text-sm text-gray-400">
                Join and start managing your expeditions
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

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full Name
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    className={`${inputBase} ${validationErrors.fullName ? inputError : inputNormal}`}
                  />
                </div>
                {validationErrors.fullName && (
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
                    {validationErrors.fullName}
                  </p>
                )}
              </div>

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
                    placeholder="your.email@example.com"
                    disabled={isLoading}
                    className={`${inputBase} ${validationErrors.email ? inputError : inputNormal}`}
                  />
                </div>
                {validationErrors.email && (
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
                    {validationErrors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    disabled={isLoading}
                    className={`${inputBase} pr-11 ${validationErrors.password ? inputError : inputNormal}`}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm Password
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter your password"
                    disabled={isLoading}
                    className={`${inputBase} pr-11 ${validationErrors.confirmPassword ? inputError : inputNormal}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? (
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
                {validationErrors.confirmPassword && (
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
                    {validationErrors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
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
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
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
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-300 font-medium tracking-wide">
                OR
              </span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <a
                href="/"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
