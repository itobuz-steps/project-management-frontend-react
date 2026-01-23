import { AxiosError } from 'axios';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { toast } from 'react-toastify';
import { Input } from '../common/Input';

interface ISignupInput {
  username: string;
  email: string;
  password: string;
}

export function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignupInput>();

  const navigate = useNavigate();

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
      onSubmit={handleSubmit(submitHandler)}
      className="xs:min-w-75 flex flex-col items-center justify-between gap-3"
    >
      <Input
        {...register('username', { required: true })}
        type="text"
        placeholder="Username"
        required
      />
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
        required
      />
      <div className="mr-auto flex-col text-start text-red-400">
        {errors.username?.type === 'required' && <p>Username is required</p>}
        {errors.email?.type === 'required' && <p>Email is required</p>}
        {errors.password?.type === 'required' && <p>Password is required</p>}
        {errors.password?.type === 'minLength' && (
          <p>Password must be at least 6 characters</p>
        )}
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
