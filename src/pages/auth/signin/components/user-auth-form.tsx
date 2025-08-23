import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  authWithFbORGoogle,
  loginUser,
  resetError
} from '@/redux/features/authSlice';
import { AppDispatch } from '@/redux/store';
import { useRouter } from '@/routes/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import * as z from 'zod';
import {
  useSignInWithFacebook,
  useSignInWithGoogle
} from 'react-firebase-hooks/auth';
import { firebaseAuth } from '@/firebaseConfig';
import { motion } from 'framer-motion';

const formSchema = z.object({
  email: z.string().email({ message: 'Enter a valid email address' }),
  password: z.string()
});

type googleUserSchema = {
  name: string;
  email: string;
  googleUid: string;
  image: string | undefined;
  phone: string | undefined;
};

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
  const [signInWithGoogle, googleUser, gLoading, gError] =
    useSignInWithGoogle(firebaseAuth);
  const [signInWithFacebook, facebookUser, fLoading, fError] =
    useSignInWithFacebook(firebaseAuth);
  const router = useRouter();
  const { loading, error } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const defaultValues = {
    email: '',
    password: ''
  };
  const form = useForm<UserFormValue>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const onSubmit = async (data: UserFormValue) => {
    const result: any = await dispatch(loginUser(data));
    if (result?.payload?.success) {
      router.push('/dashboard');
    }
  };

  const handleGoogleLogin = async () => {
    await signInWithGoogle();
  };

  const handleFacebookLogin = async () => {
    await signInWithFacebook();
  };

  const loginWithFbOrGoogle = async (data: googleUserSchema) => {
    const result: any = await dispatch(authWithFbORGoogle(data));
    if (result?.payload?.success) {
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    if (googleUser) {
      const { email, displayName, uid, photoURL, phoneNumber } =
        googleUser?.user;
      const data = {
        name: displayName,
        email,
        password: '123456',
        googleUid: uid,
        image: photoURL ? photoURL : undefined,
        phone: phoneNumber ? phoneNumber : undefined
      };
      loginWithFbOrGoogle(data);
    }
  }, [googleUser]);

  useEffect(() => {
    if (facebookUser) {
      const { email, displayName, uid, photoURL, phoneNumber } =
        facebookUser?.user;
      const data = {
        name: displayName,
        email,
        password: '123456',
        googleUid: uid,
        image: photoURL ? photoURL : undefined,
        phone: phoneNumber ? phoneNumber : undefined
      };
      loginWithFbOrGoogle(data);
    }
  }, [facebookUser]);
  useEffect(() => {
    // Reset the error when the component mounts
    dispatch(resetError());
  }, [dispatch]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter your email..."
                    disabled={loading}
                    {...field}
                    className="h-12 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password..."
                    disabled={loading}
                    {...field}
                    className="h-12 w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <motion.button
            type="submit"
            disabled={loading}
            className="relative flex h-12 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md bg-theme text-lg font-semibold text-white"
            initial="rest"
            whileHover="hover"
            animate="rest"
          >
            {/* Left Side - "GO!" */}
            <motion.div
              className="absolute bottom-0 left-0 top-0 flex w-16 items-center justify-center bg-gray-800 text-sm font-bold text-white"
              variants={{
                rest: { x: -100, opacity: 0 }, // hidden initially
                hover: { x: 0, opacity: 1 } // slide in on hover
              }}
              transition={{ duration: 0.3 }}
            >
              GO!
            </motion.div>

            {/* Right Side - "Login to your Account!" */}
            <div className="flex-1 text-center text-white">Login</div>
          </motion.button>
        </form>
      </Form>
      {error && <Badge className="mt-2 bg-white text-red-500">{error}</Badge>}
      {/* <p className="text-sm">
        Don't have account? <span className='hover:underline'> <Link to="/signup">Signup</Link></span>{' '}
      </p> */}
      <p className="mt-4 text-right text-sm hover:underline">
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </>
  );
}
