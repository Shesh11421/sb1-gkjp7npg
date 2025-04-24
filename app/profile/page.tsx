"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { User } from "@/types"; // ✅ Import your User interface

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null); // ✅ Define type
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");

    if (currentUser) {
      const userData: User = JSON.parse(currentUser);
      if (userData.role === "customer") {
        setUser(userData);
      } else {
        router.push("/owner/dashboard");
      }
    } else {
      router.push("/login");
    }

    setLoading(false);
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
      <Header />
      <main className="flex-1 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6 sm:p-10">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden">
                    <Image
                      src={
                        user.image ||
                        "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg"
                      }
                      alt={user.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">{user.name}</h1>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200">
                <div className="p-6 sm:p-10">
                  <h2 className="text-xl font-semibold mb-4">Saved Food Trucks</h2>
                  {user.savedTrucks && user.savedTrucks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {user.savedTrucks.map((truckId: string) => (
                        <div key={truckId} className="p-4 border rounded-lg">
                          Food Truck #{truckId}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">You haven't saved any food trucks yet.</p>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200">
                <div className="p-6 sm:p-10">
                  <h2 className="text-xl font-semibold mb-4">Your Reviews</h2>
                  {user.reviews && user.reviews.length > 0 ? (
                    <div className="space-y-4">
                      {user.reviews.map((reviewId: string) => (
                        <div key={reviewId} className="p-4 border rounded-lg">
                          Review #{reviewId}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">You haven't written any reviews yet.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
