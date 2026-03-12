import { useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Input } from '../common/Input';
import { usePasswordToggle } from '../../utils/passwordToggle';
import { Eye, EyeOff } from 'lucide-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../schemas/authSchema';
import { formErrorHandler } from '../../utils/formErrorHandler';

interface ILoginInput {
  email: string;
  password: string;
}

export function LoginForm() {
  const { register, handleSubmit } = useForm<ILoginInput>({
    resolver: yupResolver(loginSchema),
  });

  const { inputType, icon, togglePassword } = usePasswordToggle();
  const location = useLocation();
  const navigate = useNavigate();

  const from = location.state?.from || '/for-you';

  const submitHandler = async (data: ILoginInput) => {
    try {
      const response = await authService.login(data.email, data.password);

      toast.success('Login successful');
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
      navigate(from, { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          'Login failed: ' + (error.response?.data?.message || error.message)
        );
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler, formErrorHandler)}
      className="login-form xs:min-w-75 flex flex-col items-center gap-4"
    >
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
      <Link
        to={'/forgot-password'}
        className="text-primary-300 hover:text-primary-400 font-semibold text-nowrap transition-colors duration-300"
      >
        Forgot password?
      </Link>

      <button
        className="login-button bg-primary-500 hover:bg-primary-600 mt-8 w-full cursor-pointer rounded-lg py-3 font-semibold text-white transition-all duration-300"
        type="submit"
      >
        Login
      </button>
    </form>
  );
}
