import { useQuery } from "@tanstack/react-query";
import { Event } from "@shared/schema";
import { Link, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarIcon, MapPinIcon, ArrowLeftIcon } from "lucide-react";
import { format } from "date-fns";
import { Separator } from "@/components/ui/separator";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useQuery<Event>({
    queryKey: [`/api/events/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8 animate-pulse">
        <div className="h-8 bg-muted rounded w-1/4 mb-8" />
        <div className="grid gap-8 md:grid-cols-2">
          <div className="h-96 bg-muted rounded" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-2/3" />
            <div className="h-32 bg-muted rounded" />
          </div>
        </div>
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" asChild className="mb-8">
          <Link href="/">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
        </Button>

        <div className="grid gap-8 md:grid-cols-2">
          <div 
            className="h-96 bg-cover bg-center rounded-lg"
            style={{ backgroundImage: `url(${event.imageUrl})` }}
          />

          <div>
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="space-y-2 text-muted-foreground mb-6">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                {format(new Date(event.date), 'PPP')}
              </div>
              <div className="flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2" />
                {event.venue}
              </div>
            </div>

            <p className="mb-8">{event.description}</p>

            <Card>
              <CardHeader>
                <CardTitle>Ticket Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Membership</span>
                    <span>KES {event.ticketTypes.membership.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>Regular</span>
                    <span>KES {event.ticketTypes.regular.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>VIP</span>
                    <span>KES {event.ticketTypes.vip.toLocaleString()}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between items-center">
                    <span>VVIP</span>
                    <span>KES {event.ticketTypes.vvip.toLocaleString()}</span>
                  </div>

                  <Button asChild className="w-full mt-4">
                    <Link href={`/book/${event.id}`}>Book Tickets</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
