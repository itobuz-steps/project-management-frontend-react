import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import { Input } from '../common/Input';
import { usePasswordToggle } from '../../utils/passwordToggle';
import { Eye, EyeOff } from 'lucide-react';
import { signupSchema } from '../../schemas/authSchema';
import { formErrorHandler } from '../../utils/formErrorHandler';
import { yupResolver } from '@hookform/resolvers/yup';

interface ISignupInput {
  username: string;
  email: string;
  password: string;
}

export function SignupForm() {
  const { register, handleSubmit } = useForm<ISignupInput>({
    resolver: yupResolver(signupSchema),
  });

  const navigate = useNavigate();
  const { inputType, icon, togglePassword } = usePasswordToggle();

  const submitHandler = async (data: ISignupInput) => {
    try {
      await authService.signup(data.username, data.email, data.password);
      toast.success('Signup successful! Please verify your email.');
      navigate('/verify-otp?email=' + encodeURIComponent(data.email));
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          'Signup failed: ' + (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler, formErrorHandler)}
      className="xs:min-w-75 flex flex-col items-center justify-between gap-3"
    >
      <Input
        {...register('username')}
        type="text"
        placeholder="Enter Username"
      />
      <Input {...register('email')} type="email" placeholder="Enter Email" />
      <div className="relative w-full">
        <Input
          {...register('password')}
          type={inputType}
          placeholder="Enter Password"
          className="pr-10"
        />

        <button
          type="button"
          onClick={togglePassword}
          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500"
        >
          {icon === 'eye' ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      </div>
      <button
        className="bg-primary-500 hover:bg-primary-600 mt-5 w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-all duration-300 disabled:bg-gray-300 disabled:text-gray-400"
        type="submit"
      >
        Sign Up
      </button>
    </form>
  );
}
