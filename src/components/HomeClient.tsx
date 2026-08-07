'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import RazorpayScript from '@/components/RazorpayScript';
import CheckoutModal from '@/components/CheckoutModal';
import AuthModal from '@/components/AuthModal';

import Header from '@/components/landing/01_Header';
import HeroSection from '@/components/landing/02_HeroSection';
import TrustBar from '@/components/landing/03_TrustBar';
import ProblemSolution from '@/components/landing/04_ProblemSolution';
import HealthBenefits from '@/components/landing/05_HealthBenefits';
import NutritionFacts from '@/components/landing/06_NutritionFacts';
import FlavorsShowcase from '@/components/landing/07_FlavorsShowcase';
import SourcingStory from '@/components/landing/08_SourcingStory';
import ComparisonTable from '@/components/landing/09_ComparisonTable';
import HowItIsMade from '@/components/landing/10_HowItIsMade';
import RecipeIdeas from '@/components/landing/11_RecipeIdeas';
import CustomerReviews from '@/components/landing/12_CustomerReviews';
import ExpertEndorsement from '@/components/landing/13_ExpertEndorsement';
import Certifications from '@/components/landing/14_Certifications';
import ValueBundle from '@/components/landing/15_ValueBundle';
import FAQSection from '@/components/landing/16_FAQSection';
import Guarantees from '@/components/landing/17_Guarantees';
import StickyCTA from '@/components/landing/18_StickyCTA';
import Newsletter from '@/components/landing/19_Newsletter';
import Footer from '@/components/landing/20_Footer';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface HomeClientProps {
  initialProduct: {
    id: string;
    name: string;
    price: number;
    stock: number;
  };
}

export default function HomeClient({ initialProduct }: HomeClientProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModal, setAuthModal] = useState<{
    isOpen: boolean;
    mode: 'login' | 'register';
  }>({
    isOpen: false,
    mode: 'login',
  });

  // Fetch current user session directly from PostgreSQL database on component mount
  useEffect(() => {
    async function fetchUserSession() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (err) {
        setUser(null);
      }
    }
    fetchUserSession();
  }, []);

  // Logout handler calling backend cookie clearance and triggering toast popup
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      toast.success('Logged out successfully 👋');
    } catch (err) {
      toast.error('Failed to log out');
    }
  };
const handleBuyNow = () => {
  window.location.href = '/checkout';
};
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <RazorpayScript />

      {/* Header receiving user session from PostgreSQL */}
      <Header
        user={user}
        onOpenAuth={(mode) => setAuthModal({ isOpen: true, mode })}
        onLogout={handleLogout}
      />

      {/* Modular Landing Page Sections */}
      <HeroSection onBuyNow={handleBuyNow} />
      <TrustBar />
      <ProblemSolution />
      <HealthBenefits />
      <NutritionFacts />
      {/* <FlavorsShowcase /> */}
      <SourcingStory />
      <ComparisonTable />
      <HowItIsMade />
      <RecipeIdeas />
      <CustomerReviews />
      <ExpertEndorsement />
      <Certifications />
      <ValueBundle onBuyNow={handleBuyNow} />
      <FAQSection />
      <Guarantees />
      <Newsletter />
      <Footer />

      {/* Floating CTA Button */}
      <StickyCTA onBuyNow={handleBuyNow} />

      {/* Auth Modal for Login / Registration */}
      <AuthModal
        isOpen={authModal.isOpen}
        initialMode={authModal.mode}
        onClose={() => setAuthModal({ ...authModal, isOpen: false })}
        onAuthSuccess={(loggedInUser) => setUser(loggedInUser)}
      />

      {/* Checkout Modal for Razorpay Payments */}
      <CheckoutModal
  productId={initialProduct.id}
  price={initialProduct.price}
  isOpen={isCheckoutOpen}
  onClose={() => setIsCheckoutOpen(false)}
  user={user} // Pass active user profile state
/>
    </main>
  );
}