import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

interface CourseDetailsProps {
  student: any;
}

export function CourseDetails({ student }: CourseDetailsProps) {
  const courseData = {
    courseAndSemester: "HND IN HOSPITALITY MANAGEMENT - 2025 January",
    venue: "Campus C, Barking Campus",
    courseStart: "20 Jan 2025",
    courseEnd: "21 Nov 2026",
    studentType: "UK",
    qualificationAchievement: "Higher National Diploma (HND)",
    awardingBody: "PEARSON",
    duration: "2 Years",
    slcCourseCode: "134139",
    eveningWeekend: "No",
    feeEligibility: "Eligibility to pay home fees not assessed",
  };

  const awardingBodyData = {
    registrationDocumentVerified: true,
    awardingBodyRef: "TH22827",
    awardingBodyRegExpireDate: "15 Feb 2030",
    awardingBodyCourseCode: "BSRP7",
    awardingBodyRegDate: "14 Feb 2025",
    registeredBy: "Anuradha Dehal",
    registeredAt: "14th February, 2025",
  };

  return (
    <div className="space-y-8 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
        <h2 className="text-lg font-semibold text-gray-800">Course Details</h2>
        <Button
          size="sm"
          className="bg-theme hover:bg-theme/90 text-white flex items-center gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit Course Information
        </Button>
      </div>

      {/* Course Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Left Column */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Course & Semester
            </label>
            <p className="mt-1 text-xs text-gray-800 font-medium">
              {courseData.courseAndSemester}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Venue
            </label>
            <p className="mt-1 text-xs text-gray-800 font-medium">
              {courseData.venue}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Course Start
            </label>
            <p className="mt-1 text-xs text-gray-800 font-medium">
              {courseData.courseStart}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Course End
            </label>
            <p className="mt-1 text-xs text-gray-800 font-medium">
              {courseData.courseEnd}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Student Type
            </label>
            <p className="mt-1 text-xs text-gray-800 font-medium">
              {courseData.studentType}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Qualification Achievement
            </label>
            <p className="mt-1 text-xs text-gray-800 font-medium">
              {courseData.qualificationAchievement}
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Awarding Body
            </label>
            <p className="mt-1 text-xs text-gray-800 font-medium">
              {courseData.awardingBody}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Duration
            </label>
            <p className="mt-1 text-xs text-gray-800 font-medium">
              {courseData.duration}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              SLC Course Code
            </label>
            <p className="mt-1 text-xs text-gray-800 font-medium">
              {courseData.slcCourseCode}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Evening & Weekend
            </label>
            <span
              className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full mt-1 ${
                courseData.eveningWeekend === "Yes"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {courseData.eveningWeekend}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Fee Eligibility
            </label>
            <p className="mt-1 text-xs text-gray-600">
              {courseData.feeEligibility}
            </p>
          </div>
        </div>
      </div>

      {/* Awarding Body Section */}
      <div className="border-t pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-base font-semibold text-gray-800">
            Awarding Body Registration
          </h3>
          <Button
            size="sm"
            className="bg-theme hover:bg-theme/90 text-white flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Registration
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                Registration Document Verified
              </label>
              <div className="flex items-center gap-6">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="verified-yes"
                    checked={awardingBodyData.registrationDocumentVerified}
                    readOnly
                    className="h-3.5 w-3.5 text-theme focus:ring-teal-500"
                  />
                  <label
                    htmlFor="verified-yes"
                    className="ml-2 text-xs text-gray-700"
                  >
                    Yes
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="verified-no"
                    checked={!awardingBodyData.registrationDocumentVerified}
                    readOnly
                    className="h-3.5 w-3.5 text-theme focus:ring-theme"
                  />
                  <label
                    htmlFor="verified-no"
                    className="ml-2 text-xs text-gray-700"
                  >
                    No
                  </label>
                </div>
                <Button
                  size="sm"
                  variant="default"
                  className="ml-4  border-theme hover:bg-teal-50 text-xs px-2 py-1 h-7"
                >
                  Reset
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Awarding Body Ref
              </label>
              <p className="mt-1 text-xs text-gray-800 font-medium">
                {awardingBodyData.awardingBodyRef}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Reg. Expiry Date
              </label>
              <p className="mt-1 text-xs text-gray-800 font-medium">
                {awardingBodyData.awardingBodyRegExpireDate}
              </p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Course Code
              </label>
              <p className="mt-1 text-xs text-gray-800 font-medium">
                {awardingBodyData.awardingBodyCourseCode}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Registered By
              </label>
              <p className="mt-1 text-xs text-gray-800 font-medium">
                {awardingBodyData.registeredBy}
              </p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Registration Date
              </label>
              <p className="mt-1 text-xs text-gray-800 font-medium">
                {awardingBodyData.awardingBodyRegDate}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Registered At
              </label>
              <p className="mt-1 text-xs text-gray-800 font-medium">
                {awardingBodyData.registeredAt}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
