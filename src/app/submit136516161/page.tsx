"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ChevronLeft } from "lucide-react";
import { categories } from "@/data/appCatalog";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SubmitPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const handleCategoryChange = (value: string) => {
    if (selectedCategories.includes(value)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== value));
    } else if (selectedCategories.length < 3) {
      setSelectedCategories([...selectedCategories, value]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // This would typically send the data to your backend
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Store
          </Link>
          <h1 className="text-3xl font-bold mb-2">Submit Your App</h1>
          <p className="text-gray-600">
            Fill out the form below to submit your app to the Mini Store.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Basic Information */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="appName">App Name *</Label>
                  <Input id="appName" required placeholder="Enter your app's name" />
                </div>
                <div>
                  <Label htmlFor="developer">Developer/Organization Name *</Label>
                  <Input id="developer" required placeholder="Enter developer or organization name" />
                </div>
                <div>
                  <Label htmlFor="universalProfile">Universal Profile Address *</Label>
                  <Input id="universalProfile" required placeholder="0x..." pattern="^0x[a-fA-F0-9]{40}$" />
                  <p className="text-sm text-gray-500 mt-1">
                    Your LUKSO Universal Profile address (must start with 0x)
                  </p>
                </div>
              </div>
            </div>

            {/* App Details */}
            <div>
              <h2 className="text-xl font-semibold mb-4">App Details</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="appAbout">App Description *</Label>
                  <Textarea 
                    id="appAbout" 
                    required 
                    placeholder="Describe your app in detail..."
                    className="h-32"
                  />
                </div>
                <div>
                  <Label htmlFor="appLink">App URL *</Label>
                  <Input 
                    id="appLink" 
                    type="url" 
                    required 
                    placeholder="https://your-app-url.com"
                  />
                </div>
                <div>
                  <Label>Categories *</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {Object.values(categories).map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => handleCategoryChange(category.id)}
                        className={`p-2 text-sm rounded-md border ${
                          selectedCategories.includes(category.id)
                            ? 'bg-blue-50 border-blue-200 text-blue-700'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {category.displayName}
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Select up to 3 categories
                  </p>
                </div>
                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <Input 
                    id="tags" 
                    placeholder="Enter tags separated by commas"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Images</h2>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="appIcon">App Icon *</Label>
                  <Input 
                    id="appIcon" 
                    type="file" 
                    required 
                    accept="image/*"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended size: 512x512px, PNG or WebP format
                  </p>
                </div>
                <div>
                  <Label htmlFor="banner">Banner Image *</Label>
                  <Input 
                    id="banner" 
                    type="file" 
                    required 
                    accept="image/*"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Recommended size: 1200x630px, PNG or WebP format
                  </p>
                </div>
                <div>
                  <Label htmlFor="screenshots">Screenshots *</Label>
                  <Input 
                    id="screenshots" 
                    type="file" 
                    required 
                    accept="image/*"
                    multiple
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Upload at least 2 screenshots. Recommended size: 1290x2796px (mobile) or 2560x1440px (desktop)
                  </p>
                </div>
              </div>
            </div>

            {/* App Size */}
            <div>
              <h2 className="text-xl font-semibold mb-4">App Size</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="width">Width *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select width" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 (Standard)</SelectItem>
                      <SelectItem value="2">2 (Wide)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="height">Height *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select height" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 (Standard)</SelectItem>
                      <SelectItem value="2">2 (Tall)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                These values determine how your app will be displayed in the store grid
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Button type="submit" className="w-full bg-[#0066FF] hover:bg-blue-700">
              Submit App
            </Button>
            <p className="text-sm text-gray-500 text-center mt-4">
              By submitting, you agree to our terms and conditions for app submissions.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
} 