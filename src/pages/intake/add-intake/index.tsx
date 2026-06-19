import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import axiosInstance from "@/lib/axios"
import { useToast } from "@/components/ui/use-toast"
import moment from "@/lib/moment-setup"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { CalendarIcon, X } from "lucide-react"
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

export default function AddIntakePage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const form = useForm<IntakeFormValues>({
    resolver: zodResolver(intakeFormSchema),
    defaultValues: {
      termName: "",
      validTillDate: undefined,
    },
  })

  const onSubmit = async (data: IntakeFormValues) => {
    setLoading(true)
    
    try {
      const payload: {
        termName: string;
        validTillDate?: string;
      } = {
        termName: data.termName,
      }

      // Only include validTillDate if it's provided
      if (data.validTillDate) {
        payload.validTillDate = new Date(
          Date.UTC(
            data.validTillDate.getFullYear(),
            data.validTillDate.getMonth(),
            data.validTillDate.getDate()
          )
        ).toISOString()
      }

      await axiosInstance.post("/terms", payload)
      
      toast({
        title: "Success",
        description: "Intake has been created successfully.",
      })
      navigate(-1)
    } catch (error) {
      console.error("Failed to create intake:", error)
      toast({
        title: "Error",
        description: "Failed to create intake. Please try again.",
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
        className="flex h-8 w-full items-center rounded-md border border-gray-300 px-3 py-2 text-xs ring-offset-background  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={loading}
      >
        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
        {value || <span className="text-gray-400">Pick a date</span>}
      </button>
      
    </div>
  ))
  CustomDatePickerInput.displayName = "CustomDatePickerInput"

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
              <CardTitle className="text-2xl font-bold">Add New Intake</CardTitle>
              <CardDescription className="text-xs mt-1">
                Create a new intake term
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
                          minDate={new Date()}
                          placeholderText="Pick a date"
                          isClearable
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          customInput={
                            <CustomDatePickerInput />
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



              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  className="text-xs h-8 px-6 bg-theme text-white hover:bg-theme/90"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Intake"
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