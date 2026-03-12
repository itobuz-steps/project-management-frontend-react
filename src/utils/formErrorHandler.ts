import type { FieldErrors, FieldValues } from 'react-hook-form';
import { toast } from 'react-toastify';

export function formErrorHandler<T extends FieldValues>(
  errors: FieldErrors<T>
) {
  const firstError = Object.values(errors)[0];

  if (firstError?.message) {
    toast.error(firstError.message as string);
  }
}
