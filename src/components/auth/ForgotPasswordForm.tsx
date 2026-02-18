import { Link, useNavigate } from 'react-router';
import { Input } from '../common/Input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface IForgotPasswordInput {
  email: string;
  otp: string;
  newPassword: string;
}

export function ForgotPasswordForm() {
  const [otpSent, setOtpSent] = useState(false);

  const {
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<IForgotPasswordInput>();

  const navigate = useNavigate();

  const submitHandler = (data: IForgotPasswordInput) => {
    try {
      authService.forgotPassword(data.email, data.otp, data.newPassword);
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
    try {
      if (errors.email) {
        toast.error('Please enter a valid email to send OTP.');
        return;
      }

      await authService.sendOtp(getValues('email'));
      setOtpSent(true);
      toast.success('OTP resent successfully!');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          'Failed to send otp: ' +
            (error.response?.data?.error || error.message)
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="forgot-form xs:min-w-75 flex flex-col items-center gap-3"
    >
      <div className="email xs:grid-cols-[3fr_1fr] xs:grid-rows-none mt-4 grid w-full grid-rows-[1fr_1fr] items-center gap-2">
        <Input
          id="email-input"
          type="email"
          placeholder="Enter your email"
          {...register('email', { required: true })}
        />
        <button
          onClick={sendOtpHandler}
          className="send bg-primary-500 hover:bg-primary-600 text-small h-full w-full cursor-pointer rounded-lg px-1 font-semibold text-white transition-all duration-300"
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
          {...register('otp', {
            required: true,
            minLength: 6,
            maxLength: 6,
            disabled: !otpSent,
          })}
        />
      </div>
      <div className="new-password flex w-full flex-col items-center">
        <Input
          id="password-input"
          type="password"
          placeholder="Enter new password"
          {...register('newPassword', {
            required: true,
            minLength: 8,
            pattern:
              /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).*$/,
            disabled: !otpSent,
          })}
        />
      </div>
      <div className="mr-auto max-w-xs flex-col text-start text-red-400">
        {errors.email && <p>Email is invalid</p>}
        {errors.newPassword?.type === 'required' && <p>Password is required</p>}
        {errors.newPassword?.type === 'minLength' && (
          <p>Password must be at least 8 characters</p>
        )}
        {errors.newPassword?.type === 'pattern' && (
          <p>
            Password must include at least one uppercase letter, one number, and
            one special character
          </p>
        )}
        {errors.otp && <p>OTP is invalid</p>}{' '}
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
