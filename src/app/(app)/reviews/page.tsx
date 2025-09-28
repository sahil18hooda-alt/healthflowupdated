'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { mockReviews } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { format } from 'date-fns';

const reviewFormSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters long.'),
});

function AddReviewForm() {
  const [rating, setRating] = useState(0);

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: { rating: 0, comment: '' },
  });

  function onSubmit(values: z.infer<typeof reviewFormSchema>) {
    console.log(values);
    alert('Thank you for your review!');
    form.reset();
    setRating(0);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Your Experience</CardTitle>
        <CardDescription>Let us know how we did. Your feedback helps us improve.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            'h-8 w-8 cursor-pointer transition-colors',
                            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'
                          )}
                          onClick={() => {
                            setRating(star);
                            field.onChange(star);
                          }}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us more about your experience..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Review</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


export default function ReviewsPage() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Hospital Reviews</h1>
                <p className="text-muted-foreground">See what our patients are saying about us.</p>
            </div>
            <div className="space-y-4">
            {mockReviews.map((review) => (
                <Card key={review.id}>
                    <CardHeader className="flex flex-row items-start gap-4">
                        <Avatar>
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-base">{review.patientName}</CardTitle>
                            <CardDescription>{format(new Date(review.date), 'PPP')}</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm">{review.comment}</p>
                    </CardContent>
                    <CardFooter>
                        <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                key={i}
                                className={cn('h-5 w-5', i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground')}
                                />
                            ))}
                        </div>
                    </CardFooter>
                </Card>
            ))}
            </div>
        </div>
        <div className="lg:col-span-1">
            <AddReviewForm />
        </div>
    </div>
  );
}
