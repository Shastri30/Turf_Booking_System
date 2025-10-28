
import React, { useState } from 'react';
import { useTurfs, useFavorites, useAddToFavorites, useRemoveFromFavorites } from '../hooks/useApi';
import { toast } from 'sonner';

interface TurfListProps {
  onBookTurf: (turfId: string) => void;
}

export default function TurfList({ onBookTurf }: TurfListProps) {
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const { data: turfs, isLoading } = useTurfs(filters);
  const { data: favorites } = useFavorites();
  const addToFavorites = useAddToFavorites();
  const removeFromFavorites = useRemoveFromFavorites();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const categories = [
    { id: "all", name: "All Sports", icon: "🏟️" },
    { id: "football", name: "Football", icon: "⚽" },
    { id: "cricket", name: "Cricket", icon: "🏏" },
    { id: "hockey", name: "Hockey", icon: "🏒" },
    { id: "badminton", name: "Badminton", icon: "🏸" },
    { id: "basketball", name: "Basketball", icon: "🏀" },
    { id: "multipurpose", name: "Multipurpose", icon: "🏟️" }
  ];

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const shareturf = (turf: any) => {
    const shareData = {
      title: `${turf.name} - GoTurf.com`,
      text: `Check out ${turf.name} at ${turf.location}. ₹${turf.pricePerHour}/hour`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(shareText);
      toast.success("Turf details copied to clipboard!");
    }
  };

  const handleFavoriteToggle = async (turfId: string, isFavorite: boolean) => {
    try {
      if (isFavorite) {
        await removeFromFavorites.mutateAsync(turfId);
      } else {
        await addToFavorites.mutateAsync(turfId);
      }
    } catch (error) {
      // Error handling is done in the hooks
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse Turfs</h2>
        <p className="text-gray-600">Find and book the perfect turf for your game in Mumbai</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by turf name or location..."
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="createdAt">Sort by Date</option>
              <option value="pricePerHour">Sort by Price</option>
              <option value="averageRating">Sort by Rating</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleFilterChange('category', category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filters.category === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button