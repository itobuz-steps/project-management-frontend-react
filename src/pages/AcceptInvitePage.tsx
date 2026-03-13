import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { acceptInvite } from '../services/inviteService';
import { AxiosError } from 'axios';
import { useCountdown } from '../hooks/useCountdown';
import { message } from 'antd';

export function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { countdownStarted, startCountdown, countdown } = useCountdown(
    5,
    () => {
      navigate('/for-you');
    }
  );

  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    async function fetchData() {
      if (!token) {
        startCountdown();
        return;
      }

      try {
        await acceptInvite(token);
        setLoading(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          setLoading(false);
          message.error(
            error.response?.data?.message || 'Failed to accept invite'
          );
          setError(error.response?.data?.message || 'Failed to accept invite');
        }
      } finally {
        startCountdown();
      }
    }

    fetchData();
  }, [startCountdown, token]);

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center gap-3">
      {token && !error ? (
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
