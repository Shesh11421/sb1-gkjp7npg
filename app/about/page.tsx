// Path: app/about/page.js

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F3F4F6]">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-[#C55D5D] text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold mb-4">About LocalFoodTruck.au</h1>
            <p className="text-xl max-w-2xl">
              Connecting food lovers with amazing local food trucks across Australia since 2023.
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="rounded-lg overflow-hidden h-80 relative">
              <Image
                src="/api/placeholder/600/500"
                alt="Food truck gathering"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                LocalFoodTruck.au was born from a simple idea: make it easier for food lovers to discover amazing food trucks in their area, and help food truck owners reach more customers.
              </p>
              <p className="text-gray-600 mb-4">
                We're passionate about supporting local businesses and bringing communities together through the joy of diverse, delicious street food.
              </p>
              <p className="text-gray-600">
                Our platform helps food enthusiasts find the perfect meal on wheels, while providing food truck owners with the tools they need to grow their business.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Alex Johnson",
                  role: "Founder & CEO",
                  image: "/api/placeholder/300/300",
                  bio: "Former chef turned tech entrepreneur with a passion for street food."
                },
                {
                  name: "Sarah Wong",
                  role: "Head of Operations",
                  image: "/api/placeholder/300/300",
                  bio: "Operations expert with experience managing food festivals across Australia."
                },
                {
                  name: "Michael Peters",
                  role: "Lead Developer",
                  image: "/api/placeholder/300/300",
                  bio: "Tech wizard who built the platform from the ground up with a focus on user experience."
                }
              ].map((member, index) => (
                <div key={index} className="bg-[#F3F4F6] rounded-lg overflow-hidden shadow-md">
                  <div className="h-64 relative">
                    <Image
                      src={member.image}
                      alt={member.name}
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className="text-[#C55D5D] font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600">{member.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Story Section */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <p className="text-gray-600 mb-4">
              LocalFoodTruck.au started in 2023 when our founder, Alex, was struggling to find his favorite food truck that seemed to change location every week. After spending an hour driving around looking for it, he thought there had to be a better way.
            </p>
            <p className="text-gray-600 mb-4">
              Starting with just a few food trucks in Sydney, we've now expanded to cover major cities across Australia, helping thousands of food lovers discover new favorites and enabling food truck owners to build loyal customer bases.
            </p>
            <p className="text-gray-600">
              Today, we're proud to be Australia's largest food truck discovery platform, and we're just getting started. Our vision is to create a thriving ecosystem where food entrepreneurs can succeed and food enthusiasts can always find their perfect meal on wheels.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}