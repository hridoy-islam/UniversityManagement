import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import Select from 'react-select';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .optional()
    .or(z.literal('')),
  host: z.string().min(1, 'Host is required'),
  port: z.coerce.number().min(1, 'Port is required'),
  encryption: z.string().min(2, 'Encryption is required'),
  authentication: z.string().min(2, 'Authentication is required')
});

const encryptionOptions = [
  { value: 'ssl', label: 'SSL' },
  { value: 'tls', label: 'TLS' }
];

const authenticationOptions = [
  { value: 'true', label: 'True' },
  { value: 'false', label: 'False' }
];

const customSelectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: '32px',
    height: '32px',
    fontSize: '12px',
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#9ca3af'
    }
  }),
  valueContainer: (base: any) => ({
    ...base,
    padding: '0 8px',
    height: '30px'
  }),
  input: (base: any) => ({
    ...base,
    margin: '0',
    padding: '0',
    fontSize: '12px'
  }),
  placeholder: (base: any) => ({
    ...base,
    fontSize: '12px',
    color: '#9ca3af'
  }),
  singleValue: (base: any) => ({
    ...base,
    fontSize: '12px'
  }),
  menu: (base: any) => ({
    ...base,
    fontSize: '12px',
    zIndex: 50
  }),
  option: (base: any, state: any) => ({
    ...base,
    fontSize: '12px',
    backgroundColor: state.isSelected
      ? '#3b82f6'
      : state.isFocused
      ? '#eff6ff'
      : 'white',
    color: state.isSelected ? 'white' : '#374151',
    cursor: 'pointer',
    '&:active': {
      backgroundColor: state.isSelected ? '#3b82f6' : '#dbeafe'
    }
  }),
  indicatorSeparator: (base: any) => ({
    ...base,
    display: 'none'
  }),
  dropdownIndicator: (base: any) => ({
    ...base,
    padding: '4px'
  })
};

export function EmailConfigDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData
}: any) { // Added basic :any typing here to fix potential strict mode lint issues, adapt as needed.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      host: '',
      port: 0 as unknown as string, // Adjusted for correct initial coercion handling
      encryption: '',
      authentication: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        email: initialData.email || '',
        password: initialData.password || '',
        host: initialData.host || '',
        port: initialData.port || 587,
        encryption: initialData.encryption || 'tls',
        authentication: initialData.authentication ? 'true' : 'false'
      });
    } else {
      form.reset({
        email: '',
        password: '',
        host: '',
        port: '' as unknown as number, // Keeps input blank on new add
        encryption: '',
        authentication: ''
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const formattedValues = {
        ...values,
        authentication: values.authentication === 'true' // Convert string to boolean
      };

      // Exclude the password field if it's empty (only in edit mode)
      if (initialData && !formattedValues.password) {
        delete formattedValues.password;
      }

      await onSubmit(formattedValues);
      onOpenChange(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData
              ? 'Edit Email Configuration'
              : 'Add New Email Configuration'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Edit the email configuration details below.'
              : 'Add a new email configuration to the system.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Email <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="SMTP Email" 
                        {...field} 
                        className="text-xs h-8"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Password {!initialData && <span className="text-red-500">*</span>}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={initialData ? "Leave blank to keep current" : "SMTP Email Password"}
                        {...field}
                        className="text-xs h-8"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="host"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Host <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="SMTP Host" 
                        {...field} 
                        className="text-xs h-8"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="port"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Port <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="SMTP Port" 
                        {...field} 
                        className="text-xs h-8"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="encryption"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Encryption <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={encryptionOptions.find(option => option.value === field.value)}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption?.value);
                        }}
                        options={encryptionOptions}
                        styles={customSelectStyles}
                        placeholder="Select encryption"
                        isSearchable={false}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="authentication"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">
                      Authentication <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={authenticationOptions.find(option => option.value === field.value)}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption?.value);
                        }}
                        options={authenticationOptions}
                        styles={customSelectStyles}
                        placeholder="Select authentication"
                        isSearchable={false}
                      />
                    </FormControl>
                    <FormMessage className="text-[10px]" />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-theme text-white hover:bg-theme/90 text-xs"
              >
                {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}