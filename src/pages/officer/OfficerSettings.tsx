import { useState, useEffect } from 'react';
import { OfficerLayout } from '../../components/officer/OfficerLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  User, 
  Settings, 
  MessageSquare, 
  Save,
  Eye,
  EyeOff
} from 'lucide-react';

// Types for backend integration
interface OfficerProfile {
  id: string;
  fullName: string;
  agentId: string;
  email: string;
  phoneNumber: string;
  counterStation: string;
  shiftSchedule: string;
  role: string;
  avatar?: string;
}

interface LanguagePreferences {
  english: boolean;
  sinhala: boolean;
  tamil: boolean;
}

interface DisplayPreferences {
  darkMode: boolean;
  highContrast: boolean;
  largeText: boolean;
  compactView: boolean;
}

interface SystemSettings {
  autoRefreshInterval: number; // seconds
  defaultServiceTime: number; // minutes
  announcementLanguage: string;
}

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface SettingsData {
  profile: OfficerProfile;
  languagePreferences: LanguagePreferences;
  displayPreferences: DisplayPreferences;
  systemSettings: SystemSettings;
}

// API functions for backend developers
const settingsAPI = {
  // GET /api/officer/profile/:officerId
  getOfficerProfile: async (officerId: string): Promise<SettingsData> => {
    // TODO: Backend developers implement this endpoint
    console.log('API Call: getOfficerProfile', { officerId });
    
    // Mock data for frontend development
    return mockSettingsData;
  },

  // PUT /api/officer/profile/:officerId
  updateOfficerProfile: async (officerId: string, profile: Partial<OfficerProfile>): Promise<void> => {
    // TODO: Backend developers implement this endpoint
    console.log('API Call: updateOfficerProfile', { officerId, profile });
  },

  // PUT /api/officer/preferences/:officerId
  updatePreferences: async (officerId: string, preferences: {
    language?: LanguagePreferences;
    display?: DisplayPreferences;
    system?: SystemSettings;
  }): Promise<void> => {
    // TODO: Backend developers implement this endpoint
    console.log('API Call: updatePreferences', { officerId, preferences });
  },

  // POST /api/officer/change-password
  changePassword: async (officerId: string, passwordData: PasswordChangeRequest): Promise<void> => {
    // TODO: Backend developers implement this endpoint
    console.log('API Call: changePassword', { officerId, passwordData: { ...passwordData, currentPassword: '***', newPassword: '***' } });
  },

  // POST /api/officer/upload-avatar
  uploadAvatar: async (officerId: string, file: File): Promise<string> => {
    // TODO: Backend developers implement this endpoint
    console.log('API Call: uploadAvatar', { officerId, fileName: file.name });
    
    // Mock implementation
    return '/api/uploads/avatar-' + Date.now() + '.jpg';
  }
};

// Mock data for development (Backend developers can use this as reference)
const mockSettingsData: SettingsData = {
  profile: {
    id: 'AG10045',
    fullName: 'John Perera',
    agentId: 'AG10045',
    email: 'john.p@sltmobitel.lk',
    phoneNumber: '071-555-1234',
    counterStation: 'Counter 3',
    shiftSchedule: '8:00 AM - 5:00 PM',
    role: 'Customer Care Officer'
  },
  languagePreferences: {
    english: true,
    sinhala: true,
    tamil: false
  },
  displayPreferences: {
    darkMode: false,
    highContrast: false,
    largeText: false,
    compactView: true
  },
  systemSettings: {
    autoRefreshInterval: 30,
    defaultServiceTime: 15,
    announcementLanguage: 'English'
  }
};

export function OfficerSettings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'settings'>('profile');
  const [settingsData, setSettingsData] = useState<SettingsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Form states
  const [profileForm, setProfileForm] = useState<Partial<OfficerProfile>>({});
  const [languageForm, setLanguageForm] = useState<LanguagePreferences>({
    english: false,
    sinhala: false,
    tamil: false
  });
  const [displayForm, setDisplayForm] = useState<DisplayPreferences>({
    darkMode: false,
    highContrast: false,
    largeText: false,
    compactView: false
  });
  const [passwordForm, setPasswordForm] = useState<PasswordChangeRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Get officer data from localStorage
  const officerData = JSON.parse(localStorage.getItem('officer_data') || '{}');
  const officerId = officerData.id || 'officer1';

  useEffect(() => {
    loadSettingsData();
  }, []);

  const loadSettingsData = async () => {
    setIsLoading(true);
    try {
      const data = await settingsAPI.getOfficerProfile(officerId);
      setSettingsData(data);
      setProfileForm(data.profile);
      setLanguageForm(data.languagePreferences);
      setDisplayForm(data.displayPreferences);
    } catch (error) {
      console.error('Failed to load settings:', error);
      // Use mock data on error to ensure UI displays
      setSettingsData(mockSettingsData);
      setProfileForm(mockSettingsData.profile);
      setLanguageForm(mockSettingsData.languagePreferences);
      setDisplayForm(mockSettingsData.displayPreferences);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      await settingsAPI.updateOfficerProfile(officerId, profileForm);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
      // Update localStorage with new data
      const updatedOfficerData = { ...officerData, ...profileForm };
      localStorage.setItem('officer_data', JSON.stringify(updatedOfficerData));
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);
    try {
      await settingsAPI.updatePreferences(officerId, {
        language: languageForm,
        display: displayForm
      });
      setSuccessMessage('Preferences updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update preferences:', error);
      alert('Failed to update preferences. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    setIsSaving(true);
    try {
      await settingsAPI.changePassword(officerId, passwordForm);
      setSuccessMessage('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to change password:', error);
      alert('Failed to change password. Please check your current password.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <OfficerLayout title="Settings & Profile">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </OfficerLayout>
    );
  }

  if (!settingsData) {
    return (
      <OfficerLayout title="Settings & Profile">
        <div className="text-center py-12">
          <p className="text-gray-600">Unable to load settings data.</p>
          <Button onClick={loadSettingsData} className="mt-4">
            Retry
          </Button>
        </div>
      </OfficerLayout>
    );
  }

  return (
    <OfficerLayout title="Settings & Profile">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800">{successMessage}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Profile Card & Navigation */}
          <div className="lg:col-span-4">
            <Card padding="lg">
              {/* Profile Avatar */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {settingsData.profile.fullName.charAt(0)}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{settingsData.profile.fullName}</h3>
                <p className="text-sm text-gray-600">{settingsData.profile.agentId}</p>
                <p className="text-sm text-gray-600">{settingsData.profile.role}</p>
              </div>

              {/* Navigation Tabs */}
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'preferences'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <MessageSquare className="w-5 h-5" />
                  <span>Preferences</span>
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === 'settings'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
              </div>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-8">
            <Card padding="lg">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Full Name"
                        value={profileForm.fullName || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                        fullWidth
                      />
                      <Input
                        label="Agent ID"
                        value={profileForm.agentId || ''}
                        disabled
                        fullWidth
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={profileForm.email || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, email: e.target.value }))}
                        fullWidth
                      />
                      <Input
                        label="Phone Number"
                        value={profileForm.phoneNumber || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        fullWidth
                      />
                      <Input
                        label="Counter/Station"
                        value={profileForm.counterStation || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, counterStation: e.target.value }))}
                        fullWidth
                      />
                      <Input
                        label="Shift Schedule"
                        value={profileForm.shiftSchedule || ''}
                        onChange={(e) => setProfileForm(prev => ({ ...prev, shiftSchedule: e.target.value }))}
                        fullWidth
                      />
                    </div>

                    {/* Language Proficiency */}
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Language Proficiency</h4>
                      <div className="space-y-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={languageForm.english}
                            onChange={(e) => setLanguageForm(prev => ({ ...prev, english: e.target.checked }))}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">English</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={languageForm.sinhala}
                            onChange={(e) => setLanguageForm(prev => ({ ...prev, sinhala: e.target.checked }))}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Sinhala</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={languageForm.tamil}
                            onChange={(e) => setLanguageForm(prev => ({ ...prev, tamil: e.target.checked }))}
                            className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm text-gray-700">Tamil</span>
                        </label>
                      </div>
                    </div>

                    {/* Change Password */}
                    <div className="mt-8">
                      <h4 className="text-md font-medium text-gray-900 mb-3">Change Password</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <Input
                            label="Current password"
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            placeholder="Current password"
                            fullWidth
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                          >
                            {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        <div className="relative">
                          <Input
                            label="New password"
                            type={showNewPassword ? 'text' : 'password'}
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            placeholder="New password"
                            fullWidth
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                          >
                            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSaveProfile}
                      isLoading={isSaving}
                      className="px-8"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
                    
                    {/* Language Selection */}
                    <div className="mb-8">
                      <h4 className="text-md font-medium text-gray-900 mb-4">Language Selection</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-4 border-2 border-blue-600 rounded-lg bg-blue-50">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-white font-semibold">🌐</span>
                          </div>
                          <p className="font-medium text-gray-900">English</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-gray-600 font-semibold">🌐</span>
                          </div>
                          <p className="font-medium text-gray-900">සිංහල</p>
                        </div>
                        <div className="text-center p-4 border-2 border-gray-200 rounded-lg hover:border-gray-300 cursor-pointer">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-gray-600 font-semibold">🌐</span>
                          </div>
                          <p className="font-medium text-gray-900">தமிழ்</p>
                        </div>
                      </div>
                    </div>

                    {/* Display Preferences */}
                    <div>
                      <h4 className="text-md font-medium text-gray-900 mb-4">Display Preferences</h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Dark Mode</p>
                            <p className="text-sm text-gray-600">Use dark theme for better eye comfort</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={displayForm.darkMode}
                              onChange={(e) => setDisplayForm(prev => ({ ...prev, darkMode: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">High Contrast</p>
                            <p className="text-sm text-gray-600">Increase contrast for better visibility</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={displayForm.highContrast}
                              onChange={(e) => setDisplayForm(prev => ({ ...prev, highContrast: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-3 border-b border-gray-200">
                          <div>
                            <p className="font-medium text-gray-900">Large Text</p>
                            <p className="text-sm text-gray-600">Increase text size for better readability</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={displayForm.largeText}
                              onChange={(e) => setDisplayForm(prev => ({ ...prev, largeText: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between py-3">
                          <div>
                            <p className="font-medium text-gray-900">Compact View</p>
                            <p className="text-sm text-gray-600">Show more information in less space</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={displayForm.compactView}
                              onChange={(e) => setDisplayForm(prev => ({ ...prev, compactView: e.target.checked }))}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-blue-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSavePreferences}
                      isLoading={isSaving}
                      className="px-8"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              )}

              {/* System Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">System Settings</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Auto-refresh Intervals (seconds)
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="30">30 seconds</option>
                          <option value="60">1 minute</option>
                          <option value="120">2 minutes</option>
                          <option value="300">5 minutes</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Service Time (minutes)
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="15">15 minutes</option>
                          <option value="20">20 minutes</option>
                          <option value="30">30 minutes</option>
                          <option value="45">45 minutes</option>
                        </select>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Announcement Language
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="English">English</option>
                          <option value="Sinhala">Sinhala</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Multi">Multi-language</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSavePreferences}
                      isLoading={isSaving}
                      className="px-8"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save System Settings
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </OfficerLayout>
  );
}