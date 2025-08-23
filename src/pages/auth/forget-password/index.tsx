import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { requestOtp } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from '@/routes/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function ForgotPassword() {
  const { loading, error } = useSelector((state: any) => state.auth);
  const router = useRouter();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const defaultValues = {
    email: ''
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    const result: any = await dispatch(requestOtp(data));
    if (result?.payload?.success) {
      localStorage.setItem('tp_otp_email', data.email);
      router.push('/otp');
    }
  };

  return (
    <div
      className="relative flex h-screen w-full items-center justify-between bg-cover bg-center"
      style={{
        backgroundImage: "url('/login.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 z-0 bg-black/50" />

      {/* Left Side Content */}
      <div className="relative z-10 ml-16 flex w-full  flex-col items-start justify-center p-6 lg:p-12">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-4xl font-bold text-white">
            University Management
          </span>
        </div>

        <div className="text-left text-white">
          <p className="mb-1 text-lg font-medium">
            RESET YOUR PASSWORD
          </p>
          <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
            Secure & Easy Access
          </h1>
          <p className="mb-6 max-w-xs text-sm text-gray-100">
            Enter your email to receive a reset otp.
           
          </p>
        </div>

        {/* Navigation Tabs */}
        {/* <div className="flex overflow-hidden rounded-lg border border-gray-300 shadow-sm">
          <Link
            to="/login"
            className="flex-1 bg-transparent px-6 py-3 text-center font-medium text-white transition-colors duration-200 hover:bg-white/20"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="flex-1 bg-white px-6 py-3 text-center font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50"
          >
            Register
          </Link>
        </div> */}
      </div>

      {/* Right Side - Forgot Password Form */}
      <div className="relative z-10 flex h-full w-full items-center justify-end p-6 lg:p-12">
        <Card className="w-full max-w-md rounded-xl border-none bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Forgot Password?
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              No worries! Enter your email to reset your password.
            </p>
          </div>

          {/* Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email..."
                        disabled={loading}
                        {...field}
                        className="w-full border-gray-300 focus:border-theme focus:ring-theme"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={loading}
                className="w-full bg-theme text-white hover:bg-theme/90"
                type="submit"
              >
                {loading ? 'Sending...' : 'Reset Password'}
              </Button>
            </form>
          </Form>

          {error && (
            <p className="mt-4 text-center text-sm text-red-500">{error}</p>
          )}

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-sm text-gray-600 hover:text-theme hover:underline"
            >
              ← Back to login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}