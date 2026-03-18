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

export default function AppRoutes() {
  return (
    <Routes>
      {/* Login */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/registration" element={<RegistrationPage />} />
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
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
        </Route>
      </Route>
    </Routes>
  );
}
