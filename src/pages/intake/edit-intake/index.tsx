import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import axiosInstance from "@/lib/axios"
import { useToast } from "@/components/ui/use-toast"
import moment from "@/lib/moment-setup"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { CalendarIcon } from "lucide-react"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

// Zod validation schema - matches the Term model exactly
const intakeFormSchema = z.object({
  termName: z.string()
    .min(1, "Intake name is required")
    .min(3, "Intake name must be at least 3 characters")
    .max(100, "Intake name must not exceed 100 characters")
    .trim(),
  validTillDate: z.date({
    invalid_type_error: "Please select a valid date",
  }).optional().nullable(),
})

type IntakeFormValues = z.infer<typeof intakeFormSchema>

interface TermType {
  _id: string
  termName: string
  validTillDate?: string
  status: number
}

export default function EditIntakePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [fetchingIntake, setFetchingIntake] = useState(true)

  const form = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      termName: "",
      validTillDate: undefined,
    },
  })

  // Fetch intake data
  useEffect(() => {
    const fetchIntake = async () => {
      try {
        const res = await axiosInstance.get(`/terms/${id}`)
        const intake: TermType = res.data.data
        
        // Set form values
        form.reset({
          termName: intake.termName,
          validTillDate: intake.validTillDate ? moment(intake.validTillDate).toDate() : undefined,
        })
      } catch (error) {
        console.error("Failed to fetch intake:", error)
        toast({
          title: "Error",
          description: "Failed to fetch intake details. Please try again.",
          variant: "destructive",
        })
        navigate(-1)
      } finally {
        setFetchingIntake(false)
      }
    }

    if (id) {
      fetchIntake()
    }
  }, [id, form, navigate, toast])

  const onSubmit = async (data: IntakeFormValues) => {
    setLoading(true)
    
    try {
      const payload: {
        termName: string;
        validTillDate?: string | null;
      } = {
        termName: data.termName,
      }

      // Handle date - if null/undefined, set to null to clear it
      if (data.validTillDate) {
        payload.validTillDate = new Date(
          Date.UTC(
            data.validTillDate.getFullYear(),
            data.validTillDate.getMonth(),
            data.validTillDate.getDate()
          )
        ).toISOString()
      } else {
        payload.validTillDate = null // Send null to clear the date
      }

      await axiosInstance.patch(`/terms/${id}`, payload)
      
      toast({
        title: "Success",
        description: "Intake has been updated successfully.",
      })
      navigate(-1)
    } catch (error) {
      console.error("Failed to update intake:", error)
      toast({
        title: "Error",
        description: "Failed to update intake. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Custom input component for react-datepicker
  const CustomDatePickerInput = React.forwardRef<
    HTMLButtonElement,
    { value?: string; onClick?: () => void; onClear?: () => void }
  >(({ value, onClick, onClear }, ref) => (
    <div className="relative w-full">
      <button
        type="button"
        onClick={onClick}
        ref={ref}
        className="flex h-8 w-full items-center rounded-md border border-gray-300 px-3 py-2 text-xs ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={loading}
      >
        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
        {value || <span className="text-gray-400">Pick a date</span>}
      </button>
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onClear?.()
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          disabled={loading}
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  ))
  CustomDatePickerInput.displayName = "CustomDatePickerInput"

  // Show loading state while fetching intake
  if (fetchingIntake) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-sm">Loading intake details...</span>
      </div>
    )
  }

  return (
    <div className="">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div onClick={() => navigate(-1)}>
              <Button variant="outline" size="sm" className="text-xs bg-theme text-white hover:bg-theme/90">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Edit Intake</CardTitle>
              <CardDescription className="text-xs mt-1">
                Update the intake term details
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-xs">
              {/* --- Grid Section --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Intake Name */}
                <FormField
                  control={form.control}
                  name="termName"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium">
                        Intake Name <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter intake name (e.g., Spring 2024)"
                          {...field}
                          className="text-xs h-8"
                          disabled={loading}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />

                {/* Available Till - React DatePicker (Optional) */}
                <FormField
                  control={form.control}
                  name="validTillDate"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-xs font-medium">
                        Valid till date 
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => field.onChange(date)}
                          dateFormat="dd/MM/yyyy"
                          placeholderText="Pick a date"
                          isClearable
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          customInput={
                            <CustomDatePickerInput 
                              onClear={() => field.onChange(null)}
                            />
                          }
                          wrapperClassName="w-full"
                          className="w-full"
                          disabled={loading}
                        />
                      </FormControl>
                     
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              
              {/* --- Submit Button --- */}
              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="text-xs h-8 px-6 bg-theme text-white hover:bg-theme/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}