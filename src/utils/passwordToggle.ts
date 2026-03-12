import { useState } from 'react';

export function usePasswordToggle() {
  const [visible, setVisible] = useState(false);

  const togglePassword = () => {
    setVisible((prev) => !prev);
  };

  const inputType = visible ? 'text' : 'password';
  const icon = visible ? 'eye-off' : 'eye';

  return { inputType, icon, togglePassword };
}
