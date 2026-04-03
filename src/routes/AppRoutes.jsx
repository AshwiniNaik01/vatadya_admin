import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layout/AdminLayout";
import Dashboard from "../pages/Dashboard";
import ManageTreks from "../pages/ManageTreks";
import TrekForm from "../pages/TrekForm";
import ManageBookings from "../pages/ManageBookings";
import TrekBookingForm from "../pages/TrekBookingForm";
import TrekGalleryForm from "../pages/TrekGalleryForm";
import ManageTrekGallery from "../pages/ManageTrekGallery";
import ManageCategories from "../pages/ManageCategories";
import CategoryForm from "../pages/CategoryForm";

import ManageReviews from "../pages/ManageReviews";
import ManagePayments from "../pages/ManagePayments";
import LoginPage from "../pages/Login";
import RegistrationPage from "../pages/Registration";
import CreateSlotForm from "../pages/CreateSlotForm";
import ManageContacts from "../pages/ManageContacts";
import ManageSlot from "../pages/ManageSlot";
import BookingTreks from "../pages/BookingTreks";
import UserInsights from "../pages/UserInsights";
import AboutUsForm from "../components/user-insights/AboutUs";
import ContactUsForm from "../components/user-insights/ContactUs";
import StayForm from "../pages/StayForm";
import ManageStay from "../pages/ManageStay";
import UserManagement from "../pages/UserManagement";
import PrivateRoute from "../layout/PrivateRoute";
import RolePermissionManager from "../components/role-permission/RolePermissionManager";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            {/* Treks */}
            <Route path="/treks" element={<TrekForm />} />
            <Route path="/treks/manage" element={<ManageTreks />} />
            <Route path="/treks/create" element={<TrekForm />} />
            <Route path="/treks/edit/:id" element={<TrekForm />} />

            {/* Categories */}
            <Route path="/categories/manage" element={<ManageCategories />} />
            <Route path="/categories/create" element={<CategoryForm />} />
            <Route path="/categories/edit/:id" element={<CategoryForm />} />

            {/* Bookings */}
            <Route path="/bookings/create" element={<TrekBookingForm />} />
            <Route path="/bookings/manage" element={<ManageBookings />} />
            <Route path="/gallery/create" element={<TrekGalleryForm />} />
            <Route path="/gallery/manage" element={<ManageTrekGallery />} />

            {/* Reviews */}
            <Route path="/reviews/manage" element={<ManageReviews />} />

            {/* Payments */}
            <Route path="/payments/manage" element={<ManagePayments />} />

            {/* Slots */}
            <Route path={"/slots/create"} element={<CreateSlotForm />} />
            <Route path={"slots/manage"} element={<ManageSlot />} />

            {/* Contacts */}
            <Route path="/contacts" element={<ManageContacts />} />

            {/* Booking treks */}
            <Route path="/bookingTreks" element={<BookingTreks />} />

            {/* User Insights*/}
            <Route path="/userInsights" element={<UserInsights />} />
            <Route path="/userInsights/:tab" element={<UserInsights />} />

            {/* About us */}
            <Route path="/aboutUs" element={<AboutUsForm />} />

            {/* Contact us */}
            <Route path="/contactUs" element={<ContactUsForm />} />

            {/* Stay */}
            <Route path={"/stay/create"} element={<StayForm />} />
            <Route path="/stay/edit/:id" element={<StayForm />} />
            <Route path={"/stay/manage"} element={<ManageStay />} />

            {/* User Management */}
            <Route path="/users" element={<UserManagement />} />

            {/* Role Based Permissions */}
            <Route
              path="/role-permissions"
              element={<RolePermissionManager />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

// import { lazy, Suspense } from "react";
// import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
// import AdminLayout from "../layout/AdminLayout";
// import PrivateRoute from "../layout/PrivateRoute";

// // Eager imports (auth pages - needed immediately)
// import LoginPage from "../pages/Login";
// import RegistrationPage from "../pages/Registration";

// // Lazy imports
// const Dashboard = lazy(() => import("../pages/Dashboard"));

// // Treks
// const TrekForm = lazy(() => import("../pages/TrekForm"));
// const ManageTreks = lazy(() => import("../pages/ManageTreks"));

// // Categories
// const ManageCategories = lazy(() => import("../pages/ManageCategories"));
// const CategoryForm = lazy(() => import("../pages/CategoryForm"));

// // Bookings
// const TrekBookingForm = lazy(() => import("../pages/TrekBookingForm"));
// const ManageBookings = lazy(() => import("../pages/ManageBookings"));

// // Gallery
// const TrekGalleryForm = lazy(() => import("../pages/TrekGalleryForm"));
// const ManageTrekGallery = lazy(() => import("../pages/ManageTrekGallery"));

// // Reviews (no separate module in list, grouped under trek or booking as needed)
// const ManageReviews = lazy(() => import("../pages/ManageReviews"));

// // Payments
// const ManagePayments = lazy(() => import("../pages/ManagePayments"));

// // Slots
// const CreateSlotForm = lazy(() => import("../pages/CreateSlotForm"));
// const ManageSlot = lazy(() => import("../pages/ManageSlot"));

// // Contacts
// const ManageContacts = lazy(() => import("../pages/ManageContacts"));

// // Booking Treks
// const BookingTreks = lazy(() => import("../pages/BookingTreks"));

// // User Insights
// const UserInsights = lazy(() => import("../pages/UserInsights"));
// const AboutUsForm = lazy(() => import("../components/user-insights/AboutUs"));
// const ContactUsForm = lazy(
//   () => import("../components/user-insights/ContactUs"),
// );

// // Stay
// const StayForm = lazy(() => import("../pages/StayForm"));
// const ManageStay = lazy(() => import("../pages/ManageStay"));

// // User Management
// const UserManagement = lazy(() => import("../pages/UserManagement"));

// // Role Permission
// const RolePermissionManager = lazy(
//   () => import("../components/role-permission/RolePermissionManager"),
// );

// export default function AppRoutes() {
//   return (
//     <Suspense fallback={<div>Loading...</div>}>
//       <Routes>
//         {/* Public Routes */}
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/registration" element={<RegistrationPage />} />

//         {/* Protected Routes */}
//         <Route element={<ProtectedRoute />}>
//           <Route element={<AdminLayout />}>
//             {/* Dashboard */}
//             <Route
//               element={
//                 <PrivateRoute
//                   requiredModule="dashboard"
//                   requiredAction="read"
//                 />
//               }
//             >
//               <Route path="/dashboard" element={<Dashboard />} />
//             </Route>

//             {/* Treks */}
//             <Route
//               element={
//                 <PrivateRoute requiredModule="trek" requiredAction="read" />
//               }
//             >
//               <Route path="/treks/manage" element={<ManageTreks />} />
//             </Route>
//             <Route
//               element={
//                 <PrivateRoute requiredModule="trek" requiredAction="create" />
//               }
//             >
//               <Route path="/treks" element={<TrekForm />} />
//               <Route path="/treks/create" element={<TrekForm />} />
//             </Route>
//             <Route
//               element={
//                 <PrivateRoute requiredModule="trek" requiredAction="update" />
//               }
//             >
//               <Route path="/treks/edit/:id" element={<TrekForm />} />
//             </Route>

//             {/* Trek Categories */}
//             <Route
//               element={
//                 <PrivateRoute
//                   requiredModule="trekCategory"
//                   requiredAction="read"
//                 />
//               }
//             >
//               <Route path="/categories/manage" element={<ManageCategories />} />
//             </Route>
//             <Route
//               element={
//                 <PrivateRoute
//                   requiredModule="trekCategory"
//                   requiredAction="create"
//                 />
//               }
//             >
//               <Route path="/categories/create" element={<CategoryForm />} />
//             </Route>
//             <Route
//               element={
//                 <PrivateRoute
//                   requiredModule="trekCategory"
//                   requiredAction="update"
//                 />
//               }
//             >
//               <Route path="/categories/edit/:id" element={<CategoryForm />} />
//             </Route>

//             {/* Bookings */}
//             <Route
//               element={
//                 <PrivateRoute
//                   requiredModule="booking"
//                   requiredAction="create"
//                 />
//               }
//             >
//               <Route path="/bookings/create" element={<TrekBookingForm />} />
//             </Route>
//             <Route
//               element={
//                 <PrivateRoute requiredModule="booking" requiredAction="read" />
//               }
//             >
//               <Route path="/bookings/manage" element={<ManageBookings />} />
//             </Route>

//             {/* Gallery */}
//             <Route
//               element={
//                 <PrivateRoute
//                   requiredModule="gallery"
//                   requiredAction="create"
//                 />
//               }
//             >
//               <Route path="/gallery/create" element={<TrekGalleryForm />} />
//             </Route>
//             <Route
//               element={
//                 <PrivateRoute requiredModule="gallery" requiredAction="read" />
//               }
//             >
//               <Route path="/gallery/manage" element={<ManageTrekGallery />} />
//             </Route>

//             {/* Reviews - mapped under booking module */}
//             <Route
//               element={
//                 <PrivateRoute requiredModule="booking" requiredAction="read" />
//               }
//             >
//               <Route path="/reviews/manage" element={<ManageReviews />} />
//             </Route>

//             {/* Payments - mapped under booking module */}
//             <Route
//               element={
//                 <PrivateRoute requiredModule="booking" requiredAction="read" />
//               }
//             >
//               <Route path="/payments/manage" element={<ManagePayments />} />
//             </Route>

//             {/* Slots - mapped under booking module */}
//             <Route
//               element={
//                 <PrivateRoute
//                   requiredModule="booking"
//                   requiredAction="create"
//                 />
//               }
//             >
//               <Route path="/slots/create" element={<CreateSlotForm />} />
//             </Route>
//             <Route
//               element={
//                 <PrivateRoute requiredModule="booking" requiredAction="read" />
//               }
//             >
//               <Route path="/slots/manage" element={<ManageSlot />} />
//             </Route>

//             {/* Contacts */}
//             <Route
//               element={
//                 <PrivateRoute requiredModule="contact" requiredAction="read" />
//               }
//             >
//               <Route path="/contacts" element={<ManageContacts />} />
//             </Route>

//             {/* Booking Treks - mapped under booking module */}
//             <Route
//               element={
//                 <PrivateRoute requiredModule="booking" requiredAction="read" />
//               }
//             >
//               <Route path="/bookingTreks" element={<BookingTreks />} />
//             </Route>

//             {/* User Insights */}
//             <Route
//               element={
//                 <PrivateRoute
//                   requiredModule="userInsight"
//                   requiredAction="read"
//                 />
//               }
//             >
//               <Route path="/userInsights" element={<UserInsights />} />
//               <Route path="/userInsights/:tab" element={<UserInsights />} />
//               <Route path="/aboutUs" element={<AboutUsForm />} />
//               <Route path="/contactUs" element={<ContactUsForm />} />
//             </Route>

//             {/* Stay */}
//             <Route
//               element={
//                 <PrivateRoute requiredModule="stay" requiredAction="create" />
//               }
//             >
//               <Route path="/stay/create" element={<StayForm />} />
//             </Route>
//             <Route
//               element={
//                 <PrivateRoute requiredModule="stay" requiredAction="update" />
//               }
//             >
//               <Route path="/stay/edit/:id" element={<StayForm />} />
//             </Route>
//             <Route
//               element={
//                 <PrivateRoute requiredModule="stay" requiredAction="read" />
//               }
//             >
//               <Route path="/stay/manage" element={<ManageStay />} />
//             </Route>

//             {/* User Management */}
//             <Route
//               element={
//                 <PrivateRoute requiredModule="user" requiredAction="read" />
//               }
//             >
//               <Route path="/users" element={<UserManagement />} />
//             </Route>

//             {/* Role & Permissions */}
//             <Route
//               element={
//                 <PrivateRoute requiredModule="role" requiredAction="read" />
//               }
//             >
//               <Route
//                 path="/role-permissions"
//                 element={<RolePermissionManager />}
//               />
//             </Route>
//           </Route>
//         </Route>
//       </Routes>
//     </Suspense>
//   );
// }
