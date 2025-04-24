"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { users } from "@/data/users";
import { User } from "@/types"; // Make sure path is correct

interface AuthFormProps {
  type: "login" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const isLogin = type === "login";
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: "customer" | "owner";
    truckName: string;
    cuisine: string;
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "customer",
    truckName: "",
    cuisine: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const user = users.find(user => user.email === formData.email);

      if (!user || user.password !== formData.password) {
        return setError("Invalid email or password");
      }

      localStorage.setItem("currentUser", JSON.stringify(user));

      if (user.role === "owner") {
        router.push("/owner/dashboard");
      } else {
        router.push("/");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        return setError("Passwords do not match");
      }

      if (users.some(user => user.email === formData.email)) {
        return setError("Email already exists");
      }

      const newUser: User = {
        id: `u${users.length + 1}`,
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: "https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg",
        savedTrucks: [],
        reviews: [],
        role: formData.role,
        ...(formData.role === "owner" && {
          truckName: formData.truckName,
          cuisine: formData.cuisine
        })
      };

      users.push(newUser);
      console.log("Account created successfully", newUser);
      router.push("/login");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {!isLogin && (
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      {!isLogin && (
        <>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              name="role"
              value={formData.role}
              onValueChange={(value) => handleSelectChange("role", value as "customer" | "owner")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="owner">Food Truck Owner</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.role === "owner" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="truckName">Food Truck Name</Label>
                <Input
                  id="truckName"
                  name="truckName"
                  type="text"
                  required
                  value={formData.truckName}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cuisine">Cuisine Type</Label>
                <Select
                  name="cuisine"
                  value={formData.cuisine}
                  onValueChange={(value) => handleSelectChange("cuisine", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cuisine type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="mexican">Mexican</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="american">American</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </>
      )}

      <Button type="submit" className="w-full bg-[#C55D5D] hover:bg-[#b34d4d] text-white">
        {isLogin ? "Log In" : "Create Account"}
      </Button>

      <div className="text-center text-sm">
        {isLogin ? (
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#C55D5D] hover:underline">
              Sign Up
            </Link>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-[#C55D5D] hover:underline">
              Log In
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
