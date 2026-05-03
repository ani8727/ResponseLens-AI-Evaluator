import { useState, useEffect } from 'react';
import ErrorAlert from '../components/common/ErrorAlert.jsx';
import LoadingSpinner from '../components/common/LoadingSpinner.jsx';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/useToast.jsx'; // Updated import path
import { useAsyncAction } from '../hooks/useAsyncAction.js';

function ProfilePage() {
  const { user, updateProfile, deactivateAccount, logout } = useAuth();
  const navigate = useNavigate();
  const { success } = useToast();

  const [formState, setFormState] = useState({
    name: user?.name || '',
    password: '',
  });
  const [localError, setLocalError] = useState('');

  const { execute: executeUpdateProfile, isLoading: isUpdatingProfile, error: updateProfileError } = useAsyncAction(
    updateProfile,
    'Profile updated successfully!'
  );

  const { execute: executeDeactivateAccount, isLoading: isDeactivatingAccount, error: deactivateAccountError } = useAsyncAction(
    deactivateAccount,
    'Account deactivated successfully!'
  );

  useEffect(() => {
    if (user) {
      setFormState((prev) => ({ ...prev, name: user.name }));
    }
  }, [user]);

  useEffect(() => {
    if (updateProfileError) setLocalError(updateProfileError);
    else if (deactivateAccountError) setLocalError(deactivateAccountError);
    else setLocalError('');
  }, [updateProfileError, deactivateAccountError]);


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLocalError('');
    try {
      await executeUpdateProfile(formState);
      setFormState((prev) => ({ ...prev, password: '' }));
    } catch (err) {
      setLocalError(err.message || 'Failed to update profile.');
    }
  };

  const handleDeactivate = async () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      setLocalError('');
      try {
        await executeDeactivateAccount();
        navigate('/login', { replace: true });
      } catch (err) {
        setLocalError(err.message || 'Failed to deactivate account.');
      }
    }
  };

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
      <h3 className="text-xl font-semibold text-white">User Profile</h3>
      <p className="mt-2 text-sm text-slate-400">Manage your account details.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm text-slate-300">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="w-full"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-2 block text-sm text-slate-300">
            Email (Read-only)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={user?.email || ''}
            readOnly
            className="w-full cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="role" className="mb-2 block text-sm text-slate-300">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={user?.role || ''}
            readOnly
            className="w-full cursor-not-allowed"
          />
        </div>
        <div>
          <label htmlFor="password" className="mb-2 block text-sm text-slate-300">
            New Password (leave blank to keep current)
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formState.password}
            onChange={handleChange}
            className="w-full"
            placeholder="********"
          />
        </div>

        <ErrorAlert message={localError} />

        <button
          type="submit"
          disabled={isUpdatingProfile}
          className="rounded-lg bg-cyan-600 px-5 py-2.5 font-medium text-white transition hover:bg-cyan-700 disabled:opacity-60"
        >
          {isUpdatingProfile ? <LoadingSpinner label="Updating..." /> : 'Update Profile'}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-slate-800">
        <h4 className="text-xl font-semibold text-red-500">Danger Zone</h4>
        <p className="mt-2 text-sm text-slate-400">Deactivating your account will permanently disable your access.</p>
        <button
          onClick={handleDeactivate}
          disabled={isDeactivatingAccount}
          className="mt-4 rounded-lg bg-red-600 px-5 py-2.5 font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {isDeactivatingAccount ? <LoadingSpinner label="Deactivating..." /> : 'Deactivate Account'}
        </button>
      </div>
    </section>
  );
}

export default ProfilePage;
