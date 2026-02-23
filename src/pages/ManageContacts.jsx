import React, { useState, useEffect } from "react";
import {
  HiMail,
  HiPhone,
  HiChatAlt2,
  HiChevronDown,
  HiChevronUp,
  HiSearch,
  HiFilter,
  HiDownload,
  HiX,
  HiCalendar,
  HiUser,
  HiRefresh,
} from "react-icons/hi";
import { getAllContacts } from "../api/contactApi";

const ManageContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch contacts on component mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAllContacts();

      let contactsArray = [];

      // Handle different response structures
      if (Array.isArray(data)) {
        contactsArray = data;
      } else if (data && Array.isArray(data.contacts)) {
        contactsArray = data.contacts;
      } else if (data && Array.isArray(data.data)) {
        contactsArray = data.data;
      } else {
        console.warn("Unexpected API response structure:", data);
        contactsArray = [];
      }

      // Ensure each contact has a unique ID
      const contactsWithIds = contactsArray.map((contact, index) => ({
        ...contact,
        id: contact.id || contact._id || `contact-${index}`,
      }));

      setContacts(contactsWithIds);
    } catch (err) {
      setError(err.message || "Failed to fetch contacts");
      console.error("Error fetching contacts:", err);
      setContacts([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => {
    console.log("Toggling row with ID:", id, "Current expanded:", expandedRow);
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Filter contacts
  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.mobile_no?.includes(searchQuery) ||
      contact.mobile?.includes(searchQuery);

    // Handle status filtering - check if contact has a status field
    const contactStatus = contact.status; // Default to "new" if no status
    const matchesStatus =
      filterStatus === "all" || contactStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Contact Management
            </h1>
            <p className="text-gray-600 text-lg">
              Manage and respond to customer inquiries
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* <button
              onClick={fetchContacts}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-emerald-200 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <HiRefresh
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-emerald-200 text-emerald-700 rounded-xl font-semibold hover:bg-emerald-50 transition-all shadow-sm hover:shadow-md">
              <HiDownload className="w-5 h-5" />
              Export
            </button> */}
            <div className="bg-emerald-100 text-emerald-700 px-5 py-3 rounded-xl font-bold">
              {contacts.length} Contacts
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 rounded-full p-2">
                <HiX className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">
                  Error Loading Contacts
                </h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
            <button
              onClick={fetchContacts}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition-all"
              />
            </div>

            {/* Status Filter */}
            {/* <div className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl border-2 border-gray-200">
              <HiFilter className="w-5 h-5 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent outline-none font-medium text-gray-700 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="read">Read</option>
              </select>
            </div> */}

            {/* Clear Button */}
            {(searchQuery || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterStatus("all");
                }}
                className="px-4 py-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all font-medium"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 font-semibold">Loading contacts...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  {/* Table Header */}
                  <thead className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
                    <tr>
                      <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <HiUser className="w-5 h-5" />
                          Name
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <HiMail className="w-5 h-5" />
                          Email
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <HiPhone className="w-5 h-5" />
                          Mobile
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <HiChatAlt2 className="w-5 h-5" />
                          Message Preview
                        </div>
                      </th>
                      <th className="px-6 py-5 text-left text-sm font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                          <HiCalendar className="w-5 h-5" />
                          Date
                        </div>
                      </th>
                      <th className="px-6 py-5 text-center text-sm font-bold uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  {/* Table Body */}
                  <tbody className="divide-y divide-gray-200">
                    {filteredContacts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <HiSearch className="w-16 h-16 text-gray-300 mb-4" />
                            <p className="text-gray-500 font-semibold text-lg">
                              No contacts found
                            </p>
                            <p className="text-gray-400 text-sm">
                              Try adjusting your search or filters
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredContacts.map((contact) => (
                        <React.Fragment key={contact.id}>
                          <tr className="hover:bg-emerald-50/30 transition-colors">
                            {/* Name */}
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold shadow-md">
                                  {contact.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900">
                                    {contact.name || "N/A"}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {contact.isActive === true ? (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-orange-100 text-orange-700 font-semibold">
                                        New
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                        Read
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* Email */}
                            <td className="px-6 py-5">
                              <div className="text-gray-700 font-medium">
                                {contact.email || "N/A"}
                              </div>
                            </td>

                            {/* Mobile */}
                            <td className="px-6 py-5">
                              <div className="text-gray-700 font-medium">
                                {contact.mobile_no || "N/A"}
                              </div>
                            </td>

                            {/* Message Preview */}
                            <td className="px-6 py-5">
                              <div className="text-gray-600 line-clamp-2 max-w-md">
                                {contact.message || "No message"}
                              </div>
                            </td>

                            {/* Date */}
                            <td className="px-6 py-5">
                              <div className="text-gray-700 font-medium">
                                {contact.createdAt
                                  ? new Date(
                                    contact.createdAt,
                                  ).toLocaleDateString()
                                  : "N/A"}
                              </div>
                            </td>

                            {/* Actions */}
                            <td className="px-6 py-5">
                              <div className="flex justify-center">
                                <button
                                  onClick={() => toggleRow(contact.id)}
                                  className={`group flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${expandedRow === contact.id
                                    ? "bg-emerald-600 text-white shadow-lg"
                                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                                    }`}
                                >
                                  {expandedRow === contact.id ? "Hide" : "View"}
                                  {expandedRow === contact.id ? (
                                    <HiChevronUp className="w-4 h-4" />
                                  ) : (
                                    <HiChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                                  )}
                                </button>
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Details Row */}
                          {expandedRow === contact.id && (
                            <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
                              <td colSpan="6" className="px-6 py-6">
                                <div className="bg-white rounded-xl p-6 shadow-inner border-2 border-emerald-100">
                                  <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                      <HiChatAlt2 className="w-5 h-5 text-emerald-600" />
                                      Full Message Details
                                    </h3>
                                    <button
                                      onClick={() => toggleRow(contact.id)}
                                      className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                      <HiX className="w-5 h-5 text-gray-400" />
                                    </button>
                                  </div>

                                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                                    {/* Contact Info */}
                                    <div className="space-y-4">
                                      <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                          Full Name
                                        </div>
                                        <div className="text-gray-900 font-semibold">
                                          {contact.name || "N/A"}
                                        </div>
                                      </div>

                                      <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                          Email Address
                                        </div>
                                        <div className="text-gray-900 font-medium flex items-center gap-2">
                                          <HiMail className="w-4 h-4 text-emerald-600" />
                                          {contact.email || "N/A"}
                                        </div>
                                      </div>

                                      <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                          Mobile Number
                                        </div>
                                        <div className="text-gray-900 font-medium flex items-center gap-2">
                                          <HiPhone className="w-4 h-4 text-emerald-600" />
                                          {contact.mobile_no || "N/A"}
                                        </div>
                                      </div>

                                      <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-xs text-gray-500 uppercase font-semibold mb-1">
                                          Contact Date
                                        </div>
                                        <div className="text-gray-900 font-medium flex items-center gap-2">
                                          <HiCalendar className="w-4 h-4 text-emerald-600" />
                                          {contact.createdAt
                                            ? new Date(
                                              contact.createdAt,
                                            ).toLocaleDateString("en-US", {
                                              weekday: "long",
                                              year: "numeric",
                                              month: "long",
                                              day: "numeric",
                                            })
                                            : "N/A"}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Full Message */}
                                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-6 border-2 border-emerald-100">
                                      <div className="text-xs text-emerald-700 uppercase font-semibold mb-3 flex items-center gap-2">
                                        <HiChatAlt2 className="w-4 h-4" />
                                        Complete Message
                                      </div>
                                      <div className="text-gray-800 leading-relaxed">
                                        {contact.message ||
                                          "No message provided"}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                                    <a
                                      href={`mailto:${contact.email}?subject=Regarding your inquiry&body=Hello ${contact.name},`}
                                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                      <HiMail className="w-5 h-5" />
                                      Reply via Email
                                    </a>

                                    <a
                                      href={`tel:${contact.mobile_no}`}
                                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
                                    >
                                      <HiPhone className="w-5 h-5" />
                                      Call Now
                                    </a>

                                    <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all">
                                      Mark as Read
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 border-2 border-emerald-100 shadow-md">
                <div className="text-emerald-600 text-sm font-semibold mb-1">
                  Total Contacts
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {contacts.length}
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-orange-100 shadow-md">
                <div className="text-orange-600 text-sm font-semibold mb-1">
                  New Inquiries
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {/* {contacts.filter((c) => c.isActive === true).length} */} 0
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-md">
                <div className="text-blue-600 text-sm font-semibold mb-1">
                  This Week
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {
                    contacts.filter((c) => {
                      if (!c.createdAt) return false;
                      const contactDate = new Date(c.createdAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return contactDate >= weekAgo;
                    }).length
                  }
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom Styles */}
      <style>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default ManageContacts;
