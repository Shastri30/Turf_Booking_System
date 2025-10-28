import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { toast } from "sonner";
import { Id } from "../../convex/_generated/dataModel";

interface TurfListProps {
  onBookTurf: (turfId: string) => void;
}

export default function TurfList({ onBookTurf }: TurfListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [showPriceFilter, setShowPriceFilter] = useState(false);

  const turfs = useQuery(api.turfs.getAll);
  const favorites = useQuery(api.favorites.getFavorites);

  if (turfs === undefined) {
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

  // Filter and sort turfs
  let filteredTurfs = turfs.filter(turf => turf.isActive);

  // Filter by category
  if (selectedCategory !== "all") {
    filteredTurfs = filteredTurfs.filter(turf => turf.category === selectedCategory);
  }

  // Filter by search term
  if (searchTerm) {
    filteredTurfs = filteredTurfs.filter(turf => 
      turf.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turf.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  // Filter by price range
  filteredTurfs = filteredTurfs.filter(turf => 
    turf.pricePerHour >= priceRange[0] && turf.pricePerHour <= priceRange[1]
  );

  // Sort turfs
  switch (sortBy) {
    case "price-low":
      filteredTurfs.sort((a, b) => a.pricePerHour - b.pricePerHour);
      break;
    case "price-high":
      filteredTurfs.sort((a, b) => b.pricePerHour - a.pricePerHour);
      break;
    case "rating":
      filteredTurfs.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      break;
    case "top-rated":
      filteredTurfs.sort((a, b) => {
        if (a.isTopRated && !b.isTopRated) return -1;
        if (!a.isTopRated && b.isTopRated) return 1;
        return (b.averageRating || 0) - (a.averageRating || 0);
      });
      break;
    case "most-popular":
      filteredTurfs.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
      break;
    case "location":
      filteredTurfs.sort((a, b) => a.location.localeCompare(b.location));
      break;
    default:
      // Relevance - keep original order
      break;
  }

  const shareturf = (turf: any) => {
    const shareData = {
      title: `${turf.name} - GoTurf.com`,
      text: `Check out ${turf.name} at ${turf.location}. ₹${turf.pricePerHour}/hour`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(shareText);
      toast.success("Turf details copied to clipboard!");
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="relevance">Sort by Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="top-rated">Top Rated</option>
              <option value="most-popular">Most Popular</option>
              <option value="location">Sort by Location</option>
            </select>
            <button
              onClick={() => setShowPriceFilter(!showPriceFilter)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Price Filter
            </button>
          </div>
        </div>

        {/* Price Range Filter */}
        {showPriceFilter && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-3">Price Range (₹/hour)</h4>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="2000"
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
              <span className="text-gray-400">-</span>
              <input
                type="range"
                min="0"
                max="2000"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="flex-1"
              />
              <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          {filteredTurfs.length} turf{filteredTurfs.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Turfs Grid */}
      {filteredTurfs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <div className="text-gray-400 text-6xl mb-4">🏟️</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No turfs found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTurfs.map((turf) => (
            <TurfCard 
              key={turf._id} 
              turf={turf} 
              onBook={() => onBookTurf(turf._id)}
              onShare={() => shareturf(turf)}
              isFavorite={favorites?.some(fav => fav?._id === turf._id) || false}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TurfCard({ turf, onBook, onShare, isFavorite }: { 
  turf: any; 
  onBook: () => void; 
  onShare: () => void;
  isFavorite: boolean;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const addToFavorites = useMutation(api.favorites.addToFavorites);
  const removeFromFavorites = useMutation(api.favorites.removeFromFavorites);

  const getCategoryIcon = (category: string) => {
    const icons = {
      football: "⚽",
      cricket: "🏏",
      hockey: "🏒",
      badminton: "🏸",
      basketball: "🏀",
      multipurpose: "🏟️"
    };
    return icons[category as keyof typeof icons] || "🏟️";
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      football: "bg-green-100 text-green-800",
      cricket: "bg-blue-100 text-blue-800",
      hockey: "bg-red-100 text-red-800",
      badminton: "bg-yellow-100 text-yellow-800",
      basketball: "bg-orange-100 text-orange-800",
      multipurpose: "bg-purple-100 text-purple-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
          ★
        </span>
      );
    }
    return stars;
  };

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await removeFromFavorites({ turfId: turf._id as Id<"turfs"> });
        toast.success("Removed from favorites");
      } else {
        await addToFavorites({ turfId: turf._id as Id<"turfs"> });
        toast.success("Added to favorites");
      }
    } catch (error) {
      toast.error("Failed to update favorites");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {turf.isTopRated && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
          TOP RATED
        </div>
      )}
      
      <button
        onClick={handleFavoriteToggle}
        className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow"
      >
        <svg 
          className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </button>

      {turf.imageUrl && (
        <img
          src={turf.imageUrl}
          alt={turf.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold text-gray-900">{turf.name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getCategoryColor(turf.category)}`}>
            {getCategoryIcon(turf.category)}
            {turf.category}
          </span>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-3"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>

        {showDetails && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg text-sm">
            <p className="text-gray-700 mb-2">{turf.description}</p>
            {turf.rules && turf.rules.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Rules:</h5>
                <ul className="text-gray-600 text-xs space-y-1">
                  {turf.rules.map((rule: string, index: number) => (
                    <li key={index}>• {rule}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-2">
              <span className="text-gray-600">Capacity: </span>
              <span className="font-medium">{turf.minPlayers || 1}-{turf.maxPlayers} players</span>
            </div>
          </div>
        )}
        
        <div className="flex items-center text-gray-600 text-sm mb-3">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {turf.location}
        </div>

        <div className="flex items-center mb-3">
          {turf.averageRating ? (
            <>
              <div className="flex mr-2">
                {renderStars(Math.round(turf.averageRating))}
              </div>
              <span className="text-sm text-gray-600">
                {turf.averageRating.toFixed(1)} ({turf.totalReviews || 0} reviews)
              </span>
            </>
          ) : (
            <span className="text-sm text-gray-500">No reviews yet</span>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {turf.amenities.slice(0, 3).map((amenity: string, index: number) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {amenity}
            </span>
          ))}
          {turf.amenities.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              +{turf.amenities.length - 3} more
            </span>
          )}
        </div>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-2xl font-bold text-green-600">₹{turf.pricePerHour}</p>
            <p className="text-xs text-gray-500">per hour</p>
            <p className="text-sm text-gray-600">₹{turf.pricePerPerson}/person</p>
          </div>
          <button
            onClick={onShare}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition-colors text-sm"
          >
            Share
          </button>
        </div>

        <button
          onClick={onBook}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
