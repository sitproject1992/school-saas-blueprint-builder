import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Building, Globe, Mail, Phone, MapPin } from "lucide-react";

const schoolSchema = z.object({
  name: z.string().min(2, "School name must be at least 2 characters"),
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(30, "Subdomain must be less than 30 characters")
    .regex(
      /^[a-z0-9-]+$/,
      "Subdomain must contain only lowercase letters, numbers, and hyphens",
    ),
  email: z
    .string()
    .email("Please enter a valid email address")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .optional()
    .or(z.literal("")),
  address: z.string().optional(),
  website: z
    .string()
    .url("Please enter a valid website URL")
    .optional()
    .or(z.literal("")),
  subscriptionStatus: z.enum(["active", "inactive", "suspended", "cancelled"]),
  subscriptionExpiresAt: z.string().optional(),
  themeColor: z.string().optional(),
  description: z.string().optional(),
  maxStudents: z.number().min(1, "Must allow at least 1 student").optional(),
  maxTeachers: z.number().min(1, "Must allow at least 1 teacher").optional(),
  features: z.array(z.string()).optional(),
});

type SchoolFormData = z.infer<typeof schoolSchema>;

interface School {
  id: string;
  name: string;
  subdomain: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  subscriptionStatus: string;
  subscriptionExpiresAt: string | null;
  themeColor: string | null;
  createdAt: string;
}

interface SchoolFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: SchoolFormData) => Promise<void>;
  editData?: Partial<School>;
}

export function SchoolForm({
  open,
  onOpenChange,
  onSubmit,
  editData,
}: SchoolFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editData?.id;

  const form = useForm<SchoolFormData>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: editData?.name || "",
      subdomain: editData?.subdomain || "",
      email: editData?.email || "",
      phone: editData?.phone || "",
      address: editData?.address || "",
      website: editData?.website || "",
      subscriptionStatus: (editData?.subscriptionStatus as any) || "active",
      subscriptionExpiresAt: editData?.subscriptionExpiresAt || "",
      themeColor: editData?.themeColor || "#3b82f6",
      description: "",
      maxStudents: 500,
      maxTeachers: 50,
      features: ["attendance", "grades", "communication", "fees"],
    },
  });

  const handleSubmit = async (data: SchoolFormData) => {
    setIsLoading(true);
    try {
      await onSubmit(data);
      form.reset();
      onOpenChange(false);
      toast.success(
        isEditing
          ? "School updated successfully"
          : "School created successfully",
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save school",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubdomainAvailability = async (subdomain: string) => {
    // Simulate API call to check subdomain availability
    await new Promise((resolve) => setTimeout(resolve, 500));
    const reservedSubdomains = ["admin", "api", "www", "mail", "test", "dev"];
    if (reservedSubdomains.includes(subdomain.toLowerCase())) {
      form.setError("subdomain", { message: "This subdomain is reserved" });
      return false;
    }
    return true;
  };

  const generateSubdomain = () => {
    const name = form.getValues("name");
    if (name) {
      const subdomain = name
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-")
        .substring(0, 20);
      form.setValue("subdomain", subdomain);
    }
  };

  const availableFeatures = [
    { id: "attendance", label: "Attendance Management" },
    { id: "grades", label: "Grade Management" },
    { id: "communication", label: "Communication Tools" },
    { id: "fees", label: "Fee Management" },
    { id: "inventory", label: "Inventory Management" },
    { id: "library", label: "Library Management" },
    { id: "transport", label: "Transport Management" },
    { id: "reports", label: "Advanced Reports" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            {isEditing ? "Edit School" : "Add New School"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the school information and settings."
              : "Create a new school with administrative settings and subscription details."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Green Valley High School"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (!isEditing) generateSubdomain();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subdomain"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subdomain</FormLabel>
                    <FormControl>
                      <div className="flex">
                        <Input
                          placeholder="greenvalley"
                          {...field}
                          disabled={isEditing}
                          className="rounded-r-none"
                        />
                        <div className="bg-gray-100 border border-l-0 px-3 py-2 rounded-r-md text-sm text-gray-600">
                          .skooler.com
                        </div>
                      </div>
                    </FormControl>
                    {isEditing && (
                      <FormDescription>
                        Subdomain cannot be changed for existing schools
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="contact@school.edu"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="+1 (555) 123-4567"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Textarea
                          placeholder="123 Education St, Learning City, LC 12345"
                          className="pl-10 min-h-[80px]"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="https://www.school.edu"
                          className="pl-10"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Subscription Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Subscription Settings</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subscriptionStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subscriptionExpiresAt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subscription Expires</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="maxStudents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Students</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="500"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxTeachers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Teachers</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="50"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Customization */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Customization</h3>

              <FormField
                control={form.control}
                name="themeColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Theme Color</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-3">
                        <Input type="color" className="w-16 h-10" {...field} />
                        <Input placeholder="#3b82f6" {...field} />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Primary color for the school's interface
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of the school..."
                        className="min-h-[80px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Available Features</h3>

              <FormField
                control={form.control}
                name="features"
                render={() => (
                  <FormItem>
                    <div className="grid grid-cols-2 gap-3">
                      {availableFeatures.map((feature) => (
                        <FormField
                          key={feature.id}
                          control={form.control}
                          name="features"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={feature.id}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(feature.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            feature.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== feature.id,
                                            ),
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="text-sm font-normal">
                                  {feature.label}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? "Saving..."
                  : isEditing
                    ? "Update School"
                    : "Create School"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
