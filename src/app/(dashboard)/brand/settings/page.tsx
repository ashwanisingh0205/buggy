"use client";
import { useState } from 'react';
import { 
  UserIcon, 
  BuildingOfficeIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  CreditCardIcon,
  GlobeAltIcon,
  KeyIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

export default function BrandSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    companyName: 'Bloocube Brand',
    email: 'brand@bloocube.com',
    phone: '+91 98765 43210',
    website: 'https://bloocube.com',
    description: 'Leading brand in digital marketing and creator partnerships',
    address: '123 Business Street, Mumbai, India',
    notifications: {
      email: true,
      push: true,
      sms: false,
      marketing: true
    }
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: UserIcon },
    { id: 'company', name: 'Company', icon: BuildingOfficeIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'billing', name: 'Billing', icon: CreditCardIcon },
    { id: 'integrations', name: 'Integrations', icon: GlobeAltIcon }
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value
      }
    }));
  };

  const renderProfileTab = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          Profile Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-3">Company Name</label>
            <input
              id="companyName"
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="w-full text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">Phone</label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="website" className="block text-sm font-semibold text-gray-700 mb-3">Website</label>
            <input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => handleInputChange('website', e.target.value)}
              className="w-full text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md"
            />
          </div>
        </div>
        <div className="mt-8 space-y-2">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-3">Description</label>
          <textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
            placeholder="Tell us about your brand..."
          />
        </div>
      </div>
    </div>
  );

  const renderCompanyTab = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg">
            <BuildingOfficeIcon className="w-6 h-6 text-white" />
          </div>
          Company Details
        </h3>
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-3">Address</label>
            <textarea
              id="address"
              rows={4}
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full text-gray-900 px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all duration-200 bg-white shadow-sm hover:shadow-md resize-none"
              placeholder="Enter your company address..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
            <BellIcon className="w-6 h-6 text-white" />
          </div>
          Notification Preferences
        </h3>
        <div className="space-y-6">
          {Object.entries(formData.notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 capitalize text-lg mb-2">{key} Notifications</h4>
                <p className="text-sm text-gray-600">
                  {key === 'email' && 'Receive notifications via email'}
                  {key === 'push' && 'Receive push notifications in browser'}
                  {key === 'sms' && 'Receive SMS notifications'}
                  {key === 'marketing' && 'Receive marketing and promotional emails'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleNotificationChange(key, e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-red-600"></div>
                <span className="sr-only">Toggle {key} notifications</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg">
            <ShieldCheckIcon className="w-6 h-6 text-white" />
          </div>
          Security Settings
        </h3>
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <KeyIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Change Password</h4>
                  <p className="text-sm text-gray-600">Update your account password</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                Change
              </button>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ShieldCheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Two-Factor Authentication</h4>
                  <p className="text-sm text-gray-600">Add an extra layer of security</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                Enable
              </button>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <KeyIcon className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">API Keys</h4>
                  <p className="text-sm text-gray-600">Manage your API access keys</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                Manage
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingTab = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg">
            <CreditCardIcon className="w-6 h-6 text-white" />
          </div>
          Billing Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <CreditCardIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-lg">Current Plan</h4>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">Pro Plan</p>
            <p className="text-lg text-gray-600">₹2,999/month</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CreditCardIcon className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-lg">Next Billing</h4>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-2">Dec 15, 2024</p>
            <p className="text-lg text-gray-600">Auto-renewal enabled</p>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
            Update Payment Method
          </button>
          <button className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium">
            Download Invoice
          </button>
        </div>
      </div>
    </div>
  );

  const renderIntegrationsTab = () => (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg">
            <GlobeAltIcon className="w-6 h-6 text-white" />
          </div>
          Integrations
        </h3>
        <div className="space-y-6">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <GlobeAltIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Google Analytics</h4>
                  <p className="text-sm text-gray-600">Track campaign performance</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                Connect
              </button>
            </div>
          </div>
          <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <KeyIcon className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-lg">Social Media APIs</h4>
                  <p className="text-sm text-gray-600">Connect your social accounts</p>
                </div>
              </div>
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'company':
        return renderCompanyTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'security':
        return renderSecurityTab();
      case 'billing':
        return renderBillingTab();
      case 'integrations':
        return renderIntegrationsTab();
      default:
        return renderProfileTab();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-blue-100 text-lg">Manage your brand account settings and preferences</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar */}
          <div className="lg:w-80 bg-gradient-to-b from-gray-50 to-gray-100 border-b lg:border-b-0 lg:border-r border-gray-200">
            <nav className="p-6 space-y-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-8">
            {renderTabContent()}
            
            {/* Save Button */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <button className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105">
                  <TrashIcon className="w-4 h-4" />
                  Delete Account
                </button>
                <div className="flex gap-4">
                  <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-medium">
                    Cancel
                  </button>
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


