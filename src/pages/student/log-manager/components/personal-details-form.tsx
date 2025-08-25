import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactSelect from 'react-select';

// Mock data for dropdowns
const mockData = {
  titles: ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof'],
  maritalStatuses: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'],
  gender: ['Male', 'Female', 'Other', 'Prefer not to say'],
  ethnicities: [
    'White British',
    'White Irish',
    'White Other',
    'Mixed White and Black Caribbean',
    'Mixed White and Black African',
    'Mixed White and Asian',
    'Mixed Other',
    'Asian or Asian British Indian',
    'Asian or Asian British Pakistani',
    'Asian or Asian British Bangladeshi',
    'Asian or Asian British Other',
    'Black or Black British Caribbean',
    'Black or Black British African',
    'Black or Black British Other',
    'Chinese',
    'Other Ethnic Group',
    'Prefer not to say'
  ],
  sexualOrientation: [
    'Heterosexual',
    'Gay',
    'Lesbian',
    'Bisexual',
    'Other',
    'Prefer not to say'
  ],
  religion: [
    'No religion',
    'Christian',
    'Buddhist',
    'Hindu',
    'Jewish',
    'Muslim',
    'Sikh',
    'Other',
    'Prefer not to say'
  ],
  employmentTypes: [
    'Full-Time',
    'Part-Time',
    'Contract',
    'Freelance',
    'Unemployed'
  ],
  fundingTypes: [
    'Self-funded',
    'Sponsored',
    'Scholarship',
    'Government Grant',
    'Other'
  ]
};

const countries = [
  'Afghanistan',
  'Albania',
  'Algeria',
  'Argentina',
  'Australia',
  'Austria',
  'Bangladesh',
  'Belgium',
  'Brazil',
  'Canada',
  'China',
  'Denmark',
  'Egypt',
  'France',
  'Germany',
  'India',
  'Indonesia',
  'Italy',
  'Japan',
  'Malaysia',
  'Netherlands',
  'Pakistan',
  'Singapore',
  'Spain',
  'Sweden',
  'Switzerland',
  'Thailand',
  'Turkey',
  'United Kingdom',
  'United States'
];

const languages = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Portuguese',
  'Arabic',
  'Chinese (Mandarin)',
  'Japanese',
  'Korean',
  'Hindi',
  'Bengali',
  'Urdu',
  'Russian',
  'Dutch',
  'Swedish',
  'Other'
];

interface PersonalDetailsFormProps {
  student?: any;
  onSave: (data: any) => void;
}

export function PersonalDetailsForm({
  student,
  onSave
}: PersonalDetailsFormProps) {
  const {
    handleSubmit,
    register,
    control,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      firstName: '',
      lastName: '',
      initial: '',
      phone: '',
      dateOfBirth: null,
      email: '',
      gender: '',
      maritalStatus: '',
      nationality: '',
      countryOfBirth: '',
      countryOfDomicile: '',
      nativeLanguage: '',
      passportName: '',
      passportIssueLocation: '',
      passportNumber: '',
      passportIssueDate: null,
      passportExpiryDate: null,
      collegeRoll: '',
      // Address fields
      postalAddressLine1: '',
      postalAddressLine2: '',
      postalCity: '',
      postalCountry: '',
      postalPostCode: '',
      residentialAddressLine1: '',
      residentialAddressLine2: '',
      residentialCity: '',
      residentialCountry: '',
      residentialPostCode: '',
      sameAsResidential: false,
      // Emergency contact
      emergencyFullName: '',
      emergencyContactNumber: '',
      emergencyEmail: '',
      emergencyRelationship: '',
      emergencyAddress: '',
      // Additional fields
      disability: '',
      disabilityDetails: '',
      // Employment
      isEmployed: '',
      currentEmployer: '',
      currentJobTitle: '',
      employmentType: '',
      employmentStartDate: null,
      responsibilities: '',
      hasPreviousEmployment: '',
      // Education & Visa
      completedUKCourse: '',
      visaRequired: '',
      visaRefusal: '',
      visaRefusalDetail: '',
      enteredUKBefore: '',
      hearAboutUs: '',
      fundingType: '',
      applicationLocation: '',
      studentType: ''
    }
  });

  const [staffOptions, setStaffOptions] = useState<any>([]);
  const watchSameAsResidential = watch('sameAsResidential');

  useEffect(() => {
    if (student) {
      reset({
        title: student.title || '',
        firstName: student.firstName || '',
        lastName: student.lastName || '',
        initial: student.initial || '',
        phone: student.phone || '',
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth) : null,
        email: student.email || '',
        gender: student.gender || '',
        maritalStatus: student.maritalStatus || '',
        nationality: student.nationality || '',
        countryOfBirth: student.countryOfBirth || '',
        countryOfDomicile: student.countryOfDomicile || '',
        nativeLanguage: student.nativeLanguage || '',
        passportName: student.passportName || '',
        passportIssueLocation: student.passportIssueLocation || '',
        passportNumber: student.passportNumber || '',
        passportIssueDate: student.passportIssueDate
          ? new Date(student.passportIssueDate)
          : null,
        passportExpiryDate: student.passportExpiryDate
          ? new Date(student.passportExpiryDate)
          : null,
        collegeRoll: student.collegeRoll || '',
        postalAddressLine1: student.postalAddressLine1 || '',
        postalAddressLine2: student.postalAddressLine2 || '',
        postalCity: student.postalCity || '',
        postalCountry: student.postalCountry || '',
        postalPostCode: student.postalPostCode || '',
        residentialAddressLine1: student.residentialAddressLine1 || '',
        residentialAddressLine2: student.residentialAddressLine2 || '',
        residentialCity: student.residentialCity || '',
        residentialCountry: student.residentialCountry || '',
        residentialPostCode: student.residentialPostCode || '',
        sameAsResidential: student.sameAsResidential || false,
        emergencyFullName: student.emergencyFullName || '',
        emergencyContactNumber: student.emergencyContactNumber || '',
        emergencyEmail: student.emergencyEmail || '',
        emergencyRelationship: student.emergencyRelationship || '',
        emergencyAddress: student.emergencyAddress || '',
        disability: student.disability || '',
        disabilityDetails: student.disabilityDetails || '',
        ethnicity: student.ethnicity || '',
        genderIdentity: student.genderIdentity || '',
        sexualOrientation: student.sexualOrientation || '',
        religion: student.religion || '',
        isEmployed: student.isEmployed || '',
        currentEmployer: student.currentEmployment?.employer || '',
        currentJobTitle: student.currentEmployment?.jobTitle || '',
        employmentType: student.currentEmployment?.employmentType || '',
        employmentStartDate: student.currentEmployment?.startDate
          ? new Date(student.currentEmployment.startDate)
          : null,
        responsibilities: student.currentEmployment?.responsibilities || '',
        hasPreviousEmployment: student.hasPreviousEmployment || '',
        completedUKCourse: student.completedUKCourse || '',
        visaRequired: student.visaRequired || '',
        visaRefusal: student.visaRefusal || '',
        visaRefusalDetail: student.visaRefusalDetail || '',
        enteredUKBefore: student.enteredUKBefore || '',
        hearAboutUs: student.hearAboutUs || '',
        fundingType: student.fundingType || '',
        applicationLocation: student.applicationLocation || '',
        studentType: student.studentType || ''
      });
    }
  }, [student, reset]);

  const onSubmit = (data: any) => {
    onSave(data);
  };

  // Country options for react-select
  const countryOptions = countries.map((country) => ({
    value: country,
    label: country
  }));

  // Language options for react-select
  const languageOptions = languages.map((language) => ({
    value: language,
    label: language
  }));

  // Reusable styles for react-select to apply xs font
  const selectStyles = {
    control: (base: any) => ({
      ...base,
      minHeight: '32px',
      fontSize: '0.75rem'
    }),
    option: (base: any) => ({
      ...base,
      fontSize: '0.75rem',
      padding: '8px 12px'
    }),
    singleValue: (base: any) => ({
      ...base,
      fontSize: '0.75rem'
    }),
    menu: (base: any) => ({
      ...base,
      fontSize: '0.75rem'
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: '0.75rem'
    })
  };

  return (
    <div className="text-xs space-y-6"> {/* 🔹 All text now xs */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {/* Title */}
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs">Title *</Label>
                <Controller
                  name="title"
                  control={control}
                  rules={{ required: 'Title is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData.titles.map((title, index) => (
                          <SelectItem key={index} value={title} className="text-xs">
                            {title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* First Name */}
              <div className="space-y-1">
                <Label htmlFor="firstName" className="text-xs">First Name *</Label>
                <Input
                  id="firstName"
                  className="h-8 text-xs"
                  {...register('firstName', {
                    required: 'First Name is required'
                  })}
                />
                {errors.firstName && (
                  <p className="text-xs text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1">
                <Label htmlFor="lastName" className="text-xs">Last Name *</Label>
                <Input
                  id="lastName"
                  className="h-8 text-xs"
                  {...register('lastName', {
                    required: 'Last Name is required'
                  })}
                />
                {errors.lastName && (
                  <p className="text-xs text-red-500">{errors.lastName.message}</p>
                )}
              </div>

              {/* Initial/Middle Name */}
              <div className="space-y-1">
                <Label htmlFor="initial" className="text-xs">Initial/Middle Name</Label>
                <Input id="initial" className="h-8 text-xs" {...register('initial')} />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  className="h-8 text-xs"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Invalid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-xs">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  className="h-8 text-xs"
                  {...register('phone', { required: 'Phone is required' })}
                />
                {errors.phone && (
                  <p className="text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <Label htmlFor="dateOfBirth" className="text-xs">Date of Birth *</Label>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  rules={{ required: 'Date of Birth is required' }}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      className="w-full h-8 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none focus:ring"
                      placeholderText="DD/MM/YYYY"
                      showYearDropdown
                      showMonthDropdown
                      scrollableYearDropdown
                      wrapperClassName="w-full"
                      yearDropdownItemNumber={100}
                      maxDate={new Date()}
                    />
                  )}
                />
                {errors.dateOfBirth && (
                  <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>
                )}
              </div>

              {/* Gender */}
              <div className="space-y-1">
                <Label htmlFor="gender" className="text-xs">Gender *</Label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: 'Gender is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData.gender.map((gender, index) => (
                          <SelectItem key={index} value={gender.toLowerCase()} className="text-xs">
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-xs text-red-500">{errors.gender.message}</p>
                )}
              </div>

              {/* Marital Status */}
              <div className="space-y-1">
                <Label htmlFor="maritalStatus" className="text-xs">Marital Status *</Label>
                <Controller
                  name="maritalStatus"
                  control={control}
                  rules={{ required: 'Marital Status is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData.maritalStatuses.map((status, index) => (
                          <SelectItem key={index} value={status.toLowerCase()} className="text-xs">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.maritalStatus && (
                  <p className="text-xs text-red-500">{errors.maritalStatus.message}</p>
                )}
              </div>

              {/* Nationality */}
              <div className="space-y-1">
                <Label htmlFor="nationality" className="text-xs">Nationality *</Label>
                <Controller
                  name="nationality"
                  control={control}
                  rules={{ required: 'Nationality is required' }}
                  render={({ field }) => (
                    <ReactSelect
                      options={countryOptions}
                      value={countryOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isSearchable
                      styles={selectStyles}
                    />
                  )}
                />
                {errors.nationality && (
                  <p className="text-xs text-red-500">{errors.nationality.message}</p>
                )}
              </div>

              {/* Country of Birth */}
              <div className="space-y-1">
                <Label htmlFor="countryOfBirth" className="text-xs">Country of Birth *</Label>
                <Controller
                  name="countryOfBirth"
                  control={control}
                  rules={{ required: 'Country of Birth is required' }}
                  render={({ field }) => (
                    <ReactSelect
                      options={countryOptions}
                      value={countryOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isSearchable
                      styles={selectStyles}
                    />
                  )}
                />
                {errors.countryOfBirth && (
                  <p className="text-xs text-red-500">{errors.countryOfBirth.message}</p>
                )}
              </div>

              {/* Country of Domicile */}
              <div className="space-y-1">
                <Label htmlFor="countryOfDomicile" className="text-xs">Country of Domicile *</Label>
                <Controller
                  name="countryOfDomicile"
                  control={control}
                  rules={{ required: 'Country of Domicile is required' }}
                  render={({ field }) => (
                    <ReactSelect
                      options={countryOptions}
                      value={countryOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isSearchable
                      styles={selectStyles}
                    />
                  )}
                />
                {errors.countryOfDomicile && (
                  <p className="text-xs text-red-500">{errors.countryOfDomicile.message}</p>
                )}
              </div>

              {/* Native Language */}
              <div className="space-y-1">
                <Label htmlFor="nativeLanguage" className="text-xs">Native Language *</Label>
                <Controller
                  name="nativeLanguage"
                  control={control}
                  rules={{ required: 'Native Language is required' }}
                  render={({ field }) => (
                    <ReactSelect
                      options={languageOptions}
                      value={languageOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isSearchable
                      styles={selectStyles}
                    />
                  )}
                />
                {errors.nativeLanguage && (
                  <p className="text-xs text-red-500">{errors.nativeLanguage.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Address Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Postal Address */}
              <div>
                <h3 className="mb-3 font-medium text-xs">Postal Address</h3>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div className="space-y-1">
                    <Label htmlFor="postalAddressLine1" className="text-xs">Address Line 1 *</Label>
                    <Input
                      id="postalAddressLine1"
                      className="h-8 text-xs"
                      {...register('postalAddressLine1', {
                        required: 'Address Line 1 is required'
                      })}
                    />
                    {errors.postalAddressLine1 && (
                      <p className="text-xs text-red-500">{errors.postalAddressLine1.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalAddressLine2" className="text-xs">Address Line 2</Label>
                    <Input
                      id="postalAddressLine2"
                      className="h-8 text-xs"
                      {...register('postalAddressLine2')}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalCity" className="text-xs">City *</Label>
                    <Input
                      id="postalCity"
                      className="h-8 text-xs"
                      {...register('postalCity', {
                        required: 'City is required'
                      })}
                    />
                    {errors.postalCity && (
                      <p className="text-xs text-red-500">{errors.postalCity.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalCountry" className="text-xs">Country *</Label>
                    <Controller
                      name="postalCountry"
                      control={control}
                      rules={{ required: 'Country is required' }}
                      render={({ field }) => (
                        <ReactSelect
                          options={countryOptions}
                          value={countryOptions.find(
                            (option) => option.value === field.value
                          )}
                          onChange={(option) => field.onChange(option?.value || '')}
                          placeholder="Please select"
                          isSearchable
                          styles={selectStyles}
                        />
                      )}
                    />
                    {errors.postalCountry && (
                      <p className="text-xs text-red-500">{errors.postalCountry.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalPostCode" className="text-xs">Post Code *</Label>
                    <Input
                      id="postalPostCode"
                      className="h-8 text-xs"
                      {...register('postalPostCode', {
                        required: 'Post Code is required'
                      })}
                    />
                    {errors.postalPostCode && (
                      <p className="text-xs text-red-500">{errors.postalPostCode.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Same as Residential Checkbox */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="sameAsResidential"
                  {...register('sameAsResidential')}
                  className="w-3 h-3 rounded border-gray-300"
                />
                <Label htmlFor="sameAsResidential" className="text-xs">
                  Residential address is the same as postal address
                </Label>
              </div>

              {/* Residential Address */}
              {!watchSameAsResidential && (
                <div>
                  <h3 className="mb-3 font-medium text-xs">Residential Address</h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <div className="space-y-1">
                      <Label htmlFor="residentialAddressLine1" className="text-xs">Address Line 1 *</Label>
                      <Input
                        id="residentialAddressLine1"
                        className="h-8 text-xs"
                        {...register('residentialAddressLine1', {
                          required: !watchSameAsResidential ? 'Address Line 1 is required' : false
                        })}
                      />
                      {errors.residentialAddressLine1 && (
                        <p className="text-xs text-red-500">{errors.residentialAddressLine1.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="residentialAddressLine2" className="text-xs">Address Line 2</Label>
                      <Input
                        id="residentialAddressLine2"
                        className="h-8 text-xs"
                        {...register('residentialAddressLine2')}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="residentialCity" className="text-xs">City *</Label>
                      <Input
                        id="residentialCity"
                        className="h-8 text-xs"
                        {...register('residentialCity', {
                          required: !watchSameAsResidential ? 'City is required' : false
                        })}
                      />
                      {errors.residentialCity && (
                        <p className="text-xs text-red-500">{errors.residentialCity.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="residentialCountry" className="text-xs">Country *</Label>
                      <Controller
                        name="residentialCountry"
                        control={control}
                        rules={{
                          required: !watchSameAsResidential ? 'Country is required' : false
                        }}
                        render={({ field }) => (
                          <ReactSelect
                            options={countryOptions}
                            value={countryOptions.find(
                              (option) => option.value === field.value
                            )}
                            onChange={(option) => field.onChange(option?.value || '')}
                            placeholder="Please select"
                            isSearchable
                            styles={selectStyles}
                          />
                        )}
                      />
                      {errors.residentialCountry && (
                        <p className="text-xs text-red-500">{errors.residentialCountry.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="residentialPostCode" className="text-xs">Post Code *</Label>
                      <Input
                        id="residentialPostCode"
                        className="h-8 text-xs"
                        {...register('residentialPostCode', {
                          required: !watchSameAsResidential ? 'Post Code is required' : false
                        })}
                      />
                      {errors.residentialPostCode && (
                        <p className="text-xs text-red-500">{errors.residentialPostCode.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Emergency Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="emergencyFullName" className="text-xs">Full Name *</Label>
                <Input
                  id="emergencyFullName"
                  className="h-8 text-xs"
                  {...register('emergencyFullName', {
                    required: 'Emergency contact name is required'
                  })}
                />
                {errors.emergencyFullName && (
                  <p className="text-xs text-red-500">{errors.emergencyFullName.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="emergencyContactNumber" className="text-xs">Contact Number *</Label>
                <Input
                  id="emergencyContactNumber"
                  type="tel"
                  className="h-8 text-xs"
                  {...register('emergencyContactNumber', {
                    required: 'Emergency contact number is required'
                  })}
                />
                {errors.emergencyContactNumber && (
                  <p className="text-xs text-red-500">{errors.emergencyContactNumber.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="emergencyEmail" className="text-xs">Email</Label>
                <Input
                  id="emergencyEmail"
                  type="email"
                  className="h-8 text-xs"
                  {...register('emergencyEmail')}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="emergencyRelationship" className="text-xs">Relationship *</Label>
                <Input
                  id="emergencyRelationship"
                  className="h-8 text-xs"
                  {...register('emergencyRelationship', {
                    required: 'Relationship is required'
                  })}
                />
                {errors.emergencyRelationship && (
                  <p className="text-xs text-red-500">{errors.emergencyRelationship.message}</p>
                )}
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="emergencyAddress" className="text-xs">Address</Label>
                <Textarea
                  id="emergencyAddress"
                  className="text-xs"
                  {...register('emergencyAddress')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Employment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="isEmployed" className="text-xs">Are you currently employed? *</Label>
                <Controller
                  name="isEmployed"
                  control={control}
                  rules={{ required: 'Employment status is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes" className="text-xs">Yes</SelectItem>
                        <SelectItem value="no" className="text-xs">No</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.isEmployed && (
                  <p className="text-xs text-red-500">{errors.isEmployed.message}</p>
                )}
              </div>

              {watch('isEmployed') === 'yes' && (
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1">
                    <Label htmlFor="currentEmployer" className="text-xs">Current Employer</Label>
                    <Input
                      id="currentEmployer"
                      className="h-8 text-xs"
                      {...register('currentEmployer')}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="currentJobTitle" className="text-xs">Job Title</Label>
                    <Input
                      id="currentJobTitle"
                      className="h-8 text-xs"
                      {...register('currentJobTitle')}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="employmentType" className="text-xs">Employment Type</Label>
                    <Controller
                      name="employmentType"
                      control={control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger className="h-8 text-xs">
                            <SelectValue placeholder="Please select" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockData.employmentTypes.map((type, index) => (
                              <SelectItem key={index} value={type} className="text-xs">
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="employmentStartDate" className="text-xs">Start Date</Label>
                    <Controller
                      name="employmentStartDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="dd/MM/yyyy"
                          className="w-full h-8 rounded-md border border-gray-300 bg-white px-2 py-1 text-xs focus:outline-none"
                          placeholderText="DD/MM/YYYY"
                          showYearDropdown
                          showMonthDropdown
                          scrollableYearDropdown
                          wrapperClassName="w-full"
                          yearDropdownItemNumber={20}
                          maxDate={new Date()}
                        />
                      )}
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="responsibilities" className="text-xs">Job Responsibilities</Label>
                    <Textarea
                      id="responsibilities"
                      className="text-xs"
                      {...register('responsibilities')}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="hasPreviousEmployment" className="text-xs">Do you have previous employment experience?</Label>
                <Controller
                  name="hasPreviousEmployment"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes" className="text-xs">Yes</SelectItem>
                        <SelectItem value="no" className="text-xs">No</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Additional Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="disability" className="text-xs">Do you have any disabilities? *</Label>
                <Controller
                  name="disability"
                  control={control}
                  rules={{ required: 'Disability status is required' }}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no" className="text-xs">No</SelectItem>
                        <SelectItem value="yes" className="text-xs">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.disability && (
                  <p className="text-xs text-red-500">{errors.disability.message}</p>
                )}
              </div>

              {watch('disability') === 'yes' && (
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="disabilityDetails" className="text-xs">Please provide details</Label>
                  <Textarea
                    id="disabilityDetails"
                    className="text-xs"
                    {...register('disabilityDetails')}
                    rows={3}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visa Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Visa Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor="completedUKCourse" className="text-xs">Have you completed a UK course before?</Label>
                <Controller
                  name="completedUKCourse"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes" className="text-xs">Yes</SelectItem>
                        <SelectItem value="no" className="text-xs">No</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="visaRequired" className="text-xs">Do you require a visa?</Label>
                <Controller
                  name="visaRequired"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes" className="text-xs">Yes</SelectItem>
                        <SelectItem value="no" className="text-xs">No</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="visaRefusal" className="text-xs">Have you ever been refused a visa?</Label>
                <Controller
                  name="visaRefusal"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes" className="text-xs">Yes</SelectItem>
                        <SelectItem value="no" className="text-xs">No</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              {watch('visaRefusal') === 'yes' && (
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="visaRefusalDetail" className="text-xs">Please provide details</Label>
                  <Textarea
                    id="visaRefusalDetail"
                    className="text-xs"
                    {...register('visaRefusalDetail')}
                    rows={3}
                  />
                </div>
              )}
              <div className="space-y-1">
                <Label htmlFor="enteredUKBefore" className="text-xs">Have you entered the UK before?</Label>
                <Controller
                  name="enteredUKBefore"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes" className="text-xs">Yes</SelectItem>
                        <SelectItem value="no" className="text-xs">No</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="studentType" className="text-xs">Student Type</Label>
                <Controller
                  name="studentType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="domestic" className="text-xs">Domestic</SelectItem>
                        <SelectItem value="international" className="text-xs">International</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="applicationLocation" className="text-xs">Application Location</Label>
                <Controller
                  name="applicationLocation"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      options={countryOptions}
                      value={countryOptions.find(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isSearchable
                      styles={selectStyles}
                    />
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="fundingType" className="text-xs">Funding Type</Label>
                <Controller
                  name="fundingType"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue placeholder="Please select" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockData.fundingTypes.map((type, index) => (
                          <SelectItem key={index} value={type} className="text-xs">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hearAboutUs" className="text-xs">How did you hear about us?</Label>
                <Input
                  id="hearAboutUs"
                  className="h-8 text-xs"
                  {...register('hearAboutUs')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="h-8 px-4 py-1 text-xs">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}