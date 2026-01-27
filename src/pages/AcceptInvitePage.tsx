import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { acceptInvite } from '../services/types/inviteService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';

export function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!countdownStarted) return;

    if (countdown === 0) {
      navigate('/dashboard');
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, countdownStarted, navigate]);

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        setCountdownStarted(true);
        return;
      }

      try {
        await acceptInvite(token);
        setLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          setLoading(false);
          toast.error(
            error.response?.data?.message || 'Failed to accept invite'
          );
        }
      } finally {
        setCountdownStarted(true);
      }
    }

    fetchData();
  }, [token]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3">
      {token ? (
        <h1 className="text-2xl font-semibold">
          {loading ? 'Accepting invite...' : 'Invite accepted!'}
        </h1>
      ) : (
        <h1 className="text-2xl font-semibold text-red-500">
          Invalid invite link
        </h1>
      )}

      {countdownStarted && (
        <h2 className="text-gray-600">
          Redirecting to dashboard in {countdown} seconds...
        </h2>
      )}
    </div>
  );
}
