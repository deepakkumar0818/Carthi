"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Globe,
  CreditCard,
  Shield,
  Mail,
  Phone,
  Building,
  Palette,
  Database,
  Download,
  Upload,
  Save,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { showToast } from "@/components/Toaster";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "company" | "preferences" | "billing">("profile");

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Settings
          </h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-4 sticky top-24">
              <nav className="space-y-2">
                <SettingsNavItem
                  icon={User}
                  label="Profile"
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                />
                <SettingsNavItem
                  icon={Lock}
                  label="Security"
                  active={activeTab === "security"}
                  onClick={() => setActiveTab("security")}
                />
                <SettingsNavItem
                  icon={Bell}
                  label="Notifications"
                  active={activeTab === "notifications"}
                  onClick={() => setActiveTab("notifications")}
                />
                <SettingsNavItem
                  icon={Building}
                  label="Company"
                  active={activeTab === "company"}
                  onClick={() => setActiveTab("company")}
                />
                <SettingsNavItem
                  icon={Palette}
                  label="Preferences"
                  active={activeTab === "preferences"}
                  onClick={() => setActiveTab("preferences")}
                />
                <SettingsNavItem
                  icon={CreditCard}
                  label="Billing"
                  active={activeTab === "billing"}
                  onClick={() => setActiveTab("billing")}
                />
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="glass-effect rounded-2xl shadow-soft border border-white/20 p-8">
              {activeTab === "profile" && <ProfileSettings />}
              {activeTab === "security" && <SecuritySettings />}
              {activeTab === "notifications" && <NotificationSettings />}
              {activeTab === "company" && <CompanySettings />}
              {activeTab === "preferences" && <PreferenceSettings />}
              {activeTab === "billing" && <BillingSettings />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SettingsNavItem = ({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
      active
        ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md"
        : "text-gray-700 hover:bg-gray-100"
    }`}
  >
    <Icon className="h-5 w-5" />
    <span>{label}</span>
  </button>
);

const ProfileSettings = () => {
  const handleSave = () => {
    showToast("success", "Profile updated successfully!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile Settings</h2>
        <p className="text-gray-600">Update your personal information and profile picture</p>
      </div>

      {/* Profile Picture */}
      <div className="flex items-center space-x-6 pb-6 border-b border-gray-200">
        <div className="h-24 w-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-xl">
          <span className="text-white font-bold text-3xl">P</span>
        </div>
        <div>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Change Picture
          </Button>
          <p className="text-xs text-gray-500 mt-2">JPG, PNG or GIF. Max size 2MB.</p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="First Name" defaultValue="Paresh" />
        <Input label="Last Name" defaultValue="" />
        <Input label="Email Address" type="email" defaultValue="paresh@carthi.com" />
        <Input label="Phone Number" type="tel" defaultValue="+91 98765 43210" />
        <Input label="Job Title" defaultValue="System Administrator" />
        <Input label="Department" defaultValue="Management" />
      </div>

      <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

const SecuritySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Settings</h2>
        <p className="text-gray-600">Manage your password and security preferences</p>
      </div>

      {/* Change Password */}
      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Lock className="h-5 w-5 mr-2 text-blue-600" />
          Change Password
        </h3>
        <div className="space-y-4">
          <Input label="Current Password" type="password" />
          <Input label="New Password" type="password" />
          <Input label="Confirm New Password" type="password" />
        </div>
        <div className="mt-4">
          <Button>Update Password</Button>
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-600" />
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-600 mt-1">Add an extra layer of security</p>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-sm font-bold text-green-600">Enabled</span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          Configure 2FA
        </Button>
      </div>

      {/* Active Sessions */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Active Sessions</h3>
        <div className="space-y-3">
          <SessionItem
            device="Chrome on Windows"
            location="Mumbai, India"
            lastActive="Active now"
            current
          />
          <SessionItem
            device="Safari on iPhone"
            location="Delhi, India"
            lastActive="2 hours ago"
          />
        </div>
      </div>
    </div>
  );
};

const NotificationSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Notification Settings</h2>
        <p className="text-gray-600">Choose how you want to receive notifications</p>
      </div>

      <div className="space-y-4">
        <NotificationToggle
          icon={Mail}
          title="Email Notifications"
          description="Receive email updates about your leads and activities"
          defaultChecked
        />
        <NotificationToggle
          icon={Bell}
          title="Push Notifications"
          description="Get push notifications in your browser"
          defaultChecked
        />
        <NotificationToggle
          icon={Phone}
          title="SMS Notifications"
          description="Receive SMS alerts for urgent updates"
        />
        <NotificationToggle
          icon={CheckCircle}
          title="Lead Status Updates"
          description="Get notified when lead status changes"
          defaultChecked
        />
        <NotificationToggle
          icon={User}
          title="New Lead Assignments"
          description="Receive alerts when you're assigned a new lead"
          defaultChecked
        />
      </div>

      <div className="pt-6 border-t border-gray-200 flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

const CompanySettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Company Settings</h2>
        <p className="text-gray-600">Manage your company information and branding</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Input label="Company Name" defaultValue="CARTHI - Where Cars Meet People" />
        <Input label="Company Email" type="email" defaultValue="info@carthi.com" />
        <Input label="Company Phone" type="tel" defaultValue="+91 22 1234 5678" />
        <Input label="Website" type="url" defaultValue="https://www.carthi.com" />
        
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Company Address</label>
          <textarea
            rows={3}
            className="block w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-sm font-medium placeholder-gray-400 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 transition-all"
            defaultValue="123 Business Park, Andheri East, Mumbai - 400069, Maharashtra, India"
          />
        </div>

        <Select
          label="Time Zone"
          options={[
            { value: "IST", label: "India Standard Time (IST)" },
            { value: "PST", label: "Pacific Standard Time (PST)" },
            { value: "EST", label: "Eastern Standard Time (EST)" },
          ]}
          defaultValue="IST"
        />

        <Select
          label="Currency"
          options={[
            { value: "INR", label: "Indian Rupee (₹)" },
            { value: "USD", label: "US Dollar ($)" },
            { value: "EUR", label: "Euro (€)" },
          ]}
          defaultValue="INR"
        />
      </div>

      <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
        <Button variant="outline">Cancel</Button>
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

const PreferenceSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Preferences</h2>
        <p className="text-gray-600">Customize your application experience</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select
          label="Language"
          options={[
            { value: "en", label: "English" },
            { value: "hi", label: "Hindi" },
            { value: "mr", label: "Marathi" },
          ]}
          defaultValue="en"
        />

        <Select
          label="Date Format"
          options={[
            { value: "dd-mm-yyyy", label: "DD-MM-YYYY" },
            { value: "mm-dd-yyyy", label: "MM-DD-YYYY" },
            { value: "yyyy-mm-dd", label: "YYYY-MM-DD" },
          ]}
          defaultValue="dd-mm-yyyy"
        />

        <Select
          label="Theme"
          options={[
            { value: "light", label: "Light Mode" },
            { value: "dark", label: "Dark Mode" },
            { value: "auto", label: "Auto (System)" },
          ]}
          defaultValue="light"
        />

        <Select
          label="Items Per Page"
          options={[
            { value: "10", label: "10 items" },
            { value: "25", label: "25 items" },
            { value: "50", label: "50 items" },
          ]}
          defaultValue="25"
        />
      </div>

      {/* Data Management */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <Database className="h-5 w-5 mr-2 text-amber-600" />
          Data Management
        </h3>
        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Download className="h-4 w-4 mr-3" />
            Export All Data
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Upload className="h-4 w-4 mr-3" />
            Import Data
          </Button>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-200 flex justify-end">
        <Button>
          <Save className="h-4 w-4 mr-2" />
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

const BillingSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Billing & Subscription</h2>
        <p className="text-gray-600">Manage your subscription and payment methods</p>
      </div>

      {/* Current Plan */}
      <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-6 border-2 border-primary-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Professional Plan</h3>
            <p className="text-gray-600 mt-1">Active until Dec 31, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              ₹9,999
            </p>
            <p className="text-sm text-gray-600">per month</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">Change Plan</Button>
          <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50">
            Cancel Subscription
          </Button>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-green-600" />
          Payment Method
        </h3>
        <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900">•••• •••• •••• 4242</p>
              <p className="text-sm text-gray-600">Expires 12/2026</p>
            </div>
          </div>
          <Button variant="outline" size="sm">Update</Button>
        </div>
      </div>

      {/* Billing History */}
      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Billing History</h3>
        <div className="space-y-3">
          <BillingHistoryItem
            date="Dec 1, 2024"
            amount="₹9,999"
            status="Paid"
            invoice="INV-2024-12-001"
          />
          <BillingHistoryItem
            date="Nov 1, 2024"
            amount="₹9,999"
            status="Paid"
            invoice="INV-2024-11-001"
          />
          <BillingHistoryItem
            date="Oct 1, 2024"
            amount="₹9,999"
            status="Paid"
            invoice="INV-2024-10-001"
          />
        </div>
      </div>
    </div>
  );
};

// Helper Components
const SessionItem = ({
  device,
  location,
  lastActive,
  current = false,
}: {
  device: string;
  location: string;
  lastActive: string;
  current?: boolean;
}) => (
  <div className="flex items-center justify-between bg-white rounded-xl p-4 border border-gray-200">
    <div>
      <p className="font-semibold text-gray-900">{device}</p>
      <p className="text-sm text-gray-600">{location}</p>
      <p className="text-xs text-gray-500 mt-1">{lastActive}</p>
    </div>
    {current ? (
      <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
        Current
      </span>
    ) : (
      <Button variant="outline" size="sm">Revoke</Button>
    )}
  </div>
);

const NotificationToggle = ({
  icon: Icon,
  title,
  description,
  defaultChecked = false,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  defaultChecked?: boolean;
}) => {
  const [checked, setChecked] = useState(defaultChecked);

  return (
    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200">
      <div className="flex items-start space-x-4">
        <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-md">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-bold text-gray-900">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-secondary-500"></div>
      </label>
    </div>
  );
};

const BillingHistoryItem = ({
  date,
  amount,
  status,
  invoice,
}: {
  date: string;
  amount: string;
  status: string;
  invoice: string;
}) => (
  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-200 hover:shadow-md transition-all">
    <div>
      <p className="font-bold text-gray-900">{date}</p>
      <p className="text-sm text-gray-600">{invoice}</p>
    </div>
    <div className="flex items-center space-x-4">
      <p className="font-bold text-gray-900">{amount}</p>
      <span className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">
        {status}
      </span>
      <Button variant="outline" size="sm">
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>
    </div>
  </div>
);
