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

// Mock data
const titles = [
  { value: 'mr', label: 'Mr' },
  { value: 'ms', label: 'Ms' },
  { value: 'mrs', label: 'Mrs' },
  { value: 'dr', label: 'Dr' },
  { value: 'prof', label: 'Prof' }
];

const staffUsers = [
  { value: 'john-doe', label: 'John Doe' },
  { value: 'jane-smith', label: 'Jane Smith' },
  { value: 'mark-johnson', label: 'Mark Johnson' }
];

const campuses = [
  { value: 'watney', label: 'Watney College, Nelson Street' },
  { value: 'downtown', label: 'Downtown Campus' },
  { value: 'north', label: 'North Campus' }
];

export default function AddAgentPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    address1: '',
    address2: '',
    pointOfContact: '',
    campuses: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      password: '123456'
    };

   
    // send to API
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
              <CardTitle className="text-2xl font-bold">Add New Agent</CardTitle>
              <CardDescription className="mt-1 text-xs">
                Fill in agent details, address, and assign campuses
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6 text-xs">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Title */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Title</Label>
                <Select
                  options={titles}
                  value={titles.find((t) => t.value === formData.title) || null}
                  onChange={(option) =>
                    setFormData((prev) => ({ ...prev, title: option?.value || '' }))
                  }
                  placeholder="Select Title"
                  className="text-xs"
                />
              </div>

              {/* First Name */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">First Name</Label>
                <Input
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Last Name</Label>
                <Input
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Email</Label>
                <Input
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
                <Label className="text-xs font-medium">Phone</Label>
                <Input
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>

              {/* Company */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Company</Label>
                <Input
                  placeholder="Enter company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, company: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>

              {/* Address Line 1 */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Address Line 1</Label>
                <Input
                  placeholder="Enter address line 1"
                  value={formData.address1}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address1: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>

              {/* Address Line 2 */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Address Line 2</Label>
                <Input
                  placeholder="Enter address line 2"
                  value={formData.address2}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address2: e.target.value }))
                  }
                  className="h-8 text-xs"
                />
              </div>

              {/* Point of Contact */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Point of Contact</Label>
                <Select
                  options={staffUsers}
                  value={staffUsers.find((s) => s.value === formData.pointOfContact) || null}
                  onChange={(option) =>
                    setFormData((prev) => ({ ...prev, pointOfContact: option?.value || '' }))
                  }
                  placeholder="Select Point of Contact"
                  className="text-xs"
                />
              </div>

              {/* Campuses (multi-select) */}
              <div className="space-y-1">
                <Label className="text-xs font-medium">Campuses</Label>
                <Select
                  options={campuses}
                  value={campuses.filter((c) => formData.campuses.includes(c.value))}
                  onChange={(options) =>
                    setFormData((prev) => ({
                      ...prev,
                      campuses: (options as any).map((o: any) => o.value)
                    }))
                  }
                  isMulti
                  placeholder="Select Campuses"
                  className="text-xs"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                className="h-8 bg-theme px-6 text-xs text-white hover:bg-theme/90"
              >
                Create Agent
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
