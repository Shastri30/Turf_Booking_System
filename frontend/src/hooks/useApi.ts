import { useQuery, useMutation, useQueryClient } from 'react-query';
import { turfsAPI, bookingsAPI, favoritesAPI, reviewsAPI } from '../lib/api';
import { toast } from 'sonner';

// Turfs hooks
export const useTurfs = (params?: any) => {
  return useQuery(['turfs', params], () => turfsAPI.getAll(params), {
    select: (data) => data.data.turfs,
  });
};

export const useTurf = (id: string) => {
  return useQuery(['turf', id], () => turfsAPI.getById(id), {
    select: (data) => data.data,
    enabled: !!id,
  });
};

export const useAvailableSlots = (turfId: string, date: string) => {
  return useQuery(
    ['availableSlots', turfId, date],
    () => turfsAPI.getAvailableSlots(turfId, date),
    {
      select: (data) => data.data.availableSlots,
      enabled: !!turfId && !!date,
    }
  );
};

// Bookings hooks
export const useMyBookings = () => {
  return useQuery('myBookings', bookingsAPI.getMyBookings, {
    select: (data) => data.data,
  });
};

export const useOwnerBookings = () => {
  return useQuery('ownerBookings', bookingsAPI.getOwnerBookings, {
    select: (data) => data.data,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation(bookingsAPI.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('myBookings');
      queryClient.invalidateQueries('availableSlots');
      toast.success('Booking created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation(bookingsAPI.cancel, {
    onSuccess: () => {
      queryClient.invalidateQueries('myBookings');
      queryClient.invalidateQueries('ownerBookings');
      toast.success('Booking cancelled successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });
};

// Favorites hooks
export const useFavorites = () => {
  return useQuery('favorites', favoritesAPI.getAll, {
    select: (data) => data.data,
  });
};

export const useAddToFavorites = () => {
  const queryClient = useQueryClient();
  
  return useMutation(favoritesAPI.add, {
    onSuccess: () => {
      queryClient.invalidateQueries('favorites');
      toast.success('Added to favorites!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to favorites');
    },
  });
};

export const useRemoveFromFavorites = () => {
  const queryClient = useQueryClient();
  
  return useMutation(favoritesAPI.remove, {
    onSuccess: () => {
      queryClient.invalidateQueries('favorites');
      toast.success('Removed from favorites!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to remove from favorites');
    },
  });
};

// Reviews hooks
export const useTurfReviews = (turfId: string) => {
  return useQuery(['turfReviews', turfId], () => reviewsAPI.getByTurf(turfId), {
    select: (data) => data.data.reviews,
    enabled: !!turfId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation(reviewsAPI.create, {
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['turfReviews', variables.turfId]);
      queryClient.invalidateQueries(['turf', variables.turfId]);
      toast.success('Review submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to submit review');
    },
  });
};
