import { useQuery, useMutation } from "@tanstack/react-query";
import { Event, insertBookingSchema } from "@shared/schema";
import { Link, useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { z } from "zod";

const bookingFormSchema = z.object({
  membership: z.number().min(0),
  regular: z.number().min(0),
  vip: z.number().min(0),
  vvip: z.number().min(0),
}).refine((data) => {
  return Object.values(data).some(value => value > 0);
}, {
  message: "You must select at least one ticket",
});

type BookingFormData = z.infer<typeof bookingFormSchema>;

export default function BookingPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: event, isLoading: isLoadingEvent } = useQuery<Event>({
    queryKey: [`/api/events/${id}`],
  });

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      membership: 0,
      regular: 0,
      vip: 0,
      vvip: 0,
    },
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: BookingFormData) => {
      if (!event) throw new Error("Event not found");
      
      const totalAmount = Object.entries(data).reduce((sum, [type, quantity]) => {
        return sum + (event.ticketTypes[type as keyof typeof event.ticketTypes] * quantity);
      }, 0);

      const booking = {
        eventId: event.id,
        tickets: data,
        totalAmount,
      };

      const res = await apiRequest("POST", "/api/bookings", booking);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bookings"] });
      toast({
        title: "Booking Successful",
        description: "Your tickets have been booked successfully!",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Booking Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4 mb-8" />
        <Card>
          <CardContent className="py-8">
            <div className="space-y-4">
              <div className="h-8 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-32 bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Event not found</h2>
              <Button asChild>
                <Link href="/">
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateTotal = (data: BookingFormData) => {
    return Object.entries(data).reduce((sum, [type, quantity]) => {
      return sum + (event.ticketTypes[type as keyof typeof event.ticketTypes] * quantity);
    }, 0);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link href={`/events/${event.id}`}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Event
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Book Tickets - {event.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit((data) => bookingMutation.mutate(data))}
                className="space-y-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="membership"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Membership (KES {event.ticketTypes.membership.toLocaleString()})</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="regular"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regular (KES {event.ticketTypes.regular.toLocaleString()})</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VIP (KES {event.ticketTypes.vip.toLocaleString()})</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vvip"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>VVIP (KES {event.ticketTypes.vvip.toLocaleString()})</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-lg font-semibold mb-6">
                    <span>Total Amount:</span>
                    <span>KES {calculateTotal(form.getValues()).toLocaleString()}</span>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={bookingMutation.isPending}
                  >
                    {bookingMutation.isPending ? "Processing..." : "Confirm Booking"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
