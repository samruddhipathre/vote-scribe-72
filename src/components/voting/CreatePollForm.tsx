import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Calendar, Users } from "lucide-react";
import { CreatePollData } from "@/types/voting";
import { toast } from "@/hooks/use-toast";

const createPollSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z.string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters")
    .trim(),
  options: z.array(z.object({
    text: z.string()
      .min(1, "Option cannot be empty")
      .max(100, "Option must be less than 100 characters")
      .trim()
  })).min(2, "At least 2 options are required")
    .max(10, "Maximum 10 options allowed"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  max_votes_per_user: z.number().min(1, "Must allow at least 1 vote").max(5, "Maximum 5 votes per user"),
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  const now = new Date();
  
  return startDate >= now;
}, {
  message: "Start date must be in the future",
  path: ["start_date"],
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  
  return endDate > startDate;
}, {
  message: "End date must be after start date",
  path: ["end_date"],
});

type CreatePollFormData = z.infer<typeof createPollSchema>;

interface CreatePollFormProps {
  onSubmit: (data: CreatePollData) => Promise<void>;
  isLoading?: boolean;
}

const CreatePollForm = ({ onSubmit, isLoading = false }: CreatePollFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePollFormData>({
    resolver: zodResolver(createPollSchema),
    defaultValues: {
      title: "",
      description: "",
      options: [{ text: "" }, { text: "" }],
      start_date: new Date().toISOString().slice(0, 16),
      end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
      max_votes_per_user: 1,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const handleSubmit = async (data: CreatePollFormData) => {
    try {
      setIsSubmitting(true);
      
      const submitData: CreatePollData = {
        title: data.title,
        description: data.description,
        options: data.options.map(opt => opt.text),
        start_date: data.start_date,
        end_date: data.end_date,
        max_votes_per_user: data.max_votes_per_user,
      };

      await onSubmit(submitData);
      
      toast({
        title: "Poll Created Successfully",
        description: "Your poll is now live and ready for votes!",
      });

      form.reset();
    } catch (error) {
      toast({
        title: "Error Creating Poll",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addOption = () => {
    if (fields.length < 10) {
      append({ text: "" });
    }
  };

  const removeOption = (index: number) => {
    if (fields.length > 2) {
      remove(index);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="vote-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="gradient-primary p-2 rounded-lg">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <span>Create New Poll</span>
          </CardTitle>
          <CardDescription>
            Set up your poll with questions, options, and voting rules. All fields are required.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Poll Information</span>
                </h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Poll Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your poll question or title..."
                          {...field}
                          maxLength={100}
                        />
                      </FormControl>
                      <FormDescription>
                        A clear, engaging title that describes your poll
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
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide more details about your poll..."
                          className="resize-none"
                          rows={4}
                          {...field}
                          maxLength={500}
                        />
                      </FormControl>
                      <FormDescription>
                        Additional context or instructions for voters
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Poll Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Poll Options</span>
                  </h3>
                  <Badge variant="secondary">
                    {fields.length} of 10 options
                  </Badge>
                </div>

                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`options.${index}.text`}
                      render={({ field: optionField }) => (
                        <FormItem>
                          <FormLabel className="sr-only">
                            Option {index + 1}
                          </FormLabel>
                          <div className="flex space-x-2">
                            <FormControl>
                              <Input
                                placeholder={`Option ${index + 1}...`}
                                {...optionField}
                                maxLength={100}
                              />
                            </FormControl>
                            {fields.length > 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => removeOption(index)}
                                className="shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>

                {fields.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                )}
              </div>

              {/* Poll Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Poll Settings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date & Time *</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date & Time *</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="max_votes_per_user"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Maximum Votes Per User *</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={5}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        How many options can each user vote for? (1-5)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isSubmitting || isLoading}
                >
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="gradient-primary text-white min-w-[120px]"
                >
                  {isSubmitting ? "Creating..." : "Create Poll"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePollForm;