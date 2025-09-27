'use client'
import React, { useState } from "react";
import { Eye, EyeOff, Menu } from "lucide-react";
import Sidebar from "@/Components/Creater/Sidebar";

interface FormData {
  email: string;
  currentPassword: string;
  name: string;
  phone: string;
}

interface ToggleSwitchProps {
  enabled: boolean;
  onToggle: () => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    type="button"
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? "bg-blue-600" : "bg-gray-300"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        enabled ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [emailUpdates, setEmailUpdates] = useState<boolean>(true);
  const [appNotifications, setAppNotifications] = useState<boolean>(true);
  const [pushNotifications, setPushNotifications] = useState<boolean>(false);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    email: "john@example.com",
    currentPassword: "",
    name: "John Doe",
    phone: "+1 (555) 123-4567",
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative z-50">
            <Sidebar/>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar/>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="md:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">Settings</h1>
          <div className="w-8"></div> {/* Spacer for centering */}
        </div>

        <div className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h1 className="hidden md:block text-2xl font-semibold text-gray-900">Settings</h1>
            <p className="hidden md:block text-gray-600 mt-1">
              Manage your account preferences and integrations
            </p>
          </div>

          <div className="p-4 md:p-6 space-y-6 md:space-y-8">
            {/* Profile Information */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Profile Information
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Change your personal data and account credentials
              </p>

              <div className="space-y-6">
                {/* Account Details */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Account Details
                  </h3>
                  <div className="pl-4 space-y-4">
                    <p className="text-xs text-gray-500">
                      Change basic account details
                    </p>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current password
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) =>
                            handleInputChange("currentPassword", e.target.value)
                          }
                          placeholder="••••••••••••"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          type="button"
                          className="absolute right-12 top-1/2 transform -translate-y-1/2 text-blue-600 text-sm hover:text-blue-800"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">Minimum 8 characters</p>
                  </div>
                </div>

                {/* Basic Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-4 flex items-center">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2"></span>
                    Basic Info
                  </h3>
                  <div className="pl-4 space-y-4">
                    <p className="text-xs text-gray-500">
                      Update your personal information below
                    </p>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <p className="text-xs text-gray-500">
                      Update your phone number below in your account.
                    </p>
                  </div>
                </div>

                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                  Save Changes
                </button>
              </div>
            </section>

            {/* Linked Accounts */}
            {/* ... rest of your sections remain unchanged (no special typing needed) */}
             <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Linked Accounts</h2>
              <p className="text-sm text-gray-600 mb-6">Connect other accounts with external providers to access your content</p>
              
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-medium text-sm">G</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Instagram</p>
                      <p className="text-sm text-gray-500">@john_doe</p>
                    </div>
                  </div>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                    Disconnect
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">F</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Facebook</p>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                    Connect
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <span className="text-white font-medium text-sm">X</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">X (Twitter)</p>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300 transition-colors">
                    Connect
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-medium text-sm">in</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">LinkedIn</p>
                      <p className="text-sm text-gray-500">Not connected</p>
                    </div>
                  </div>
                  <button className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors">
                    Disconnect
                  </button>
                </div>
              </div>
            </section>

            {/* Notification Preferences */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">Notification Preferences</h2>
              <p className="text-sm text-gray-600 mb-6">Choose how you'd like to receive updates about your Biocube Vision</p>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Updates</p>
                    <p className="text-sm text-gray-500">Receive product news, feature updates and special offers via email</p>
                  </div>
                  <ToggleSwitch enabled={emailUpdates} onToggle={() => setEmailUpdates(!emailUpdates)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">In-App Notifications</p>
                    <p className="text-sm text-gray-500">Get alerts about your tasks, projects and team communication</p>
                  </div>
                  <ToggleSwitch enabled={appNotifications} onToggle={() => setAppNotifications(!appNotifications)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Push Notifications</p>
                    <p className="text-sm text-gray-500">Get push notifications on your mobile device and browser</p>
                  </div>
                  <ToggleSwitch enabled={pushNotifications} onToggle={() => setPushNotifications(!pushNotifications)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Email Reminders</p>
                    <p className="text-sm text-gray-500">Receive email reminders for upcoming posts or urgent project deadlines</p>
                  </div>
                  <ToggleSwitch enabled={emailNotifications} onToggle={() => setEmailNotifications(!emailNotifications)} />
                </div>
              </div>
            </section>

            {/* API Key Management */}
            <section>
              <h2 className="text-lg font-medium text-gray-900 mb-2">API Key Management</h2>
              <p className="text-sm text-gray-600 mb-6">Generate or manage API keys for third-party integrations and custom applications</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current API Key</label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                    <input
                      type="text"
                      
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-sm"
                    />
                    <div className="flex space-x-2">
                      <button className="flex-1 sm:flex-none bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
                        Copy
                      </button>
                      <button className="flex-1 sm:flex-none bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition-colors text-sm">
                        Regenerate
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Warning: When regenerating an API key, all integrations and applications
                    using the previous key will stop working until they use the new key.
                  </p>
                </div>

                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View API documentation
                </button>
              </div>
            </section>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
