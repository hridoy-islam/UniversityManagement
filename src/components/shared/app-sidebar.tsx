import * as React from "react";
import {
  IconDashboard,
  IconUsers,
  IconBook,
  IconCalendarTime,
  IconClipboardList,
  IconFileCertificate,
  IconFileText,
  IconId,
  IconLayoutGrid,
  IconReport,
  IconSettings,
  IconSchool,
  IconBuildingBank,
  IconUser,
  IconBellRinging,
  IconBook2,
  IconCoin,
  IconDeviceDesktop,
  IconFileStack,
  IconFolder,
  IconHome,
  IconIdBadge2,
  IconListCheck,
  IconMessage,
  IconReceipt2,
  IconTruck,
  IconUserPlus,
  IconUsersGroup,
  IconWriting,
  IconHelp,
  IconSearch,
} from "@tabler/icons-react";

import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Define the navigation structure
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },

  navMain: [
    // === Dashboard ===
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },

    // === Admission ===
    {
      title: "Admission",
      icon: IconUserPlus,
      items: [
        { title: "Applications", url: "/admission/applications" },
        { title: "New Registrations", url: "/admission/registrations" },
        { title: "Student List", url: "/admission/students" },
        {
          title: "Transfers",
          items: [
            { title: "Transfer Out", url: "/admission/transfers/out" },
            { title: "Transfer In", url: "/admission/transfers/in" },
          ],
        },
        { title: "Status Types", url: "/admission/status-types" },
        { title: "ID Cards", url: "/admission/id-cards" },
        {
          title: "Settings",
          items: [
            { title: "ID Card Settings", url: "/admission/settings/id-card" },
          ],
        },
      ],
    },

    // === Students ===
    {
      title: "Students",
      icon: IconUsers,
      items: [
        {
          title: "Attendances",
          items: [
            {
              title: "Subject Attendances",
              url: "/students/attendance/subject",
            },
            {
              title: "Attendance Report",
              url: "/students/attendance/report",
            },
          ],
        },
        { title: "Manage Leave", url: "/students/leave" },
        { title: "Student Notes", url: "/students/notes" },
        {
          title: "Enrollments",
          items: [
            { title: "Single Enroll", url: "/students/enroll/single" },
            { title: "Group Enroll", url: "/students/enroll/group" },
            { title: "Course Add Drop", url: "/students/enroll/add-drop" },
            { title: "Course Graduation", url: "/students/enroll/graduation" },
          ],
        },
        { title: "Alumni List", url: "/students/alumni" },
      ],
    },

    // === Academic ===
    {
      title: "Academic",
      icon: IconSchool,
      items: [
        { title: "Faculties", url: "/academic/faculties" },
        { title: "Programs", url: "/academic/programs" },
        { title: "Batches", url: "/academic/batches" },
        { title: "Sessions", url: "/academic/sessions" },
        { title: "Semesters", url: "/academic/semesters" },
        { title: "Sections", url: "/academic/sections" },
        { title: "Class Rooms", url: "/academic/classrooms" },
        { title: "Courses", url: "/academic/courses" },
        { title: "Enroll Course", url: "/academic/enroll-course" },
      ],
    },

    // === Routine ===
    {
      title: "Routine",
      icon: IconCalendarTime,
      items: [
        { title: "Manage Classes", url: "/routine/manage-classes" },
        { title: "Class Schedules", url: "/routine/class-schedules" },
        { title: "Manage Exams", url: "/routine/manage-exams" },
        { title: "Teacher Routines", url: "/routine/teacher" },
        {
          title: "Settings",
          items: [
            { title: "Class Schedule", url: "/routine/settings/class-schedule" },
            { title: "Exam Schedule", url: "/routine/settings/exam-schedule" },
          ],
        },
      ],
    },

    // === Examinations ===
    {
      title: "Examinations",
      icon: IconClipboardList,
      items: [
        { title: "Exam Attendance", url: "/exams/attendance" },
        { title: "Exam Mark Ledger", url: "/exams/mark-ledger" },
        { title: "Exam Result", url: "/exams/result" },
        { title: "Course Mark Ledger", url: "/exams/course-mark-ledger" },
        { title: "Course Result", url: "/exams/course-result" },
        { title: "Grading Systems", url: "/exams/grading" },
        { title: "Exam Types", url: "/exams/types" },
        { title: "Admit Cards", url: "/exams/admit-cards" },
        {
          title: "Settings",
          items: [
            { title: "Admit Settings", url: "/exams/settings/admit" },
            {
              title: "Mark Distribution",
              url: "/exams/settings/mark-distribution",
            },
          ],
        },
      ],
    },

    // === Study Material ===
    {
      title: "Study Material",
      icon: IconBook,
      items: [
        { title: "Assignment", url: "/study/assignment" },
        { title: "Content List", url: "/study/content-list" },
        { title: "Content Types", url: "/study/content-types" },
      ],
    },

    { title: "Fees Collection", url: "/fees", icon: IconCoin },
    { title: "Human Resources", url: "/hr", icon: IconUsersGroup },
    { title: "Staff Attendances", url: "/staff-attendance", icon: IconListCheck },
    { title: "Leave Manager", url: "/leave", icon: IconWriting },
    { title: "Accounts", url: "/accounts", icon: IconBuildingBank },
    { title: "Communicates", url: "/communicates", icon: IconMessage },
    { title: "Library", url: "/library", icon: IconBook2 },
    { title: "Inventory", url: "/inventory", icon: IconFolder },
    { title: "Hostel", url: "/hostel", icon: IconHome },
    { title: "Transports", url: "/transport", icon: IconTruck },
    { title: "Front Desk", url: "/front-desk", icon: IconDeviceDesktop },
    { title: "Transcripts", url: "/transcripts", icon: IconFileCertificate },
    { title: "Reports", url: "/reports", icon: IconReport },
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "My Profile", url: "/profile", icon: IconUser },
  ],

  navSecondary: [
    { title: "Help", url: "#", icon: IconHelp },
    { title: "Search", url: "#", icon: IconSearch },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className="w-60 min-w-64 max-w-[64] border-none "
    >
      <SidebarHeader className="border-b h-14 border-gray-300 flex items-center justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              // asChild
              className="data-[slot=sidebar-menu-button]:!p-2"
            >
              <a href="#" className="flex items-center gap-2">
                <IconLayoutGrid className="!size-5 shrink-0 text-theme" />
                <span className="font-semibold text-base ">
                  University Management
                </span>
              </a>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="mt-2">
        <NavMain items={data.navMain} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
