import { useState } from 'react';
import { forgotPassword } from '../api/authApi';
import Alert from './Alert';
import AuthLayout from './AuthLayout';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setResetLink('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const data = await forgotPassword({ email });
      setSuccess(data.message);
      setResetLink(data.resetLink || '');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset instructions.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot password"
      subtitle="Enter the email you registered with and we’ll help you reset your password."
      footerText="Remember it now?"
      footerLink="/login"
      footerLabel="Back to login"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
          <input
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        <button
          className="w-full rounded-2xl bg-ink px-4 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
