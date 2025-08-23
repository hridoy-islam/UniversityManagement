import { Card } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';
import { SignUpForm } from './components/sign-up-form';
import watney from '@/assets/imges/home/watney.jpg';
import logo from '@/assets/imges/home/logo.png';
import { useEffect, useState } from 'react';
import axiosInstance from '@/lib/axios';

export default function SignUpPage() {
  const navigate = useNavigate();

  const [course, setCourse] = useState<any>(null);
  const [term, setTerm] = useState<any>(null);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [termId, setTermId] = useState<string | null>(null);

  useEffect(() => {
    const cId = localStorage.getItem('courseId');
    const tId = localStorage.getItem('termId');

    setCourseId(cId);
    setTermId(tId);

    const fetchData = async () => {
      try {
        if (cId) {
          const res = await axiosInstance.get(`/courses/${cId}`);
          setCourse(res.data.data);
        }

        if (tId) {
          const res = await axiosInstance.get(`/terms/${tId}`);
          setTerm(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching course or term:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="relative flex h-screen w-full items-center justify-between bg-cover bg-center "
      style={{
        backgroundImage: "url('/login.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 z-0 bg-black/40 " />

      {/* Left Side Content */}
      <div className="relative z-10 ml-16 flex w-full flex-col items-start justify-center p-6 lg:p-12">
        <div className="mb-4 flex items-center gap-2">
          {/* <img src={logo} alt="Logo" className="h-10 w-auto" /> */}
          <span className="text-4xl font-bold text-white">
            University Management
          </span>
        </div>

        <div className="text-left text-white">
          <p className="mb-1 text-lg font-medium">
            WELCOME TO OUR UNIVERSITY PLATFORM
          </p>
          <h1 className="mb-4 text-4xl font-extrabold md:text-5xl">
            Manage Your Campus Efficiently
          </h1>
          <p className="mb-6 max-w-xs text-sm">
            Streamline student, faculty, and course management in one place.
            <br />
            Keep track of attendance, grades, schedules, and university
            activities with ease and efficiency!
          </p>
        </div>

        <div className="flex overflow-hidden rounded-lg border border-gray-300 shadow-sm">
          <Link
            to="/"
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
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="relative z-10 flex h-full w-full items-center justify-end p-12 lg:p-12">
        <Card className="w-full max-w-lg rounded-xl border-none bg-white/95 p-8 shadow-xl backdrop-blur-sm">
          <div className="mb-2 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">
              Create Your Account
            </h2>
          </div>
          <SignUpForm />
          {/* Social Login */}
          <div className="mt-4 text-center">
            <div className="mb-2 flex items-center justify-center">
              <hr className="w-1/3 border-gray-300" />
              <span className="px-4 text-sm text-gray-500">or</span>
              <hr className="w-1/3 border-gray-300" />
            </div>
            <p className="mb-2 text-sm text-gray-600">
              Login with your Social Account
            </p>
            <div className="flex justify-center gap-4">
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 transition-colors hover:bg-blue-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.991 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.064 24 12.073z" />
                </svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-400 transition-colors hover:bg-blue-500">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.564-2.005.954-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.66 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.219c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A10.01 10.01 0 0024 4.59z" />
                </svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 transition-colors hover:bg-purple-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.608 0-1.1-.492-1.1-1.109 0-.616.492-1.109 1.1-1.109s1.1.493 1.1 1.109c0 .617-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-.955-.166-1.794-1.048-1.794-1.048 0-1.238.854-1.238 1.794v2.861h-1.998v-6h1.998v1.093h.046c.478-.903 1.608-1.883 3.332-1.883 3.701 0 4.267 2.428 4.267 5.455v3.545z" />
                </svg>
              </button>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 transition-colors hover:bg-red-700">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.564-2.005.954-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.66 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.937 4.937 0 004.604 3.417 9.868 9.868 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.219c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A10.01 10.01 0 0024 4.59z" />
                </svg>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
