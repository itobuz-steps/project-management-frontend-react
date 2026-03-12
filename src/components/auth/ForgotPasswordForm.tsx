import { Link, useNavigate } from 'react-router';
import { Input } from '../common/Input';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import { usePasswordToggle } from '../../utils/passwordToggle';
import { Eye, EyeOff } from 'lucide-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { forgotPasswordSchema } from '../../schemas/authSchema';
import { formErrorHandler } from '../../utils/formErrorHandler';

interface IForgotPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export function ForgotPasswordForm() {
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown === 0) {
      return;
    }

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const { register, getValues, handleSubmit, trigger } =
    useForm<IForgotPasswordInput>({
      resolver: yupResolver(forgotPasswordSchema),
    });
  const { inputType, icon, togglePassword } = usePasswordToggle();
  const navigate = useNavigate();

  const submitHandler = async (data: IForgotPasswordInput) => {
    try {
      await authService.forgotPassword(data.email, data.otp, data.newPassword);
      toast.success(
        'Password reset successful! Please login with your new password.'
      );
      navigate('/login');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          'Password reset failed: ' +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const sendOtpHandler = async () => {
    const isValid = await trigger('email');

    if (!isValid) {
      return;
    }

    try {
      await authService.sendOtp(getValues('email'));
      setOtpSent(true);
      setCooldown(60);
      toast.success('OTP sent successfully!');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          'Failed to send otp: ' +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler, formErrorHandler)}
      className="forgot-form xs:min-w-75 flex flex-col items-center gap-3"
    >
      <div className="email xs:grid-cols-[3fr_1fr] xs:grid-rows-none mt-4 grid w-full grid-rows-[1fr_1fr] items-center gap-2">
        <Input
          id="email-input"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          required
        />
        <button
          onClick={sendOtpHandler}
          disabled={cooldown > 0}
          className="send bg-primary-500 hover:bg-primary-600 text-small h-full w-full cursor-pointer rounded-lg px-1 font-semibold text-white transition-all duration-300 disabled:cursor-not-allowed disabled:bg-gray-300"
          type="button"
        >
          Send OTP
        </button>
      </div>
      <div className="otp flex w-full flex-col items-center">
        <Input
          id="otp-input"
          type="text"
          placeholder="Enter OTP"
          disabled={!otpSent}
          {...register('otp')}
        />
      </div>
      <div className="new-password flex w-full flex-col items-center">
        <div className="relative w-full">
          <Input
            id="password-input"
            type={inputType}
            placeholder="Enter new password"
            className="pr-10"
            disabled={!otpSent}
            {...register('newPassword')}
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
            disabled={!otpSent}
          >
            {icon === 'eye' ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        </div>
      </div>

      <button
        className="reset-button bg-primary-500 hover:bg-primary-600 mt-5 w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-all duration-300"
        type="submit"
      >
        Reset Password
      </button>
      <p className="back-to-login mt-4">
        <Link
          to="/login"
          className="text-primary-300 hover:text-primary-400 self-end text-sm font-semibold transition-colors duration-300"
        >
          ← Back to Login
        </Link>
      </p>
    </form>
  );
}
