"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Heart, MapPin, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FoodTruck, User } from "@/types";

// Mock data (replace with API call in real app)
const mockFoodTrucks: FoodTruck[] = [
  {
    id: "1",
    name: "Aussie Grill",
    image: "/api/placeholder/400/300",
    cuisine: ["Australian BBQ"],
    rating: 4.8,
    description: "Authentic Australian BBQ with a modern twist, featuring locally sourced meats and fresh ingredients.",
    menu: [],
    location: {
      address: "Circular Quay, Sydney",
      coordinates: {
        lat: -33.861,
        lng: 151.210,
      },
    },
    openingHours: [
      { day: "Monday", hours: "11:00 AM - 8:00 PM" },
      { day: "Tuesday", hours: "11:00 AM - 8:00 PM" },
    ],
    reviews: [],
    owner: "owner-1",
    contact: {
      phone: "123-456-7890",
      email: "aussie@grill.com",
    },
  },
  {
    id: "2",
    name: "Taco Fiesta",
    image: "/api/placeholder/400/300",
    cuisine: ["Mexican"],
    rating: 4.5,
    description: "Authentic Mexican street food with handmade tortillas and traditional recipes passed down through generations.",
    menu: [],
    location: {
      address: "Darling Harbour, Sydney",
      coordinates: {
        lat: -33.872,
        lng: 151.198,
      },
    },
    openingHours: [
      { day: "Monday", hours: "12:00 PM - 9:00 PM" },
      { day: "Tuesday", hours: "12:00 PM - 9:00 PM" },
    ],
    reviews: [],
    owner: "owner-2",
    contact: {
      phone: "123-555-7890",
      email: "taco@fiesta.com",
    },
  },
  {
    id: "3",
    name: "Pizza on Wheels",
    image: "/api/placeholder/400/300",
    cuisine: ["Italian"],
    rating: 4.7,
    description: "Wood-fired pizzas made with imported Italian ingredients and cooked to perfection in our mobile oven.",
    menu: [],
    location: {
      address: "Federation Square, Melbourne",
      coordinates: {
        lat: -37.817,
        lng: 144.967,
      },
    },
    openingHours: [
      { day: "Monday", hours: "11:30 AM - 8:30 PM" },
      { day: "Tuesday", hours: "11:30 AM - 8:30 PM" },
    ],
    reviews: [],
    owner: "owner-3",
    contact: {
      phone: "321-456-7890",
      email: "pizza@wheels.com",
    },
  }
];


export default function FavoritesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favoriteTrucks, setFavoriteTrucks] = useState<FoodTruck[]>([]);

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser');

    if (currentUser) {
      const userData: User = JSON.parse(currentUser);
      setUser(userData);

      if (userData.savedTrucks?.length > 0) {
        const userFavorites = mockFoodTrucks.filter(truck =>
          userData.savedTrucks.includes(truck.id)
        );
        setFavoriteTrucks(userFavorites);
      }
    } else {
      router.push('/login');
    }

    setLoading(false);
  }, [router]);

  const removeFavorite = (truckId: string) => {
    setFavoriteTrucks(prev => prev.filter(truck => truck.id !== truckId));

    if (user) {
      const updatedUser: User = {
        ...user,
        savedTrucks: user.savedTrucks.filter(id => id !== truckId)
      };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Your Favorite Food Trucks</h1>

          {favoriteTrucks.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favoriteTrucks.map(truck => (
                <div key={truck.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={truck.image}
                      alt={truck.name}
                      fill
                      className="object-cover"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white rounded-full"
                      onClick={() => removeFavorite(truck.id)}
                    >
                      <Heart className="h-5 w-5 text-[#C55D5D] fill-[#C55D5D]" />
                    </Button>
                  </div>

                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-bold">{truck.name}</h2>
                      <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{truck.rating}</span>
                      </div>
                    </div>

                    <p className="text-sm text-[#C55D5D] font-medium mb-3">{truck.cuisine}</p>

                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>{truck.location.address}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>{truck.openingHours[0]?.hours}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {truck.description}
                    </p>

                    <Link href={`/food-truck/${truck.id}`}>
                      <Button className="w-full bg-[#C55D5D] hover:bg-[#b34d4d] text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="mb-4">
                <Heart className="h-16 w-16 mx-auto text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't added any food trucks to your favorites list.
              </p>
              <Link href="/search">
                <Button className="bg-[#C55D5D] hover:bg-[#b34d4d] text-white">
                  Discover Food Trucks
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
