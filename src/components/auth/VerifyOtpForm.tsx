import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { Input } from '../common/Input';

interface IVerifyOtpInput {
  otp: string;
}

export function VerifyOtpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IVerifyOtpInput>();

  const [searchParams] = useSearchParams();

  const navigate = useNavigate();

  useEffect(() => {
    const email = searchParams.get('email');
    if (!email) {
      toast.error('Email is required for OTP verification.');
      navigate('/signup');
    }
  }, [navigate, searchParams]);

  const submitHandler = async (data: IVerifyOtpInput) => {
    try {
      await authService.verify(searchParams.get('email') || '', data.otp);
      toast.success('OTP Verified successfully!', {
        onClose: () => {
          navigate('/login');
        },
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          'OTP Verification failed: ' +
            (error.response?.data?.message || error.message)
        );
      }
    }
  };

  const resendOtpHandler = async () => {
    try {
      await authService.sendOtp(searchParams.get('email') || '');
      toast.success('OTP resent successfully!');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          'Resend OTP failed: ' + (error.response?.data?.error || error.message)
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="verify-form xs:min-w-75 flex h-full flex-col items-center gap-3"
    >
      <Input
        autoComplete="off"
        id="otp-input"
        type="text"
        placeholder="Enter OTP"
        {...register('otp', { required: true, minLength: 6, maxLength: 6 })}
      />
      <button
        type="submit"
        className="verify-button bg-primary-500 hover:bg-primary-600 mt-5 w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-all duration-300"
      >
        Verify
      </button>
      {errors.otp && (
        <p className="text-sm text-red-500">Please enter a valid OTP.</p>
      )}
      <p className="mt-4 text-gray-600">
        Didn't receive the OTP?
        <a
          onClick={resendOtpHandler}
          className="text-primary-400 hover:text-primary-500 cursor-pointer self-end text-sm font-semibold transition-colors duration-300"
        >
          Resend OTP
        </a>
      </p>
    </form>
  );
}
