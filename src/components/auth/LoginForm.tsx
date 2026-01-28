import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { Input } from '../common/Input';

interface ILoginInput {
  email: string;
  password: string;
}

export function LoginForm() {
  const { register, handleSubmit } = useForm<ILoginInput>();

  const navigate = useNavigate();

  const submitHandler = async (data: ILoginInput) => {
    try {
      const response = await authService.login(data.email, data.password);

      toast.success('Login successful');
      localStorage.setItem('access_token', response.accessToken);
      localStorage.setItem('refresh_token', response.refreshToken);
      navigate('/dashboard');
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
      onSubmit={handleSubmit(submitHandler)}
      className="login-form xs:min-w-75 flex flex-col items-center gap-4"
    >
      <Input
        {...register('email', { required: true })}
        type="email"
        placeholder="Email"
        required
      />
      <Input
        {...register('password', { required: true, minLength: 6 })}
        type="password"
        placeholder="Password"
      />
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
