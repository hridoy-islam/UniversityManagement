import ProtectedRoute from '@/components/shared/ProtectedRoute';
import ForgotPassword from '@/pages/auth/forget-password';
import SignUpPage from '@/pages/auth/sign-up';
import NotFound from '@/pages/not-found';
import ProfilePage from '@/pages/profile';
import { Suspense, lazy } from 'react';
import { Navigate, Outlet, useRoutes } from 'react-router-dom';
import Otp from '@/pages/auth/otp';
import NewPassword from '@/pages/auth/new-password';
import AdminLayout from '@/components/layout/admin-layout';
import IntakePage from '@/pages/intake';
import EditIntakePage from '@/pages/intake/edit-intake';
import AddIntakePage from '@/pages/intake/add-intake';
import CoursePage from '@/pages/course';
import AddCoursePage from '@/pages/course/add-course';
import EditCoursePage from '@/pages/course/edit-course';
import UniversityPage from '@/pages/university';
import AddUniversityPage from '@/pages/university/add-university';
import EditUniversityPage from '@/pages/university/edit-university';
import StaffPage from '@/pages/staff';
import AddStaffPage from '@/pages/staff/add-staff';
import EditStaffPage from '@/pages/staff/edit-staff';
import AgentPage from '@/pages/agent';
import AddAgentPage from '@/pages/agent/add-agent';
import EditAgentPage from '@/pages/agent/edit-agent';
import CampusPage from '@/pages/campus';
import AddCampusPage from '@/pages/campus/add-campus';
import EditCampusPage from '@/pages/campus/edit-campus';
import StudentPage from '@/pages/student';
import ApplicantPage from '@/pages/applicant';
import ApplicantDetailsPage from '@/pages/applicant/applicant-details';
import StudentViewPage from '@/pages/student/view-details';
import CourseModulePage from '@/pages/course/module';
import AddModulePage from '@/pages/course/module/add-module';
import EditModulePage from '@/pages/course/module/edit-module';
import EmailConfigPage from '@/pages/emails';
import { DraftsManager } from '@/pages/drafts';


const SignInPage = lazy(() => import('@/pages/auth/signin'));
const DashboardPage = lazy(() => import('@/pages/dashboard'));

// ----------------------------------------------------------------------

export default function AppRouter() {
  const adminRoutes = [
    {
      path: '/dashboard',
      element: (
        <AdminLayout>
          <ProtectedRoute>
            <Suspense>
              <Outlet />
            </Suspense>
          </ProtectedRoute>
        </AdminLayout>
      ),
      children: [
        {
          element: <DashboardPage />,
          index: true
        },
        {
          path: 'profile',
          element: <ProfilePage />
        },
        {
          path: 'intake',
          element: <IntakePage />
        },
        {
          path: 'intake/edit-intake/:id',
          element: <EditIntakePage />
        },
        {
          path: 'intake/add',
          element: <AddIntakePage />
        },
        {
          path: 'course',
          element: <CoursePage />
        },
        {
          path: 'course/:id/modules',
          element: <CourseModulePage />
        },
        {
          path: 'course/:id/modules/new',
          element: <AddModulePage />
        },
        {
          path: 'course/:id/modules/:moduleId',
          element: <EditModulePage />
        },
        {
          path: 'course/add-course',
          element: <AddCoursePage />
        },
        {
          path: 'course/edit-course/:id',
          element: <EditCoursePage />
        },
        {
          path: 'university',
          element: <UniversityPage />
        },
        {
          path: 'university/add',
          element: <AddUniversityPage />
        },
        {
          path: 'university/edit/:id',
          element: <EditUniversityPage />
        },
        {
          path: 'staff',
          element: <StaffPage />
        },
        {
          path: 'staff/add',
          element: <AddStaffPage />
        },
        {
          path: 'staff/edit-staff/:id',
          element: <EditStaffPage />
        },
        {
          path: 'agent',
          element: <AgentPage />
        },
        {
          path: 'agent/add',
          element: <AddAgentPage />
        },
        {
          path: 'agent/edit-agent/:id',
          element: <EditAgentPage />
        },
        {
          path: 'campus',
          element: <CampusPage />
        },
        {
          path: 'campus/add',
          element: <AddCampusPage />
        },
        {
          path: 'campus/edit-campus/:id',
          element: <EditCampusPage />
        },
        {
          path: 'student',
          element: <StudentPage />
        },
        {
          path: 'student/info-manager',
          element: <StudentViewPage />
        },
        
        {
          path: 'applicantions',
          element: <ApplicantPage />
        },
        {
          path: 'applicantions/applicant-details',
          element: <ApplicantDetailsPage />
        },
        {
          path: 'emails',
          element: <EmailConfigPage />
        },
        {
          path: 'drafts',
          element: <DraftsManager />
        },
      ]
    }
  ];

  const publicRoutes = [
    {
      path: '/',
      element: <SignInPage />,
      index: true
    },
    {
      path: '/signup',
      element: <SignUpPage />,
      index: true
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />,
      index: true
    },
    {
      path: '/otp',
      element: <Otp />,
      index: true
    },
    {
      path: '/new-password',
      element: <NewPassword />,
      index: true
    },
    {
      path: '/404',
      element: <NotFound />
    },

    {
      path: '*',
      element: <Navigate to="/404" replace />
    }
  ];

  const routes = useRoutes([...publicRoutes, ...adminRoutes]);

  return routes;
}
