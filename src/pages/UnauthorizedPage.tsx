// UnauthorizedPage.tsx
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        height: '70vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        // gap: 20,
      }}
    >
      <img
        src="/unauthorised.jpg"
        alt="Unauthorized"
        style={{ maxWidth: 400 }}
      />

      <Button
        style={{ backgroundColor: 'var(--color-primary-500)' }}
        type="primary"
        onClick={() => navigate(-1)}
      >
        Go Back
      </Button>
    </div>
  );
}
