import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import Select from 'react-select';

// Mock data for dropdowns
const universities = [
  { value: 'uni-oxford', label: 'University of Oxford' },
  { value: 'uni-cambridge', label: 'University of Cambridge' },
  { value: 'uni-harvard', label: 'Harvard University' }
];

const campuses = [
  { value: 'watney', label: 'Watney College, Nelson Street' },
  { value: 'downtown', label: 'Downtown Campus' },
  { value: 'north', label: 'North Campus' }
];

const roles = [
  { value: 'teacher', label: 'Teacher' },
  { value: 'verifier', label: 'Verifier' },
  { value: 'signatory', label: 'Signatory' },
  { value: 'college-admin', label: 'College Admin' },
  { value: 'campus-admin', label: 'Campus Admin' }
];

const titles = [
  { value: 'mr', label: 'Mr' },
  { value: 'ms', label: 'Ms' },
  { value: 'mrs', label: 'Mrs' },
  { value: 'dr', label: 'Dr' },
  { value: 'prof', label: 'Prof' }
];

export default function AddStaffPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    university: '',
    campus: '',
    role: '',
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      password: '123456' // default password
    };

    console.log('Staff Data:', payload);

    // send to API here ...
    navigate(-1);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div onClick={() => navigate(-1)}>
              <Button
                variant="outline"
                size="sm"
                className="bg-theme text-xs text-white hover:bg-theme/90"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Add New Staff
              </CardTitle>
              <CardDescription className="mt-1 text-xs">
                Fill in staff details and assign them to a campus
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            {/* --- Grid Section --- */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* University */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">University</Label>
                <Select
                  options={universities}
                  value={
                    universities.find((u) => u.value === formData.university) ||
                    null
                  }
                  onChange={(option) =>
                    setFormData((prev) => ({
                      ...prev,
                      university: option?.value || ''
                    }))
                  }
                  placeholder="Select University"
                  className="text-xs"
                />
              </div>

              {/* Campus */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">College / Campus</Label>
                <Select
                  options={campuses}
                  value={
                    campuses.find((c) => c.value === formData.campus) || null
                  }
                  onChange={(option) =>
                    setFormData((prev) => ({
                      ...prev,
                      campus: option?.value || ''
                    }))
                  }
                  placeholder="Select Campus"
                  className="text-xs"
                />
              </div>

              {/* Role */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Role</Label>
                <Select
                  options={roles}
                  value={roles.find((r) => r.value === formData.role) || null}
                  onChange={(option) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: option?.value || ''
                    }))
                  }
                  placeholder="Select Role"
                  className="text-xs"
                />
              </div>

              {/* Title */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Title</Label>
                <Select
                  options={titles}
                  value={titles.find((t) => t.value === formData.title) || null}
                  onChange={(option) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: option?.value || ''
                    }))
                  }
                  placeholder="Select Title"
                  className="text-xs"
                />
              </div>

              {/* First Name */}
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-xs font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      firstName: e.target.value
                    }))
                  }
                  className="h-8 text-xs"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-xs font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lastName: e.target.value
                    }))
                  }
                  className="h-8 text-xs"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs font-medium">
                  Phone
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* --- Submit Button --- */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="h-8 bg-theme px-6 text-xs text-white hover:bg-theme/90"
              >
                Create Staff
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
