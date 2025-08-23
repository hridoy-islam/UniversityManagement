import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
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
import { changePassword } from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from '@/routes/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { z } from 'zod';

const formSchema = z.object({
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' })
});

type UserFormValue = z.infer<typeof formSchema>;

export default function NewPassword() {
  const { loading } = useSelector((state: any) => state.auth);
  const [error, setError] = useState('');
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const defaultValues = {
    password: '',
    confirmPassword: ''
  };

  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    if (data.password !== data.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const userData = JSON.parse(localStorage.getItem('tp_user_data') || '{}');
    const result: any = await dispatch(
      changePassword({
        password: data.password,
        userId: userData._id
      })
    );
    if (result?.payload?.success) {
      setError('');
      localStorage.removeItem('tp_user_data');
      localStorage.removeItem('tp_otp_email');
      setDialogOpen(true);
      setFieldsDisabled(true);
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
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-black/50" />

      {/* Left Side - Branded Content */}
      <div className="relative z-10 ml-16 flex w-full max-w-lg flex-col items-start justify-center p-6 lg:p-12">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-4xl font-bold text-white">
            University Management
          </span>
        </div>

        <div className="text-left text-white">
          <p className="mb-1 text-lg font-medium">SECURITY</p>
          <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">
            Set New Password
          </h1>
          <p className="mb-6 max-w-xs text-sm text-gray-100">
            Choose a strong password to keep your account secure.
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

      {/* Right Side - Reset Password Form */}
      <div className="relative z-10 flex h-full w-full items-center justify-end p-6 lg:p-12">
        <Card className="w-full max-w-md rounded-xl border-none bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          {dialogOpen ? (
            // Success Dialog
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Password Changed!
              </h2>
              <p className="text-sm text-gray-600">
                Your password has been updated successfully. You can now log in with your new password.
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full bg-theme text-white hover:bg-theme/90"
              >
                Login Now
              </Button>
            </div>
          ) : (
            // Password Reset Form
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Create New Password</h2>
                <p className="mt-2 text-sm text-gray-600">Enter and confirm your new password</p>
              </div>

              {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            disabled={loading || fieldsDisabled}
                            {...field}
                            className="w-full border-gray-300 focus:border-theme focus:ring-theme"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="Confirm your password"
                            disabled={loading || fieldsDisabled}
                            {...field}
                            className="w-full border-gray-300 focus:border-theme focus:ring-theme"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    disabled={loading || fieldsDisabled}
                    className="mt-2 w-full bg-theme text-white hover:bg-theme/90 disabled:opacity-70"
                    type="submit"
                  >
                    {loading ? 'Updating...' : 'Change Password'}
                  </Button>
                </form>
              </Form>

              {/* Back to OTP */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => router.push('/')}
                  className="text-sm text-gray-600 hover:text-theme hover:underline"
                >
                  ← Back to login
                </button>
              </div>
            </>
          )}
        </Card>
      </div>

      {/* Hidden Dialog (used only if needed for modal behavior) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="hidden">
          <DialogTitle>Password Changed</DialogTitle>
          <DialogDescription>
            Your password has been successfully updated.
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
}