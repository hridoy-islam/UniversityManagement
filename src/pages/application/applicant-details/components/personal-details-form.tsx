import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ReactSelect from 'react-select';
import { countries, nationalities } from '@/types';

// Options data
const mockData = {
  titles: ['Mr', 'Mrs', 'Miss', 'Ms', 'Dr', 'Prof'],
  maritalStatuses: ['Single', 'Married', 'Divorced', 'Widowed', 'Separated'],
  gender: ['Male', 'Female', 'Other', 'Prefer not to say'],
  employmentTypes: ['Full-Time', 'Part-Time', 'Contract', 'Freelance', 'Unemployed'],
};

const languages = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Arabic', 'Chinese (Mandarin)', 'Japanese', 'Korean', 'Hindi',
  'Bengali', 'Urdu', 'Russian', 'Dutch', 'Swedish', 'Other'
];
 const fundingOptions = [
    { value: 'Self', label: 'Self' },
    // { value: 'Student Loan', label: 'Student Loan' },
    { value: 'Employer', label: 'Employer' },
    {
      value: 'SLC',
      label: 'SLC'
    }
  ];
// Convert arrays to react-select options
const titleOptions = mockData.titles.map(item => ({ value: item, label: item }));
const maritalStatusOptions = mockData.maritalStatuses.map(item => ({ value: item.toLowerCase(), label: item }));
const genderOptions = mockData.gender.map(item => ({ value: item.toLowerCase(), label: item }));
const employmentTypeOptions = mockData.employmentTypes.map(item => ({ value: item, label: item }));
const languageOptions = languages.map(item => ({ value: item, label: item }));
const countryOptions = countries.map(country => ({ value: country, label: country }));
const nationalityOptions = nationalities.map(nationality => ({ value: nationality, label: nationality }));

// Yes/No options
const yesNoOptions = [
  { value: 'yes', label: 'Yes' },
  { value: 'no', label: 'No' }
];

interface PersonalDetailsFormProps {
  student?: any;
  onSave: (data: any) => void;
}

export function PersonalDetailsForm({ student, onSave }: PersonalDetailsFormProps) {
  const {
    handleSubmit,
    register,
    control,
    reset,
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
      countryOfResidence: '',
      nativeLanguage: '',
      passportName: '',
      passportIssueLocation: '',
      passportNumber: '',
      passportIssueDate: null,
      passportExpiryDate: null,
      collegeRoll: '',
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
      emergencyFullName: '',
      emergencyContactNumber: '',
      emergencyEmail: '',
      emergencyRelationship: '',
      emergencyAddress: '',
      disability: '',
      disabilityDetails: '',
      ethnicity: '',
      genderIdentity: '',
      sexualOrientation: '',
      religion: '',
      isEmployed: '',
      currentEmployment: {
        employer: '',
        jobTitle: '',
        startDate: null,
        employmentType: ''
      },
      hasPreviousEmployment: '',
      previousEmployments: [],
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

  // Add useFieldArray for previous employments
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'previousEmployments'
  });

  const watchSameAsResidential = watch('sameAsResidential');
  const watchIsEmployed = watch('isEmployed');
  const watchDisability = watch('disability');
  const watchVisaRefusal = watch('visaRefusal');
  const watchHasPreviousEmployment = watch('hasPreviousEmployment');

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
        countryOfResidence: student.countryOfResidence || '',
        nativeLanguage: student.nativeLanguage || '',
        passportName: student.passportName || '',
        passportIssueLocation: student.passportIssueLocation || '',
        passportNumber: student.passportNumber || '',
        passportIssueDate: student.passportIssueDate ? new Date(student.passportIssueDate) : null,
        passportExpiryDate: student.passportExpiryDate ? new Date(student.passportExpiryDate) : null,
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
        currentEmployment: {
          employer: student.currentEmployment?.employer || '',
          jobTitle: student.currentEmployment?.jobTitle || '',
          startDate: student.currentEmployment?.startDate ? new Date(student.currentEmployment.startDate) : null,
          employmentType: student.currentEmployment?.employmentType || ''
        },
        hasPreviousEmployment: student.hasPreviousEmployment || '',
        previousEmployments: student.previousEmployments?.map((emp: any) => ({
          employer: emp.employer || '',
          jobTitle: emp.jobTitle || '',
          startDate: emp.startDate ? new Date(emp.startDate) : null,
          endDate: emp.endDate ? new Date(emp.endDate) : null,
          employmentType: emp.employmentType || ''
        })) || [],
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

  // Reusable styles for react-select
  const selectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '32px',
      height: '32px',
      fontSize: '0.75rem',
      borderColor: state.isFocused ? 'hsl(var(--ring))' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px hsl(var(--ring))' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? 'hsl(var(--ring))' : 'hsl(var(--input))'
      }
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '0 8px',
      height: '30px'
    }),
    input: (base: any) => ({
      ...base,
      fontSize: '0.75rem',
      margin: 0,
      padding: 0
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
      fontSize: '0.75rem',
      zIndex: 50
    }),
    placeholder: (base: any) => ({
      ...base,
      fontSize: '0.75rem'
    })
  };

  return (
    <div className="text-xs space-y-6">
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
                    <ReactSelect
                      {...field}
                      options={titleOptions}
                      value={titleOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isSearchable
                      styles={selectStyles}
                    />
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
                  {...register('firstName', { required: 'First Name is required' })}
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
                  {...register('lastName', { required: 'Last Name is required' })}
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
                    <ReactSelect
                      {...field}
                      options={genderOptions}
                      value={genderOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isSearchable
                      styles={selectStyles}
                    />
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
                    <ReactSelect
                      {...field}
                      options={maritalStatusOptions}
                      value={maritalStatusOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isSearchable
                      styles={selectStyles}
                    />
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
                      {...field}
                      options={nationalityOptions}
                      value={nationalityOptions.find(option => option.value === field.value)}
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
                      {...field}
                      options={countryOptions}
                      value={countryOptions.find(option => option.value === field.value)}
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
                <Label htmlFor="countryOfResidence" className="text-xs">Country of Domicile *</Label>
                <Controller
                  name="countryOfResidence"
                  control={control}
                  rules={{ required: 'Country of Domicile is required' }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={countryOptions}
                      value={countryOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isSearchable
                      styles={selectStyles}
                    />
                  )}
                />
                {errors.countryOfResidence && (
                  <p className="text-xs text-red-500">{errors.countryOfResidence.message}</p>
                )}
              </div>

              {/* Native Language */}
              <div className="space-y-1">
                <Label htmlFor="nativeLanguage" className="text-xs">Native Language </Label>
                <Controller
                  name="nativeLanguage"
                  control={control}
                  // rules={{ required: 'Native Language is required' }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={languageOptions}
                      value={languageOptions.find(option => option.value === field.value)}
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
                      {...register('postalAddressLine1', { required: 'Address Line 1 is required' })}
                    />
                    {errors.postalAddressLine1 && (
                      <p className="text-xs text-red-500">{errors.postalAddressLine1.message}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalAddressLine2" className="text-xs">Address Line 2</Label>
                    <Input id="postalAddressLine2" className="h-8 text-xs" {...register('postalAddressLine2')} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="postalCity" className="text-xs">City *</Label>
                    <Input
                      id="postalCity"
                      className="h-8 text-xs"
                      {...register('postalCity', { required: 'City is required' })}
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
                          {...field}
                          options={countryOptions}
                          value={countryOptions.find(option => option.value === field.value)}
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
                      {...register('postalPostCode', { required: 'Post Code is required' })}
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
                      <Input id="residentialAddressLine2" className="h-8 text-xs" {...register('residentialAddressLine2')} />
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
                            {...field}
                            options={countryOptions}
                            value={countryOptions.find(option => option.value === field.value)}
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
                  {...register('emergencyFullName', { required: 'Emergency contact name is required' })}
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
                  {...register('emergencyContactNumber', { required: 'Emergency contact number is required' })}
                />
                {errors.emergencyContactNumber && (
                  <p className="text-xs text-red-500">{errors.emergencyContactNumber.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label htmlFor="emergencyEmail" className="text-xs">Email</Label>
                <Input id="emergencyEmail" type="email" className="h-8 text-xs" {...register('emergencyEmail')} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="emergencyRelationship" className="text-xs">Relationship *</Label>
                <Input
                  id="emergencyRelationship"
                  className="h-8 text-xs"
                  {...register('emergencyRelationship', { required: 'Relationship is required' })}
                />
                {errors.emergencyRelationship && (
                  <p className="text-xs text-red-500">{errors.emergencyRelationship.message}</p>
                )}
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="emergencyAddress" className="text-xs">Address</Label>
                <Textarea id="emergencyAddress" className="text-xs" {...register('emergencyAddress')} />
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
            <div className="space-y-4">
              {/* Currently Employed Question */}
              <div className="space-y-1">
                <Label htmlFor="isEmployed" className="text-xs">
                  Are you currently employed? *
                </Label>
                <Controller
                  name="isEmployed"
                  control={control}
                  rules={{ required: 'Employment status is required' }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={yesNoOptions}
                      value={yesNoOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      styles={selectStyles}
                    />
                  )}
                />
                {errors.isEmployed && (
                  <p className="text-xs text-red-500">{errors.isEmployed.message}</p>
                )}
              </div>

              {/* Current Employment Details */}
              {watchIsEmployed === 'yes' && (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <h3 className="font-medium text-xs">Current Employment Details</h3>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <div className="space-y-1">
                      <Label htmlFor="currentEmployment.employer" className="text-xs">
                        Employer Name *
                      </Label>
                      <Input
                        id="currentEmployment.employer"
                        className="h-8 text-xs"
                        {...register('currentEmployment.employer', {
                          required: watchIsEmployed === 'yes' ? 'Employer name is required' : false
                        })}
                      />
                      {errors.currentEmployment?.employer && (
                        <p className="text-xs text-red-500">{errors.currentEmployment.employer.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="currentEmployment.jobTitle" className="text-xs">
                        Job Position *
                      </Label>
                      <Input
                        id="currentEmployment.jobTitle"
                        className="h-8 text-xs"
                        {...register('currentEmployment.jobTitle', {
                          required: watchIsEmployed === 'yes' ? 'Job title is required' : false
                        })}
                      />
                      {errors.currentEmployment?.jobTitle && (
                        <p className="text-xs text-red-500">{errors.currentEmployment.jobTitle.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="currentEmployment.startDate" className="text-xs">
                        Start Date *
                      </Label>
                      <Controller
                        name="currentEmployment.startDate"
                        control={control}
                        rules={{
                          required: watchIsEmployed === 'yes' ? 'Start date is required' : false
                        }}
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
                            yearDropdownItemNumber={20}
                            maxDate={new Date()}
                          />
                        )}
                      />
                      {errors.currentEmployment?.startDate && (
                        <p className="text-xs text-red-500">{errors.currentEmployment.startDate.message}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="currentEmployment.employmentType" className="text-xs">
                        Employment Type *
                      </Label>
                      <Controller
                        name="currentEmployment.employmentType"
                        control={control}
                        rules={{
                          required: watchIsEmployed === 'yes' ? 'Employment type is required' : false
                        }}
                        render={({ field }) => (
                          <ReactSelect
                            {...field}
                            options={employmentTypeOptions}
                            value={employmentTypeOptions.find(option => option.value === field.value)}
                            onChange={(option) => field.onChange(option?.value || '')}
                            placeholder="Please select"
                            styles={selectStyles}
                          />
                        )}
                      />
                      {errors.currentEmployment?.employmentType && (
                        <p className="text-xs text-red-500">{errors.currentEmployment.employmentType.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Previous Employment Question */}
              <div className="space-y-1">
                <Label htmlFor="hasPreviousEmployment" className="text-xs">
                  Do you have previous employment history? *
                </Label>
                <Controller
                  name="hasPreviousEmployment"
                  control={control}
                  rules={{ required: 'Previous employment status is required' }}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={yesNoOptions}
                      value={yesNoOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      styles={selectStyles}
                    />
                  )}
                />
                <p className="text-xs text-gray-400">
                  List any previous jobs you've held. Include job title, employer, dates, and responsibilities.
                </p>
                {errors.hasPreviousEmployment && (
                  <p className="text-xs text-red-500">{errors.hasPreviousEmployment.message}</p>
                )}
              </div>

              {/* Previous Employment Details */}
              {watchHasPreviousEmployment === 'yes' && (
                <div className="space-y-4">
                  <h3 className="font-medium text-xs">Previous Employment</h3>

                  {fields.map((fieldItem, index) => (
                    <div
                      key={fieldItem.id}
                      className="border border-gray-200 rounded-lg p-4 space-y-3"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-medium">Employment #{index + 1}</h4>
                        {fields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        {/* Employer Name */}
                        <div className="space-y-1">
                          <Label htmlFor={`previousEmployments.${index}.employer`} className="text-xs">
                            Employer Name *
                          </Label>
                          <Input
                            id={`previousEmployments.${index}.employer`}
                            className="h-8 text-xs"
                            {...register(`previousEmployments.${index}.employer`, {
                              required: 'Employer name is required'
                            })}
                            placeholder="Company Name"
                          />
                          {errors.previousEmployments?.[index]?.employer && (
                            <p className="text-xs text-red-500">
                              {errors.previousEmployments[index]?.employer?.message}
                            </p>
                          )}
                        </div>

                        {/* Job Title */}
                        <div className="space-y-1">
                          <Label htmlFor={`previousEmployments.${index}.jobTitle`} className="text-xs">
                            Job Position *
                          </Label>
                          <Input
                            id={`previousEmployments.${index}.jobTitle`}
                            className="h-8 text-xs"
                            {...register(`previousEmployments.${index}.jobTitle`, {
                              required: 'Job title is required'
                            })}
                            placeholder="Position"
                          />
                          {errors.previousEmployments?.[index]?.jobTitle && (
                            <p className="text-xs text-red-500">
                              {errors.previousEmployments[index]?.jobTitle?.message}
                            </p>
                          )}
                        </div>

                        {/* Start Date */}
                        <div className="space-y-1">
                          <Label htmlFor={`previousEmployments.${index}.startDate`} className="text-xs">
                            Start Date *
                          </Label>
                          <Controller
                            name={`previousEmployments.${index}.startDate`}
                            control={control}
                            rules={{ required: 'Start date is required' }}
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
                                yearDropdownItemNumber={50}
                                maxDate={new Date()}
                              />
                            )}
                          />
                          {errors.previousEmployments?.[index]?.startDate && (
                            <p className="text-xs text-red-500">
                              {errors.previousEmployments[index]?.startDate?.message}
                            </p>
                          )}
                        </div>

                        {/* End Date */}
                        <div className="space-y-1">
                          <Label htmlFor={`previousEmployments.${index}.endDate`} className="text-xs">
                            End Date *
                          </Label>
                          <Controller
                            name={`previousEmployments.${index}.endDate`}
                            control={control}
                            rules={{ required: 'End date is required' }}
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
                                yearDropdownItemNumber={50}
                                maxDate={new Date()}
                              />
                            )}
                          />
                          {errors.previousEmployments?.[index]?.endDate && (
                            <p className="text-xs text-red-500">
                              {errors.previousEmployments[index]?.endDate?.message}
                            </p>
                          )}
                        </div>

                        {/* Employment Type */}
                        <div className="space-y-1">
                          <Label htmlFor={`previousEmployments.${index}.employmentType`} className="text-xs">
                            Employment Type *
                          </Label>
                          <Controller
                            name={`previousEmployments.${index}.employmentType`}
                            control={control}
                            rules={{ required: 'Employment type is required' }}
                            render={({ field }) => (
                              <ReactSelect
                                {...field}
                                options={employmentTypeOptions}
                                value={employmentTypeOptions.find(option => option.value === field.value)}
                                onChange={(option) => field.onChange(option?.value || '')}
                                placeholder="Select Type of Employment"
                                styles={selectStyles}
                              />
                            )}
                          />
                          {errors.previousEmployments?.[index]?.employmentType && (
                            <p className="text-xs text-red-500">
                              {errors.previousEmployments[index]?.employmentType?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      append({
                        employer: '',
                        jobTitle: '',
                        startDate: null,
                        endDate: null,
                        employmentType: ''
                      })
                    }
                    className="text-xs"
                  >
                    Add More Experience
                  </Button>
                </div>
              )}
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
                    <ReactSelect
                      {...field}
                      options={yesNoOptions}
                      value={yesNoOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      styles={selectStyles}
                    />
                  )}
                />
                {errors.disability && (
                  <p className="text-xs text-red-500">{errors.disability.message}</p>
                )}
              </div>

              {watchDisability === 'yes' && (
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="disabilityDetails" className="text-xs">Please provide details</Label>
                  <Textarea id="disabilityDetails" className="text-xs" {...register('disabilityDetails')} rows={3} />
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
                    <ReactSelect
                      {...field}
                      options={yesNoOptions}
                      value={yesNoOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isClearable
                      styles={selectStyles}
                    />
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="visaRequired" className="text-xs">Do you require a visa?</Label>
                <Controller
                  name="visaRequired"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={yesNoOptions}
                      value={yesNoOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isClearable
                      styles={selectStyles}
                    />
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="visaRefusal" className="text-xs">Have you ever been refused a visa?</Label>
                <Controller
                  name="visaRefusal"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={yesNoOptions}
                      value={yesNoOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isClearable
                      styles={selectStyles}
                    />
                  )}
                />
              </div>
              {watchVisaRefusal === 'yes' && (
                <div className="space-y-1 md:col-span-2">
                  <Label htmlFor="visaRefusalDetail" className="text-xs">Please provide details</Label>
                  <Textarea id="visaRefusalDetail" className="text-xs" {...register('visaRefusalDetail')} rows={3} />
                </div>
              )}
              <div className="space-y-1">
                <Label htmlFor="enteredUKBefore" className="text-xs">Have you entered the UK before?</Label>
                <Controller
                  name="enteredUKBefore"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={yesNoOptions}
                      value={yesNoOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isClearable
                      styles={selectStyles}
                    />
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="studentType" className="text-xs">Student Type</Label>
                <Controller
                  name="studentType"
                  control={control}
                  render={({ field }) => (
                    <ReactSelect
                      {...field}
                      options={[
                        { value: 'international', label: 'International' },
                        { value: 'eu', label: 'Home' }
                      ]}
                      value={[
                        { value: 'international', label: 'International' },
                        { value: 'eu', label: 'Home' }
                      ].find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isClearable
                      styles={selectStyles}
                    />
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
                      {...field}
                      options={countryOptions}
                      value={countryOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isSearchable
                      isClearable
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
                    <ReactSelect
                      {...field}
                      options={fundingOptions}
                      value={fundingOptions.find(option => option.value === field.value)}
                      onChange={(option) => field.onChange(option?.value || '')}
                      placeholder="Please select"
                      isClearable
                      styles={selectStyles}
                    />
                  )}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="hearAboutUs" className="text-xs">How did you hear about us?</Label>
                <Input id="hearAboutUs" className="h-8 text-xs" {...register('hearAboutUs')} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" className="text-xs">
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}