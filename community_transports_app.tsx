import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Download, LogOut, X } from 'lucide-react';

const storage = {
  async get(key) {
    try {
      const result = await window.storage.get(key);
      return result ? JSON.parse(result.value) : null;
    } catch (error) {
      return null;
    }
  },
  async set(key, value) {
    try {
      await window.storage.set(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Storage error:', error);
      return false;
    }
  },
  async list(prefix) {
    try {
      const result = await window.storage.list(prefix);
      return result ? result.keys : [];
    } catch (error) {
      return [];
    }
  }
};

const DISTRICTS = [
  'Aldine ISD', 'Alief ISD', 'Alvin ISD', 'Barbers Hill ISD', 'Channelview ISD',
  'Clear Creek ISD', 'Conroe ISD', 'Crosby ISD', 'Cypress-Fairbanks ISD', 'Dayton ISD',
  'Deer Park ISD', 'Dickinson ISD', 'Fort Bend ISD', 'Friendswood ISD', 'Galena Park ISD',
  'Goose Creek CISD', 'Huffman ISD', 'Humble ISD', 'Katy ISD', 'Klein ISD',
  'Lamar Consolidated ISD', 'New Caney ISD', 'Pasadena ISD', 'Pearland ISD',
  'Sheldon ISD', 'Spring ISD', 'Spring Branch ISD', 'Tomball ISD'
];

function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await storage.get('current_user');
      if (user) {
        setCurrentUser(user);
        setIsAdmin(user.role === 'admin');
        if (user.role === 'admin') {
          setCurrentPage('admin');
        } else {
          setCurrentPage('applicant-dashboard');
        }
      }
    };
    checkAuth();
  }, []);

  const logout = async () => {
    await storage.set('current_user', null);
    setCurrentUser(null);
    setIsAdmin(false);
    setCurrentPage('landing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {currentPage === 'landing' && <LandingPage setCurrentPage={setCurrentPage} />}
      {currentPage === 'register' && <RegisterPage setCurrentPage={setCurrentPage} setCurrentUser={setCurrentUser} />}
      {currentPage === 'login' && <LoginPage setCurrentPage={setCurrentPage} setCurrentUser={setCurrentUser} setIsAdmin={setIsAdmin} />}
      {currentPage === 'application' && <ApplicationForm currentUser={currentUser} setCurrentPage={setCurrentPage} />}
      {currentPage === 'applicant-dashboard' && <ApplicantDashboard currentUser={currentUser} logout={logout} />}
      {currentPage === 'admin' && <AdminDashboard logout={logout} />}
      {currentPage === 'privacy' && <PrivacyPolicy setCurrentPage={setCurrentPage} />}
      {currentPage === 'terms' && <TermsOfService setCurrentPage={setCurrentPage} />}
    </div>
  );
}

function LandingPage({ setCurrentPage }) {
  return (
    <div className="min-h-screen">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Community Transports</h1>
          <div className="space-x-4">
            <button onClick={() => setCurrentPage('login')} className="text-indigo-600 hover:text-indigo-800 font-medium">
              Sign In
            </button>
            <button onClick={() => setCurrentPage('register')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">
              Apply Now
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Drive with Purpose — Join Community Transports
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Make a difference in children's lives while earning competitive pay. Transport students to and from Houston-area schools with flexible hours and no weekend or holiday work.
          </p>
          <button onClick={() => setCurrentPage('register')} className="bg-indigo-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-105">
            Start Your Application
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-indigo-600 text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-2">Competitive Pay</h3>
            <p className="text-gray-600">Earn $30-$100 per day providing essential transportation services</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-indigo-600 text-4xl mb-4">⏰</div>
            <h3 className="text-xl font-bold mb-2">Flexible Schedule</h3>
            <p className="text-gray-600">No weekends or holidays required. Work around your life.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md">
            <div className="text-indigo-600 text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Meaningful Work</h3>
            <p className="text-gray-600">Help students get to school safely and on time every day</p>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-2xl font-bold mb-6">Requirements</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <span>21 years of age or older</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <span>Valid driver's license</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <span>4-door car, van, or SUV less than 15 years old</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
              <span>Vehicle registered in Texas</span>
            </li>
          </ul>
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-x-6 mb-4">
            <button onClick={() => setCurrentPage('privacy')} className="text-gray-300 hover:text-white">Privacy Policy</button>
            <button onClick={() => setCurrentPage('terms')} className="text-gray-300 hover:text-white">Terms of Service</button>
          </div>
          <p className="text-gray-400">© 2025 Community Transports LLC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function RegisterPage({ setCurrentPage, setCurrentUser }) {
  const [formData, setFormData] = useState({ email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const existingUser = await storage.get('user:' + formData.email);
    if (existingUser) {
      setError('An account with this email already exists');
      return;
    }

    const user = {
      email: formData.email,
      password: formData.password,
      role: 'applicant',
      createdAt: new Date().toISOString()
    };

    await storage.set('user:' + formData.email, user);
    await storage.set('current_user', user);
    setCurrentUser(user);
    setSuccess(true);
    
    setTimeout(() => {
      setCurrentPage('application');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Create Account</h2>
        
        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-green-800 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Account created successfully! Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {error}
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
              Create Account
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{' '}
          <button onClick={() => setCurrentPage('login')} className="text-indigo-600 hover:text-indigo-800 font-medium">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginPage({ setCurrentPage, setCurrentUser, setIsAdmin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.email === 'tamiyahcommunitytransportsllc@gmail.com
' && formData.password === 'admin123') {
      const adminUser = { email: formData.email, role: 'admin' };
      await storage.set('current_user', adminUser);
      setCurrentUser(adminUser);
      setIsAdmin(true);
      setCurrentPage('admin');
      return;
    }

    const user = await storage.get('user:' + formData.email);
    if (!user || user.password !== formData.password) {
      setError('Invalid email or password');
      return;
    }

    await storage.set('current_user', user);
    setCurrentUser(user);
    
    const application = await storage.get('application:' + formData.email);
    if (application) {
      setCurrentPage('applicant-dashboard');
    } else {
      setCurrentPage('application');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Sign In</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Sign In
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <button onClick={() => setCurrentPage('register')} className="text-indigo-600 hover:text-indigo-800 font-medium">
            Apply now
          </button>
        </p>
      </div>
    </div>
  );
}

function ApplicationForm({ currentUser, setCurrentPage }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: currentUser?.email || '',
    over21: '',
    validLicense: '',
    validVehicle: '',
    texasRegistered: '',
    districts: [],
    consent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [isEligible, setIsEligible] = useState(true);

  const handleDistrictChange = (district, checked) => {
    if (checked) {
      const newDistricts = formData.districts.slice();
      newDistricts.push(district);
      setFormData({...formData, districts: newDistricts});
    } else {
      const newDistricts = formData.districts.filter(d => d !== district);
      setFormData({...formData, districts: newDistricts});
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const eligible = formData.over21 === 'yes' && 
                     formData.validLicense === 'yes' && 
                     formData.validVehicle === 'yes' && 
                     formData.texasRegistered === 'yes';

    const application = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      over21: formData.over21,
      validLicense: formData.validLicense,
      validVehicle: formData.validVehicle,
      texasRegistered: formData.texasRegistered,
      districts: formData.districts,
      consent: formData.consent,
      status: eligible ? 'Eligible' : 'Not Eligible',
      submittedAt: new Date().toISOString(),
      verifications: {
        drugTest: false,
        backgroundCheck: false,
        englishValidation: false
      },
      adminNotes: ''
    };

    await storage.set('application:' + currentUser.email, application);
    setIsEligible(eligible);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl w-full">
          {isEligible ? (
            <React.Fragment>
              <div className="text-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Submitted!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for applying to Community Transports. Your application has been received and is under review.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg mb-4">Next Steps - Complete Required Verifications:</h3>
                <div className="space-y-4">
                  <div>
                    <a href="https://clearviewtesting.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium underline">
                      1. Clearview Testing - Drug Test ($25)
                    </a>
                  </div>
                  <div>
                    <a href="https://www.identogo.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium underline">
                      2. Identogo - Background Check ($37)
                    </a>
                  </div>
                  <div>
                    <a href="https://contractorcompliance.io" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium underline">
                      3. Contractor Compliance - English Validation
                    </a>
                  </div>
                </div>
              </div>

              <button onClick={() => setCurrentPage('applicant-dashboard')} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                Go to Dashboard
              </button>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <div className="text-center mb-6">
                <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Received</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for your interest in Community Transports. Unfortunately, you do not currently meet all eligibility requirements.
                </p>
                <p className="text-gray-600">
                  Please feel free to reapply once you meet all requirements. We appreciate your interest in joining our team.
                </p>
              </div>

              <button onClick={() => setCurrentPage('landing')} className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
                Return to Home
              </button>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Driver Application</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Legal First Name *</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Legal Last Name *</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
            <input
              type="email"
              required
              value={formData.email}
              disabled
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div className="space-y-4">
            <div className="border-l-4 border-indigo-500 pl-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Are you 21 years old or older? *</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    required
                    value="yes"
                    checked={formData.over21 === 'yes'}
                    onChange={(e) => setFormData({...formData, over21: e.target.value})}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    required
                    value="no"
                    checked={formData.over21 === 'no'}
                    onChange={(e) => setFormData({...formData, over21: e.target.value})}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="border-l-4 border-indigo-500 pl-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Do you have a valid driver's license? *</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    required
                    value="yes"
                    checked={formData.validLicense === 'yes'}
                    onChange={(e) => setFormData({...formData, validLicense: e.target.value})}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    required
                    value="no"
                    checked={formData.validLicense === 'no'}
                    onChange={(e) => setFormData({...formData, validLicense: e.target.value})}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="border-l-4 border-indigo-500 pl-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Is your vehicle a 4-door car, van, or SUV less than 15 years old? *</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    required
                    value="yes"
                    checked={formData.validVehicle === 'yes'}
                    onChange={(e) => setFormData({...formData, validVehicle: e.target.value})}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    required
                    value="no"
                    checked={formData.validVehicle === 'no'}
                    onChange={(e) => setFormData({...formData, validVehicle: e.target.value})}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>

            <div className="border-l-4 border-indigo-500 pl-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Is your vehicle registered in Texas? *</label>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    required
                    value="yes"
                    checked={formData.texasRegistered === 'yes'}
                    onChange={(e) => setFormData({...formData, texasRegistered: e.target.value})}
                    className="mr-2"
                  />
                  Yes
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    required
                    value="no"
                    checked={formData.texasRegistered === 'no'}
                    onChange={(e) => setFormData({...formData, texasRegistered: e.target.value})}
                    className="mr-2"
                  />
                  No
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School Districts You Can Service * (Select all that apply)</label>
            <div className="grid md:grid-cols-2 gap-2 max-h-64 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {DISTRICTS.map(district => (
                <label key={district} className="flex items-center">
                  <input
                    type="checkbox"
                    value={district}
                    checked={formData.districts.includes(district)}
                    onChange={(e) => handleDistrictChange(district, e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">{district}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <label className="flex items-start">
              <input
                type="checkbox"
                required
                checked={formData.consent}
                onChange={(e) => setFormData({...formData, consent: e.target.checked})}
                className="mr-3 mt-1"
              />
              <span className="text-sm text-gray-700">
                I consent to Community Transports collecting and storing my personal information, and I understand that employment is contingent upon passing required drug testing and background checks. I have read and agree to the Privacy Policy and Terms of Service. *
              </span>
            </label>
          </div>

          <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}

function ApplicantDashboard({ currentUser, logout }) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplication = async () => {
      const app = await storage.get('application:' + currentUser.email);
      setApplication(app);
      setLoading(false);
    };
    loadApplication();
  }, [currentUser]);

  if (loading) {
    return React.createElement('div', { className: 'min-h-screen flex items-center justify-center' }, 'Loading...');
  }

  if (!application) {
    return React.createElement('div', { className: 'min-h-screen flex items-center justify-center' },
      React.createElement('div', { className: 'text-center' },
        React.createElement('p', null, 'No application found. Please complete your application.')
      )
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900">My Application</h2>
            <button onClick={logout} className="flex items-center text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>

          <div className="mb-6">
            <div className={'inline-block px-4 py-2 rounded-full font-semibold ' + (application.status === 'Eligible' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800')}>
              Status: {application.status}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Personal Information</h3>
              <p className="text-gray-600">Name: {application.firstName} {application.lastName}</p>
              <p className="text-gray-600">Email: {application.email}</p>
              <p className="text-gray-600">Submitted: {new Date(application.submittedAt).toLocaleDateString()}</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Eligibility</h3>
              <p className="text-gray-600">Age 21+: {application.over21 === 'yes' ? '✓' : '✗'}</p>
              <p className="text-gray-600">Valid License: {application.validLicense === 'yes' ? '✓' : '✗'}</p>
              <p className="text-gray-600">Valid Vehicle: {application.validVehicle === 'yes' ? '✓' : '✗'}</p>
              <p className="text-gray-600">TX Registered: {application.texasRegistered === 'yes' ? '✓' : '✗'}</p>
            </div>
          </div>

          {application.status === 'Eligible' && (
            <React.Fragment>
              <div className="mb-8">
                <h3 className="font-semibold text-gray-700 mb-4">Verification Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Drug Test (Clearview Testing)</span>
                    {application.verifications.drugTest ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <a href="https://clearviewtesting.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Complete ($25)
                      </a>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>Background Check (Identogo)</span>
                    {application.verifications.backgroundCheck ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <a href="https://www.identogo.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Complete ($37)
                      </a>
                    )}
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span>English Validation (Contractor Compliance)</span>
                    {application.verifications.englishValidation ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <a href="https://contractorcompliance.io" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-medium">
                        Complete
                      </a>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-2">Districts Selected</h3>
                <div className="flex flex-wrap gap-2">
                  {application.districts.map(district => (
                    <span key={district} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      {district}
                    </span>
                  ))}
                </div>
              </div>
            </React.Fragment>
          )}

          {application.adminNotes && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Admin Notes</h3>
              <p className="text-gray-600">{application.adminNotes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ logout }) {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', district: 'all', search: '' });
  const [selectedApp, setSelectedApp] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applications, filters]);

  const loadApplications = async () => {
    const keys = await storage.list('application:');
    const apps = [];
    
    for (const key of keys) {
      const app = await storage.get(key);
      if (app) apps.push(app);
    }
    
    setApplications(apps);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = applications.slice();

    if (filters.status !== 'all') {
      filtered = filtered.filter(app => app.status === filters.status);
    }

    if (filters.district !== 'all') {
      filtered = filtered.filter(app => app.districts.includes(filters.district));
    }

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.firstName.toLowerCase().includes(search) ||
        app.lastName.toLowerCase().includes(search) ||
        app.email.toLowerCase().includes(search)
      );
    }

    setFilteredApps(filtered);
  };

  const updateVerification = async (email, field, value) => {
    const app = await storage.get('application:' + email);
    app.verifications[field] = value;
    await storage.set('application:' + email, app);
    loadApplications();
  };

  const saveNotes = async () => {
    if (selectedApp) {
      const app = await storage.get('application:' + selectedApp.email);
      app.adminNotes = adminNotes;
      await storage.set('application:' + selectedApp.email, app);
      loadApplications();
      setSelectedApp(null);
      setAdminNotes('');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Status', 'Submitted', 'Age 21+', 'Valid License', 'Valid Vehicle', 'TX Registered', 'Districts'];
    const rows = filteredApps.map(app => [
      app.firstName + ' ' + app.lastName,
      app.email,
      app.status,
      new Date(app.submittedAt).toLocaleDateString(),
      app.over21,
      app.validLicense,
      app.validVehicle,
      app.texasRegistered,
      app.districts.join('; ')
    ]);

    const csvRows = [headers].concat(rows);
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = 'applications_' + dateStr + '.csv';
    link.click();
  };

  if (loading) {
    return React.createElement('div', { className: 'min-h-screen flex items-center justify-center' }, 'Loading...');
  }

  const eligibleCount = applications.filter(a => a.status === 'Eligible').length;
  const notEligibleCount = applications.filter(a => a.status === 'Not Eligible').length;
  const todayCount = applications.filter(a => new Date(a.submittedAt).toDateString() === new Date().toDateString()).length;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
              <p className="text-gray-600 mt-1">Total Applications: {applications.length}</p>
            </div>
            <button onClick={logout} className="flex items-center text-gray-600 hover:text-gray-900">
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-blue-600 text-sm font-medium">Total</p>
              <p className="text-2xl font-bold text-blue-900">{applications.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-green-600 text-sm font-medium">Eligible</p>
              <p className="text-2xl font-bold text-green-900">{eligibleCount}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-amber-600 text-sm font-medium">Not Eligible</p>
              <p className="text-2xl font-bold text-amber-900">{notEligibleCount}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-600 text-sm font-medium">Today</p>
              <p className="text-2xl font-bold text-purple-900">{todayCount}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Eligible">Eligible</option>
              <option value="Not Eligible">Not Eligible</option>
            </select>

            <select
              value={filters.district}
              onChange={(e) => setFilters({...filters, district: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Districts</option>
              {DISTRICTS.map(d => React.createElement('option', { key: d, value: d }, d))}
            </select>

            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Submitted</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Verifications</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredApps.map(app => (
                  <tr key={app.email} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{app.firstName} {app.lastName}</td>
                    <td className="px-4 py-3 text-sm">{app.email}</td>
                    <td className="px-4 py-3">
                      <span className={'px-2 py-1 rounded-full text-xs font-semibold ' + (app.status === 'Eligible' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800')}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(app.submittedAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      {app.status === 'Eligible' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateVerification(app.email, 'drugTest', !app.verifications.drugTest)}
                            className={'px-2 py-1 rounded text-xs ' + (app.verifications.drugTest ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')}
                          >
                            Drug
                          </button>
                          <button
                            onClick={() => updateVerification(app.email, 'backgroundCheck', !app.verifications.backgroundCheck)}
                            className={'px-2 py-1 rounded text-xs ' + (app.verifications.backgroundCheck ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')}
                          >
                            BG
                          </button>
                          <button
                            onClick={() => updateVerification(app.email, 'englishValidation', !app.verifications.englishValidation)}
                            className={'px-2 py-1 rounded text-xs ' + (app.verifications.englishValidation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600')}
                          >
                            Eng
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setAdminNotes(app.adminNotes || '');
                        }}
                        className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApps.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No applications found matching your filters.
            </div>
          )}
        </div>

        {selectedApp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Application Details</h3>
                <button onClick={() => setSelectedApp(null)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Personal Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                    <p><span className="font-medium">Name:</span> {selectedApp.firstName} {selectedApp.lastName}</p>
                    <p><span className="font-medium">Email:</span> {selectedApp.email}</p>
                    <p><span className="font-medium">Submitted:</span> {new Date(selectedApp.submittedAt).toLocaleString()}</p>
                    <p><span className="font-medium">Status:</span> {selectedApp.status}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Eligibility Responses</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-1">
                    <p>Age 21+: {selectedApp.over21 === 'yes' ? '✓ Yes' : '✗ No'}</p>
                    <p>Valid License: {selectedApp.validLicense === 'yes' ? '✓ Yes' : '✗ No'}</p>
                    <p>Valid Vehicle: {selectedApp.validVehicle === 'yes' ? '✓ Yes' : '✗ No'}</p>
                    <p>TX Registered: {selectedApp.texasRegistered === 'yes' ? '✓ Yes' : '✗ No'}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Districts ({selectedApp.districts.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedApp.districts.map(d => (
                      <span key={d} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedApp.status === 'Eligible' && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Verification Status</h4>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <p>Drug Test: {selectedApp.verifications.drugTest ? '✓ Complete' : '○ Pending'}</p>
                      <p>Background Check: {selectedApp.verifications.backgroundCheck ? '✓ Complete' : '○ Pending'}</p>
                      <p>English Validation: {selectedApp.verifications.englishValidation ? '✓ Complete' : '○ Pending'}</p>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Admin Notes</h4>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows="4"
                    placeholder="Add notes about this application..."
                  />
                  <button
                    onClick={saveNotes}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PrivacyPolicy({ setCurrentPage }) {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <button onClick={() => setCurrentPage('landing')} className="text-indigo-600 hover:text-indigo-800 mb-6">
          ← Back to Home
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p><strong>Effective Date:</strong> January 2026</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Information We Collect</h2>
          <p>We collect personal information including your name, email address, and responses to eligibility questions when you apply to become a driver.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. How We Use Your Information</h2>
          <p>Your information is used to process your driver application, conduct required background checks and drug testing, and communicate with you regarding your application status.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information, including encryption of data in transit and at rest.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Third-Party Services</h2>
          <p>We work with third-party verification services (Clearview Testing, Identogo, Contractor Compliance) to complete required checks. Your information will be shared with these services as necessary.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Contact us at tamiyahcommunitytransportsllc@gmail.com for requests.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Contact Us</h2>
          <p>For questions about this Privacy Policy, contact us at tamiyahcommunitytransportsllc@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

function TermsOfService({ setCurrentPage }) {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg">
        <button onClick={() => setCurrentPage('landing')} className="text-indigo-600 hover:text-indigo-800 mb-6">
          ← Back to Home
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        
        <div className="prose max-w-none space-y-4 text-gray-700">
          <p><strong>Effective Date:</strong> January 2026</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
          <p>By submitting an application, you agree to these Terms of Service and our Privacy Policy.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">2. Eligibility Requirements</h2>
          <p>Applicants must be at least 21 years old, hold a valid driver's license, and own a qualifying vehicle registered in Texas.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">3. Background Checks and Testing</h2>
          <p>Employment is contingent upon successful completion of drug testing and background checks. You consent to these checks by submitting your application.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">4. Application Process</h2>
          <p>We reserve the right to reject any application at our discretion. Application does not guarantee employment.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">5. Accuracy of Information</h2>
          <p>You agree to provide accurate and truthful information in your application. False information may result in disqualification.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">6. Changes to Terms</h2>
          <p>We may update these terms at any time. Continued use of our services constitutes acceptance of updated terms.</p>
          
          <h2 className="text-xl font-semibold mt-6 mb-3">7. Contact Information</h2>
          <p>For questions about these Terms, contact us at tamiyahcommunitytransportsllc@gmail.com</p>
        </div>
      </div>
    </div>
  );
}

export default App;