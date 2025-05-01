import { Button } from "@/components/ui/button";
import { Squirrel, ArrowRight, Globe, Shield, Zap, Sparkles, Rocket } from "lucide-react";
import Image from "next/image";
import bg from "../../public/bg.webp"
import FeaturedApps from "./FeaturedApps";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Squirrel className="h-8 w-8 text-[#0066FF]" />
            <span className="text-xl font-semibold">Mini Store</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Your Gateway to Universal Profile Apps
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Discover, install, and manage decentralized applications built for the LUKSO ecosystem.
          </p>
          <Link href="https://forms.gle/382ktewic24QmuKS9" target="_blank">
            <Button size="lg" className="bg-[#0066FF] hover:bg-blue-700">
              Submit Your App <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <Globe className="h-12 w-12 text-[#0066FF] mb-6" />
              <h3 className="text-xl font-semibold mb-4">Universal Access</h3>
              <p className="text-gray-600">
                Access your favorite apps seamlessly across any Universal Profile enabled platform.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <Shield className="h-12 w-12 text-[#0066FF] mb-6" />
              <h3 className="text-xl font-semibold mb-4">Secure by Design</h3>
              <p className="text-gray-600">
                Built with security-first principles and blockchain technology.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <Zap className="h-12 w-12 text-[#0066FF] mb-6" />
              <h3 className="text-xl font-semibold mb-4">Lightning Fast</h3>
              <p className="text-gray-600">
                Experience instant app launches and seamless interactions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Apps Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Featured Apps
          </h2>
          <FeaturedApps />
        </div>
      </section>

      {/* Submit App CTA */}
      <section className="relative py-20 overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={bg}
            alt="Background pattern"
            fill
            className="object-cover"
            quality={90}
            priority
          />
          <div className="absolute inset-0 bg-[#0066FF]/60 mix-blend-multiply" />
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 text-center text-white">
          <Rocket className="h-16 w-16 mx-auto mb-8 text-white" />
          <h2 className="text-3xl font-bold mb-6">
            Ready to Launch Your App?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join the growing ecosystem of innovative apps on the LUKSO network. Submit your app today and reach thousands of Universal Profile users.
          </p>
          <Link href="https://forms.gle/382ktewic24QmuKS9" target="_blank">
            <Button size="lg" className="bg-white text-[#0066FF] hover:bg-white/90">
              Submit Your App <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-8">
            <Squirrel className="h-6 w-6 text-[#0066FF]" />
            <span className="text-lg font-semibold">Mini Store</span>
          </div>
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Mini Store. Built for the LUKSO ecosystem.
          </p>
        </div>
      </footer>
    </div>
  );
} 