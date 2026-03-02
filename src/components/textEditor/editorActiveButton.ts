export const getActiveStyle = (active: boolean) =>
  active
    ? {
        backgroundColor: 'var(--color-primary-100)',
        color: 'var(--color-primary-600)',
      }
    : undefined;
