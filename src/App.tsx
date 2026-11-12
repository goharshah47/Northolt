/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  ChevronDown,
  ArrowRight,
  Shield,
  ShieldCheck,
  Check,
  Star,
  Search,
  ExternalLink,
  Calendar,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ChevronRight,
  X,
  Menu,
  Compass,
  FileText,
  Activity,
  Heart,
  Syringe,
  Pill,
  Luggage,
  Award,
  Globe2,
  Sparkles,
  Plane
} from 'lucide-react';

// Curated high-resolution photography assets with warm teal grading
const HERO_IMAGE = '/src/assets/images/hero_traveler_vista_1794416420157.jpg';
const CLINIC_IMAGE = '/src/assets/images/clinic_pharmacist_consult_1794416419879.jpg';
const MAKKAH_IMAGE = '/src/assets/images/makkah_hajj_pilgrimage_1794416421409.jpg';
const AIRPORT_FAMILY_IMAGE = '/src/assets/images/family_airport_departure_1794416422973.jpg';
const ANTIMALARIALS_IMAGE = '/src/assets/images/service_antimalarials_1794418313969.jpg';
const B12_IMAGE = '/src/assets/images/service_b12_injection_1794418313869.jpg';
const SPECIALITY_IMAGE = '/src/assets/images/service_speciality_vaccines_1794418313381.jpg';
const COVID_IMAGE = '/src/assets/images/service_covid_vaccination_1794418314783.jpg';
const ABOUT_PASSPORT_IMAGE = '/src/assets/images/about_traveler_passport_1794420385831.jpg';

// Destination advisory data
interface DestinationInfo {
  name: string;
  flag: string;
  region: string;
  mandatory: string[];
  recommended: string[];
  malariaRisk: boolean;
  notes: string;
}

const DESTINATIONS: Record<string, DestinationInfo> = {
  Thailand: {
    name: 'Thailand',
    flag: '🇹🇭',
    region: 'Southeast Asia',
    mandatory: [],
    recommended: ['Hepatitis A', 'Typhoid', 'Tetanus booster', 'Rabies', 'Japanese Encephalitis'],
    malariaRisk: true,
    notes: 'Antimalarials advised for border and deep forest travel. Ensure food and water safety precautions.',
  },
  Kenya: {
    name: 'Kenya',
    flag: '🇰🇪',
    region: 'East Africa',
    mandatory: ['Yellow Fever (if arriving from risk area)'],
    recommended: ['Yellow Fever', 'Hepatitis A', 'Typhoid', 'Meningitis ACWY', 'Rabies', 'Cholera'],
    malariaRisk: true,
    notes: 'Antimalarial tablets strongly advised for all safari and coastal travel outside Nairobi.',
  },
  India: {
    name: 'India',
    flag: '🇮🇳',
    region: 'South Asia',
    mandatory: [],
    recommended: ['Typhoid', 'Hepatitis A', 'Hepatitis B', 'Rabies', 'Tetanus booster', 'Japanese Encephalitis'],
    malariaRisk: true,
    notes: 'High incidence of water-borne risks and animal contact. Consult on oral or injectable typhoid.',
  },
  Peru: {
    name: 'Peru',
    flag: '🇵🇪',
    region: 'South America',
    mandatory: [],
    recommended: ['Yellow Fever', 'Hepatitis A', 'Typhoid', 'Rabies', 'Tetanus booster'],
    malariaRisk: true,
    notes: 'Yellow fever certification advised for Amazon areas. Travel health consultation covers altitude safety.',
  },
  'Saudi Arabia': {
    name: 'Saudi Arabia',
    flag: '🇸🇦',
    region: 'Middle East',
    mandatory: ['Meningitis ACWY', 'Seasonal Influenza', 'COVID-19 vaccination'],
    recommended: ['Hepatitis A', 'Hepatitis B', 'Typhoid', 'Tetanus booster'],
    malariaRisk: false,
    notes: 'Meningitis ACWY vaccination required for all Hajj and Umrah pilgrims.',
  },
};

// 9 Vaccines & Tablets catalog structured for clean 3-col grid with no empty cells
interface VaccineItem {
  id: string;
  name: string;
  category: 'Travel' | 'Speciality' | 'Meningitis' | 'Hepatitis';
  description: string;
  neededFor: string[];
  isFeatured?: boolean;
  featuredSubtitle?: string;
  iconType: 'shield' | 'bug' | 'cell' | 'paw' | 'meningitis' | 'stamp' | 'mosquito' | 'dna' | 'liver';
}

const VACCINES_DATA: VaccineItem[] = [
  // ROW 1: Typhoid (Featured, 2 cols) + Rabies (Compact, 1 col) -> Fills Row 1 (3 cols)
  {
    id: 'typhoid',
    name: 'Typhoid',
    category: 'Travel',
    description: 'Recommended for travel across South Asia, Africa, and South America where contaminated food and water pose serious infection risks.',
    neededFor: ['India', 'Pakistan', 'Kenya', 'Peru'],
    isFeatured: true,
    featuredSubtitle: 'Essential Travel Protection',
    iconType: 'shield',
  },
  {
    id: 'rabies',
    name: 'Rabies',
    category: 'Travel',
    description: 'Vital pre-exposure protection for travellers visiting rabies-endemic regions or engaging in outdoor trekking.',
    neededFor: ['Thailand', 'India', 'Bali', 'South America'],
    iconType: 'paw',
  },

  // ROW 2: Meningitis ACWY (Featured, 2 cols) + Hepatitis B (Compact, 1 col) -> Fills Row 2 (3 cols)
  {
    id: 'meningitis-acwy',
    name: 'Meningitis ACWY',
    category: 'Meningitis',
    description: 'Meningitis ACWY vaccine for Hajj and Umrah.',
    neededFor: ['Saudi Arabia (Hajj/Umrah)', 'Sub-Saharan Africa'],
    isFeatured: true,
    featuredSubtitle: 'Hajj & Umrah Requirement',
    iconType: 'stamp',
  },
  {
    id: 'hepatitis-b',
    name: 'Hepatitis B',
    category: 'Hepatitis',
    description: 'Crucial long-term immunity against blood-borne transmission for adventure travellers, volunteers, or remote stays.',
    neededFor: ['Worldwide', 'Adventure travel', 'Long stays'],
    iconType: 'liver',
  },

  // ROWS 3 & 4: Remaining 5 compact cards, filling grid cleanly
  {
    id: 'tick-borne',
    name: 'Tick-Borne Encephalitis',
    category: 'Speciality',
    description: 'Essential viral protection for hikers and outdoor travellers visiting forested areas of Central, Northern and Eastern Europe.',
    neededFor: ['Austria', 'Germany', 'Sweden', 'Baltics'],
    iconType: 'bug',
  },
  {
    id: 'shingles',
    name: 'Shingles',
    category: 'Speciality',
    description: 'High-efficacy non-live recombinant vaccine shielding mature adults from painful varicella-zoster reactivation.',
    neededFor: ['Adults 50+', 'At-risk travellers'],
    iconType: 'cell',
  },
  {
    id: 'meningitis-b',
    name: 'Meningitis B',
    category: 'Meningitis',
    description: 'Targeted protection against Neisseria meningitidis group B bacterial infections causing rapid illness.',
    neededFor: ['Students', 'Young travellers', 'High-risk regions'],
    iconType: 'meningitis',
  },
  {
    id: 'japanese-encephalitis',
    name: 'Japanese Encephalitis',
    category: 'Speciality',
    description: 'Essential mosquito-borne viral defence for travellers visiting rural Asia or spending extended time outdoors.',
    neededFor: ['Thailand', 'Vietnam', 'Japan', 'Philippines'],
    iconType: 'mosquito',
  },
  {
    id: 'hpv',
    name: 'HPV',
    category: 'Speciality',
    description: 'Comprehensive 9-valent vaccination shielding against human papillomavirus strains linked to malignancies.',
    neededFor: ['Adolescents & adults', 'Global travel'],
    iconType: 'dna',
  },
];

// Service Postcode Zones
interface ZoneInfo {
  code: string;
  name: string;
  fullName: string;
}

const SERVICE_ZONES: ZoneInfo[] = [
  { code: 'UB5', name: 'Northolt', fullName: 'UB5 Northolt' },
  { code: 'UB4', name: 'Yeading / Hayes', fullName: 'UB4 Yeading/Hayes' },
  { code: 'HA2', name: 'South Harrow / Rayners Lane', fullName: 'HA2 South Harrow/Rayners Lane' },
  { code: 'UB6', name: 'Greenford / Perivale', fullName: 'UB6 Greenford/Perivale' },
  { code: 'HA4', name: 'Ruislip / South Ruislip / Eastcote', fullName: 'HA4 Ruislip/South Ruislip/Eastcote' },
  { code: 'UB10', name: 'Hillingdon / Ickenham', fullName: 'UB10 Hillingdon/Ickenham' },
  { code: 'HA1', name: 'Harrow / Harrow on the Hill', fullName: 'HA1 Harrow/Harrow on the Hill' },
];

export default function App() {
  // Navigation & UI States
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vaccineMegaMenuOpen, setVaccineMegaMenuOpen] = useState(false);
  const [clinicDropdownOpen, setClinicDropdownOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Filter state for Vaccines Section
  const [selectedVaccineFilter, setSelectedVaccineFilter] = useState<string>('All');

  // Interactive Map Zone State
  const [activeZone, setActiveZone] = useState<string>('UB5');

  // FAQ Accordion State (item 0 open by default)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [destinationModalOpen, setDestinationModalOpen] = useState(false);
  const [pricingModalOpen, setPricingModalOpen] = useState(false);

  // Destination Search in Hero
  const [heroSearchInput, setHeroSearchInput] = useState('');
  const [selectedDestinationData, setSelectedDestinationData] = useState<DestinationInfo | null>(null);

  // Booking Form State
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [bookingData, setBookingData] = useState({
    service: 'Travel Clinic Consultation',
    destination: 'Thailand',
    travellers: '1',
    departureDate: '2026-12-05',
    preferredTime: '10:30 AM',
    patientName: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [bookingConfirmed, setBookingConfirmed] = useState(false);

  // Scroll listener for sticky header shrink, progress bar, and floating mobile bar
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = totalScroll / (windowHeight || 1);
      setScrollProgress(scrollPercent);
      setIsScrolled(totalScroll > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filtered vaccines list with smooth re-layout
  const filteredVaccines = useMemo(() => {
    if (selectedVaccineFilter === 'All') return VACCINES_DATA;
    return VACCINES_DATA.filter((v) => v.category === selectedVaccineFilter);
  }, [selectedVaccineFilter]);

  // Compute live opening hours for Northolt Village Pharmacy
  const livePharmacyStatus = useMemo(() => {
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentDecimalTime = hours + minutes / 60;

    if (day === 0) {
      return { isOpen: false, text: 'Closed today (Sunday)' };
    } else if (day === 6) {
      if (currentDecimalTime >= 9 && currentDecimalTime < 14) {
        return { isOpen: true, text: 'Open today until 2:00pm' };
      } else {
        return { isOpen: false, text: 'Closed now' };
      }
    } else {
      if (currentDecimalTime >= 9 && currentDecimalTime < 19) {
        return { isOpen: true, text: 'Open today until 7:00pm' };
      } else if (currentDecimalTime < 9) {
        return { isOpen: false, text: 'Opens today at 9:00am' };
      } else {
        return { isOpen: false, text: 'Closed now' };
      }
    }
  }, []);

  // Handler to open destination checker with selected destination
  const handleCheckDestination = (destName?: string) => {
    const target = destName || heroSearchInput.trim() || 'Thailand';
    const found = Object.values(DESTINATIONS).find(
      (d) => d.name.toLowerCase().includes(target.toLowerCase())
    );
    if (found) {
      setSelectedDestinationData(found);
    } else {
      setSelectedDestinationData({
        name: target,
        flag: '✈️',
        region: 'International Destination',
        mandatory: [],
        recommended: ['Hepatitis A', 'Typhoid', 'Tetanus booster'],
        malariaRisk: false,
        notes: 'Personalised travel consultation recommended to check precise destination advisories.',
      });
    }
    setDestinationModalOpen(true);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    setVaccineMegaMenuOpen(false);
    setClinicDropdownOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0B2A33] selection:bg-[#2EC4B6] selection:text-[#0B2A33] relative overflow-x-hidden font-sans-ui">
      {/* Scroll Progress Bar directly under header */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-[#0F8B8D] via-[#2EC4B6] to-[#0F8B8D] z-50 transition-all duration-150"
        style={{ width: `${Math.min(scrollProgress * 100, 100)}%` }}
      />

      {/* ========================================================================= */}
      {/* 1. UTILITY BAR + HEADER + NAV                                              */}
      {/* ========================================================================= */}

      {/* Slim Top Bar */}
      <div className="bg-[#0B2A33] text-white text-sm border-b border-white/10 hidden md:block">
        <div className="max-w-[1200px] mx-auto px-6 h-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a
              href="https://maps.google.com/?q=Northolt+Village+Pharmacy+32+Church+Rd+Northolt+UB5+5AB"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/90 hover:text-[#2EC4B6] transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-[#2EC4B6] shrink-0" />
              <span>Northolt Village Pharmacy, 32 Church Rd, Northolt, UB5 5AB</span>
            </a>
            <span className="text-white/20">|</span>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#0F8B8D]/30 text-[#2EC4B6] border border-[#2EC4B6]/30">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2EC4B6] mr-1.5 animate-pulse" />
                {livePharmacyStatus.text}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <a href="mailto:pharmacy.faf65@nhs.net" className="text-white/80 hover:text-[#2EC4B6] transition-colors">
              pharmacy.faf65@nhs.net
            </a>
            <span className="text-white/20">·</span>
            <a
              href="#reviews"
              onClick={(e) => { e.preventDefault(); scrollToSection('reviews'); }}
              className="flex items-center gap-1.5 text-white/90 hover:text-[#2EC4B6] transition-colors"
            >
              <Star className="w-3.5 h-3.5 fill-[#2EC4B6] text-[#2EC4B6]" />
              <span className="font-semibold text-white">5.0 on Google</span>
            </a>
          </div>
        </div>
      </div>

      {/* Sticky Glass Header - Max height under 80px, no wrapping */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 max-h-[76px] ${
          isScrolled
            ? 'glass-header py-3 shadow-soft border-b border-[#0B2A33]/8'
            : 'bg-white/95 backdrop-blur-md py-3.5 border-b border-[#0B2A33]/8'
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between gap-4">
          {/* Logo Brand Zone - single line, whitespace-nowrap */}
          <a
            href="#"
            className="flex items-center gap-3 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F8B8D] rounded-xl p-1"
            aria-label="Northolt Travel Clinic - Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2A33] to-[#0F8B8D] flex items-center justify-center text-white shadow-md shadow-[#0F8B8D]/20 shrink-0">
              <svg className="w-5 h-5 text-[#2EC4B6]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
                <path d="M2 12h20" />
                <path d="M12 8v8" stroke="#2EC4B6" strokeWidth="2" />
                <path d="M8 12h8" stroke="#2EC4B6" strokeWidth="2" />
              </svg>
            </div>
            <div className="whitespace-nowrap">
              <span className="font-serif-display font-bold text-lg md:text-xl text-[#0B2A33] leading-none block whitespace-nowrap">
                Northolt Travel Clinic
              </span>
              <span className="text-xs text-[#0F8B8D] font-medium tracking-wide uppercase block mt-0.5 whitespace-nowrap">
                Northolt Village Pharmacy
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden min-[1100px]:flex items-center gap-5 text-sm font-medium text-[#0B2A33]/90 shrink-0" aria-label="Main Navigation">
            <button
              onClick={() => scrollToSection('hero')}
              className="hover:text-[#0F8B8D] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="hover:text-[#0F8B8D] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              About Us
            </button>

            {/* Travel Clinic Dropdown */}
            <div className="relative group">
              <button
                onMouseEnter={() => setClinicDropdownOpen(true)}
                onClick={() => setClinicDropdownOpen(!clinicDropdownOpen)}
                className="flex items-center gap-1 hover:text-[#0F8B8D] transition-colors py-1 cursor-pointer whitespace-nowrap"
              >
                <span>Travel Clinic</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${clinicDropdownOpen ? 'rotate-180 text-[#0F8B8D]' : ''}`} />
              </button>
              {clinicDropdownOpen && (
                <div
                  onMouseLeave={() => setClinicDropdownOpen(false)}
                  className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-floating border border-[#0B2A33]/10 p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <a
                    href="#services"
                    onClick={(e) => { e.preventDefault(); scrollToSection('services'); }}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E6F6F6] text-[#0F8B8D] flex items-center justify-center shrink-0 mt-0.5">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0B2A33]">Travel Health Consultation</div>
                      <div className="text-sm text-[#0B2A33]/70">Destination risk assessment & advice.</div>
                    </div>
                  </a>
                  <a
                    href="#timeline"
                    onClick={(e) => { e.preventDefault(); scrollToSection('timeline'); }}
                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors mt-1"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E6F6F6] text-[#0F8B8D] flex items-center justify-center shrink-0 mt-0.5">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0B2A33]">Vaccination Timeline</div>
                      <div className="text-sm text-[#0B2A33]/70">How early to get travel vaccines.</div>
                    </div>
                  </a>
                  <button
                    onClick={() => { setClinicDropdownOpen(false); setDestinationModalOpen(true); }}
                    className="w-full flex items-start gap-3 p-2.5 rounded-xl hover:bg-[#FAF7F2] transition-colors mt-1 text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#E6F6F6] text-[#0F8B8D] flex items-center justify-center shrink-0 mt-0.5">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#0B2A33]">Destination Checker</div>
                      <div className="text-sm text-[#0B2A33]/70">Look up required and recommended jabs.</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Vaccines Mega-Menu */}
            <div className="relative group">
              <button
                onMouseEnter={() => setVaccineMegaMenuOpen(true)}
                onClick={() => setVaccineMegaMenuOpen(!vaccineMegaMenuOpen)}
                className="flex items-center gap-1 hover:text-[#0F8B8D] transition-colors py-1 cursor-pointer whitespace-nowrap"
              >
                <span>Vaccines</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${vaccineMegaMenuOpen ? 'rotate-180 text-[#0F8B8D]' : ''}`} />
              </button>

              {vaccineMegaMenuOpen && (
                <div
                  onMouseLeave={() => setVaccineMegaMenuOpen(false)}
                  className="absolute top-full -left-28 mt-2 w-[760px] bg-white rounded-2xl shadow-floating border border-[#0B2A33]/10 p-6 z-50 animate-in fade-in zoom-in-95 duration-150"
                >
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#0B2A33]/10">
                        <Luggage className="w-4 h-4 text-[#0F8B8D]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0F8B8D]">Travel Vaccines</span>
                      </div>
                      <div className="space-y-2.5 text-sm">
                        <div onClick={() => { setVaccineMegaMenuOpen(false); scrollToSection('vaccines'); }} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B2A33] hover:text-[#0F8B8D]">Typhoid Vaccine</div>
                        <div onClick={() => { setVaccineMegaMenuOpen(false); scrollToSection('vaccines'); }} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B2A33] hover:text-[#0F8B8D]">Rabies Course</div>
                        <div onClick={() => { setVaccineMegaMenuOpen(false); scrollToSection('vaccines'); }} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B2A33] hover:text-[#0F8B8D]">Japanese Encephalitis</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#0B2A33]/10">
                        <Shield className="w-4 h-4 text-[#0F8B8D]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0F8B8D]">Speciality Vaccines</span>
                      </div>
                      <div className="space-y-2.5 text-sm">
                        <div onClick={() => { setVaccineMegaMenuOpen(false); scrollToSection('vaccines'); }} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B2A33] hover:text-[#0F8B8D]">Meningitis ACWY</div>
                        <div onClick={() => { setVaccineMegaMenuOpen(false); scrollToSection('vaccines'); }} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B2A33] hover:text-[#0F8B8D]">Shingles & HPV</div>
                        <div onClick={() => { setVaccineMegaMenuOpen(false); scrollToSection('vaccines'); }} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B2A33] hover:text-[#0F8B8D]">Tick-Borne Encephalitis</div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 pb-2 mb-3 border-b border-[#0B2A33]/10">
                        <Pill className="w-4 h-4 text-[#0F8B8D]" />
                        <span className="text-xs font-bold uppercase tracking-wider text-[#0F8B8D]">Tablets & Injections</span>
                      </div>
                      <div className="space-y-2.5 text-sm">
                        <div onClick={() => { setVaccineMegaMenuOpen(false); scrollToSection('services'); }} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B2A33] hover:text-[#0F8B8D]">Antimalarials</div>
                        <div onClick={() => { setVaccineMegaMenuOpen(false); scrollToSection('services'); }} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B2A33] hover:text-[#0F8B8D]">Vitamin B12 Injection</div>
                        <div onClick={() => { setVaccineMegaMenuOpen(false); scrollToSection('services'); }} className="cursor-pointer p-1.5 rounded-lg hover:bg-[#FAF7F2] text-[#0B2A33] hover:text-[#0F8B8D]">Private COVID</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setPricingModalOpen(true)}
              className="hover:text-[#0F8B8D] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              Vaccine Prices
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="hover:text-[#0F8B8D] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              Private COVID
            </button>
            <button
              onClick={() => scrollToSection('footer')}
              className="hover:text-[#0F8B8D] transition-colors py-1 cursor-pointer whitespace-nowrap"
            >
              Contact
            </button>
          </nav>

          {/* Right Action Zone */}
          <div className="flex items-center gap-4 shrink-0">
            <a
              href="tel:02088411585"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#0B2A33] hover:text-[#0F8B8D] transition-colors py-2 px-2.5 rounded-xl hover:bg-[#FAF7F2] whitespace-nowrap"
            >
              <Phone className="w-4 h-4 text-[#0F8B8D]" />
              <span>020 8841 1585</span>
            </a>

            {/* Coral Primary CTA Button */}
            <button
              onClick={() => {
                setBookingConfirmed(false);
                setBookingStep(1);
                setBookingModalOpen(true);
              }}
              className="bg-[#FF7A59] hover:bg-[#F26744] text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              <span>Book online</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="min-[1100px]:hidden p-2 text-[#0B2A33] hover:bg-[#FAF7F2] rounded-xl transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Full-Screen Menu Overlay */}
        {mobileMenuOpen && (
          <div className="min-[1100px]:hidden fixed inset-x-0 top-[65px] bottom-0 bg-white z-50 overflow-y-auto px-6 py-6 border-t border-[#0B2A33]/10 flex flex-col justify-between animate-in slide-in-from-top-4 duration-200">
            <div className="space-y-3">
              <button onClick={() => scrollToSection('hero')} className="w-full text-left text-lg font-serif-display font-medium text-[#0B2A33] py-2">Home</button>
              <button onClick={() => scrollToSection('about')} className="w-full text-left text-lg font-serif-display font-medium text-[#0B2A33] py-2">About Us</button>
              <button onClick={() => scrollToSection('services')} className="w-full text-left text-lg font-serif-display font-medium text-[#0B2A33] py-2">Services</button>
              <button onClick={() => scrollToSection('vaccines')} className="w-full text-left text-lg font-serif-display font-medium text-[#0B2A33] py-2">Vaccines & Tablets</button>
              <button onClick={() => { setMobileMenuOpen(false); setPricingModalOpen(true); }} className="w-full text-left text-lg font-serif-display font-medium text-[#0B2A33] py-2">Vaccine Prices</button>
              <button onClick={() => scrollToSection('timeline')} className="w-full text-left text-lg font-serif-display font-medium text-[#0B2A33] py-2">How Early to Get Jabs</button>
              <button onClick={() => scrollToSection('reviews')} className="w-full text-left text-lg font-serif-display font-medium text-[#0B2A33] py-2">Reviews</button>
              <button onClick={() => scrollToSection('areas')} className="w-full text-left text-lg font-serif-display font-medium text-[#0B2A33] py-2">Serving Northolt</button>
              <button onClick={() => scrollToSection('faq')} className="w-full text-left text-lg font-serif-display font-medium text-[#0B2A33] py-2">FAQ</button>
              <button onClick={() => scrollToSection('footer')} className="w-full text-left text-lg font-serif-display font-medium text-[#0B2A33] py-2">Contact</button>
            </div>

            <div className="pt-6 border-t border-[#0B2A33]/10 space-y-3">
              <a href="tel:02088411585" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-[#0B2A33]/15 font-semibold text-[#0B2A33] text-sm">
                <Phone className="w-4 h-4 text-[#0F8B8D]" />
                <span>Call 020 8841 1585</span>
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setBookingConfirmed(false);
                  setBookingStep(1);
                  setBookingModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#FF7A59] text-white font-semibold text-sm shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment Online</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 2. HERO - 640px Tall Arch, Edge-to-Edge, Dual Glass Chips & Soft Aqua Glow */}
      {/* ========================================================================= */}
      <section id="hero" className="relative min-h-[90vh] flex items-center bg-gradient-to-b from-[#FAF7F2] via-white to-white py-14 lg:py-20">
        {/* Soft Aqua Radial Glow behind Hero Image */}
        <div className="absolute top-10 right-0 w-[620px] h-[620px] rounded-full mesh-glow-teal pointer-events-none -mr-28 blur-3xl opacity-75 animate-ambient-glow" />

        <div className="max-w-[1200px] mx-auto px-6 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            {/* Left Column: Eyebrow, Serif Headline, Subcopy, Action & Trust Row */}
            <div className="lg:col-span-7 space-y-7">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E6F6F6] border border-[#2EC4B6]/30 text-[#0F8B8D] text-xs font-bold tracking-wider uppercase">
                <Compass className="w-3.5 h-3.5 text-[#0F8B8D]" />
                <span>TRAVEL VACCINATION CLINIC, NORTHOLT</span>
              </div>

              {/* Huge Serif Headline with hand-drawn aqua underline */}
              <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-bold tracking-tight text-[#0B2A33] leading-[1.08] text-balance">
                Travel anywhere.{' '}
                <span className="relative inline-block text-[#0B2A33]">
                  Protected
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3.5 text-[#2EC4B6] overflow-visible"
                    viewBox="0 0 250 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 14C55 5 185 3 247 11C200 6 120 14 65 15"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>{' '}
                everywhere.
              </h1>

              {/* Subcopy */}
              <p className="text-base sm:text-lg md:text-xl text-[#0B2A33]/85 leading-relaxed max-w-xl font-normal">
                Destination-specific vaccinations, antimalarials and up-to-the-minute health advice from qualified pharmacists at Northolt Village Pharmacy.
              </p>

              {/* Action: ONE Primary Coral Button + Quiet Text Link */}
              <div className="pt-2 flex flex-wrap items-center gap-6">
                <button
                  onClick={() => {
                    setBookingConfirmed(false);
                    setBookingStep(1);
                    setBookingModalOpen(true);
                  }}
                  className="bg-[#FF7A59] hover:bg-[#F26744] text-white font-semibold text-base px-8 py-4 rounded-xl shadow-lg shadow-[#FF7A59]/25 hover:shadow-xl hover:shadow-[#FF7A59]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer flex items-center gap-2.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>Book appointment</span>
                </button>

                {/* Quiet Text Link: See Vaccine Prices */}
                <button
                  onClick={() => setPricingModalOpen(true)}
                  className="group inline-flex items-center gap-1.5 text-base font-semibold text-[#0F8B8D] hover:text-[#0B2A33] transition-colors cursor-pointer py-2 focus:outline-none"
                >
                  <span className="underline underline-offset-4 decoration-[#0F8B8D]/40 group-hover:decoration-[#0B2A33]">
                    See vaccine prices
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Row: Exactly 3 items with icons */}
              <div className="pt-6 border-t border-[#0B2A33]/10 grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F6F6] text-[#0F8B8D] flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0B2A33]">Qualified pharmacists</div>
                    <div className="text-sm text-[#0B2A33]/70">Expert travel advice</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F6F6] text-[#0F8B8D] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0B2A33]">WHO and NaTHNaC-informed advice</div>
                    <div className="text-sm text-[#0B2A33]/70">Current advisories</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E6F6F6] text-[#0F8B8D] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0B2A33]">Walk-ins welcome</div>
                    <div className="text-sm text-[#0B2A33]/70">Or book in advance</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: 640px Tall Arch Photo Edge-to-Edge + Floating Chips */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[460px] lg:max-w-none">
                {/* 640px Tall Arch-Shaped Cinematic Photo */}
                <div className="relative hero-arch-mask overflow-hidden h-[540px] sm:h-[600px] lg:h-[640px] w-full shadow-2xl border-4 border-white bg-[#0B2A33]/5">
                  <img
                    src={HERO_IMAGE}
                    alt="Traveller overlooking coastal cliff and ocean"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A33]/50 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Chip: Upper Right "Fast-track appointments available" with pulsing dot */}
                <div className="hidden sm:flex absolute -top-4 -right-4 glass-card rounded-2xl px-4 py-2.5 shadow-floating border border-white/90 z-20 items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2EC4B6] animate-pulse shrink-0" />
                  <span className="text-xs font-bold text-[#0B2A33] whitespace-nowrap">
                    Fast-track appointments available
                  </span>
                </div>

                {/* Floating "Where are you travelling?" Search Card over lower-left edge */}
                <div className="mt-6 lg:mt-0 lg:absolute lg:bottom-6 lg:-left-6 lg:w-[360px] glass-card rounded-[24px] p-6 shadow-floating border border-white/90 z-20">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-[#0B2A33] flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#0F8B8D]" /> Where are you travelling?
                    </span>
                    <span className="text-xs text-[#0F8B8D] font-bold bg-[#E6F6F6] px-2 py-0.5 rounded-full">
                      Advisory
                    </span>
                  </div>

                  {/* 56px Tactile Input */}
                  <div className="relative mb-3">
                    <input
                      type="text"
                      placeholder="e.g. Thailand, Kenya, India..."
                      value={heroSearchInput}
                      onChange={(e) => setHeroSearchInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCheckDestination();
                      }}
                      className="w-full h-14 bg-white border border-[#0B2A33]/15 rounded-xl pl-11 pr-4 text-base text-[#0B2A33] placeholder:text-[#0B2A33]/40 focus:outline-none focus:ring-2 focus:ring-[#0F8B8D]"
                    />
                    <Search className="w-5 h-5 text-[#0B2A33]/45 absolute left-3.5 top-4.5" />
                  </div>

                  {/* Suggested Destination Chips with Flag Emojis */}
                  <div className="mb-4">
                    <div className="text-sm text-[#0B2A33]/70 mb-2 font-medium">Suggested destinations:</div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'Thailand', flag: '🇹🇭' },
                        { name: 'Kenya', flag: '🇰🇪' },
                        { name: 'India', flag: '🇮🇳' },
                        { name: 'Peru', flag: '🇵🇪' },
                        { name: 'Saudi Arabia', flag: '🇸🇦' },
                      ].map((item) => (
                        <button
                          key={item.name}
                          onClick={() => {
                            setHeroSearchInput(item.name);
                            handleCheckDestination(item.name);
                          }}
                          className="text-sm bg-white hover:bg-[#0F8B8D] hover:text-white text-[#0B2A33] border border-[#0B2A33]/15 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 font-medium shadow-xs"
                        >
                          <span>{item.flag}</span>
                          <span>{item.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Primary Teal Button */}
                  <button
                    onClick={() => handleCheckDestination()}
                    className="w-full bg-[#0F8B8D] hover:bg-[#0B6B6D] text-white text-sm font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
                  >
                    <span>Check what I need</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SERVICES BENTO (6 Distinctly Tinted Tiles, Brightened Photos, Glow)      */}
      {/* ========================================================================= */}
      <section id="services" className="pt-[120px] pb-[120px] bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F6F6] text-[#0F8B8D] text-xs font-bold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-4 h-4" />
              <span>Tailored Clinical Services</span>
            </div>
            <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B2A33]">
              Specialised travel health & clinical services
            </h2>
            <p className="mt-4 text-base md:text-lg text-[#0B2A33]/80 leading-relaxed font-normal">
              From destination vaccinations to malaria tablets and seasonal immunisations, every service is delivered by qualified pharmacists.
            </p>
          </div>

          {/* Top Row: Travel Clinic (Deep Teal Tint) + Hajj and Umrah (Warm Gold-Brown Tint) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tile 1: Travel Clinic - 2 columns wide, deep rich teal tint */}
            <div className="lg:col-span-2 rounded-[24px] overflow-hidden relative group min-h-[460px] flex flex-col justify-between p-8 sm:p-10 text-white shadow-soft transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 border border-[#0F8B8D]/30 hover:border-[#2EC4B6]/50">
              <img
                src={CLINIC_IMAGE}
                alt="Pharmacist providing travel clinic consultation"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-100 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Deep Rich Teal Tint Overlay with Strong Bottom Dark Gradient for WCAG AA */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#041014] via-[#071C22]/95 via-55% to-[#0F8B8D]/30" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#0F8B8D]/90 backdrop-blur-md text-[#2EC4B6] flex items-center justify-center border border-white/20">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs uppercase tracking-wider font-bold bg-[#0F8B8D] text-white px-3 py-1 rounded-full shadow-sm">
                  Featured Service
                </span>
              </div>

              <div className="relative z-10 space-y-4 pt-16">
                <h3 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  Travel Clinic
                </h3>
                <p className="text-white/95 text-base sm:text-lg max-w-xl leading-relaxed">
                  Comprehensive pre-travel consultations covering destination-specific health requirements, insect avoidance, and tailored travel health advice for your journey.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setBookingData((prev) => ({ ...prev, service: 'Travel Clinic Consultation' }));
                      setBookingConfirmed(false);
                      setBookingStep(1);
                      setBookingModalOpen(true);
                    }}
                    className="inline-flex items-center gap-3 bg-white/25 hover:bg-white text-white hover:text-[#0B2A33] backdrop-blur-md pl-4 pr-3 py-2.5 rounded-full transition-all duration-300 group/btn cursor-pointer"
                  >
                    <span className="text-sm font-semibold">Learn more</span>
                    <div className="w-7 h-7 rounded-full bg-white text-[#0B2A33] group-hover/btn:bg-[#0F8B8D] group-hover/btn:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Tile 2: Hajj and Umrah Vaccine - 1 col wide, warm gold-brown tint */}
            <div className="lg:col-span-1 rounded-[24px] overflow-hidden relative group min-h-[460px] flex flex-col justify-between p-8 text-white shadow-soft transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 border border-[#8C6826]/30 hover:border-[#D4AF37]/50">
              <img
                src={MAKKAH_IMAGE}
                alt="Holy Sanctuary in Makkah for Hajj and Umrah"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-100 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Warm Gold-Brown Tint Overlay with Strong Bottom Dark Gradient for WCAG AA */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#140C04] via-[#1E1408]/95 via-55% to-[#8C6826]/30" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#8C6826]/90 backdrop-blur-md text-[#F4D06F] flex items-center justify-center border border-white/20">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider bg-[#8C6826] text-white px-3 py-1 rounded-full">
                  Visa Requirement
                </span>
              </div>

              <div className="relative z-10 space-y-3 pt-20">
                <h3 className="font-serif-display text-2xl font-bold text-white leading-tight">
                  Hajj and Umrah Vaccine
                </h3>
                <p className="text-white/95 text-sm sm:text-base leading-relaxed">
                  Meningitis ACWY vaccine for Hajj and Umrah pilgrims travelling to Saudi Arabia, ensuring all essential pilgrimage health requirements are met.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setBookingData((prev) => ({ ...prev, service: 'Hajj and Umrah Vaccine', destination: 'Saudi Arabia' }));
                      setBookingConfirmed(false);
                      setBookingStep(1);
                      setBookingModalOpen(true);
                    }}
                    className="inline-flex items-center gap-3 bg-white/25 hover:bg-white text-white hover:text-[#0B2A33] backdrop-blur-md pl-4 pr-3 py-2 rounded-full transition-all duration-300 group/btn cursor-pointer"
                  >
                    <span className="text-sm font-semibold">Learn more</span>
                    <div className="w-7 h-7 rounded-full bg-white text-[#0B2A33] group-hover/btn:bg-[#8C6826] group-hover/btn:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Equal Tiles Below with Individualized Tint Overlays */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {/* Tile 3: Antimalarials - Forest Green Tint */}
            <div className="rounded-[24px] overflow-hidden relative group min-h-[340px] flex flex-col justify-between p-7 text-white shadow-soft transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 border border-[#185333]/30 hover:border-[#2EC4B6]/50">
              <img
                src={ANTIMALARIALS_IMAGE}
                alt="Tropical travel gear for malaria risk zones"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-100 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Forest Green Tint Overlay with Strong Bottom Dark Gradient for WCAG AA */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#031209] via-[#061C10]/95 via-55% to-[#185333]/30" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#185333]/90 backdrop-blur-md text-[#52B788] flex items-center justify-center border border-white/20">
                  <Pill className="w-5 h-5" />
                </div>
              </div>

              <div className="relative z-10 space-y-2 pt-16">
                <h3 className="font-serif-display text-2xl font-bold text-white">
                  Antimalarials
                </h3>
                <p className="text-white/95 text-sm leading-relaxed">
                  Prescription antimalarial tablets including Malarone, Atovaquone/Proguanil, and Doxycycline with expert guidance on bite prevention and destination health risk.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setBookingData((prev) => ({ ...prev, service: 'Antimalarials' }));
                      setBookingConfirmed(false);
                      setBookingStep(1);
                      setBookingModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2.5 bg-white/25 hover:bg-white text-white hover:text-[#0B2A33] backdrop-blur-md pl-3.5 pr-2.5 py-1.5 rounded-full transition-all duration-300 group/btn cursor-pointer text-sm font-semibold"
                  >
                    <span>Learn more</span>
                    <div className="w-6 h-6 rounded-full bg-white text-[#0B2A33] group-hover/btn:bg-[#185333] group-hover/btn:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Tile 4: Vitamin B12 Injection Service - Soft Coral Tint */}
            <div className="rounded-[24px] overflow-hidden relative group min-h-[340px] flex flex-col justify-between p-7 text-white shadow-soft transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 border border-[#B84E33]/30 hover:border-[#FF7A59]/50">
              <img
                src={B12_IMAGE}
                alt="Modern wellness clinic consultation room"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-100 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Soft Coral Tint Overlay with Strong Bottom Dark Gradient for WCAG AA */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#180906] via-[#240F0A]/95 via-55% to-[#B84E33]/30" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#B84E33]/90 backdrop-blur-md text-[#FFA07A] flex items-center justify-center border border-white/20">
                  <Activity className="w-5 h-5" />
                </div>
              </div>

              <div className="relative z-10 space-y-2 pt-16">
                <h3 className="font-serif-display text-2xl font-bold text-white">
                  Vitamin B12 Injection Service
                </h3>
                <p className="text-white/95 text-sm leading-relaxed">
                  Clinician-administered hydroxocobalamin intramuscular injections to support healthy energy levels, immune function, and overall metabolic vitality.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setBookingData((prev) => ({ ...prev, service: 'Vitamin B12 Injection Service' }));
                      setBookingConfirmed(false);
                      setBookingStep(1);
                      setBookingModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2.5 bg-white/25 hover:bg-white text-white hover:text-[#0B2A33] backdrop-blur-md pl-3.5 pr-2.5 py-1.5 rounded-full transition-all duration-300 group/btn cursor-pointer text-sm font-semibold"
                  >
                    <span>Learn more</span>
                    <div className="w-6 h-6 rounded-full bg-white text-[#0B2A33] group-hover/btn:bg-[#B84E33] group-hover/btn:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Tile 5: Speciality Vaccines - Indigo-Slate Tint */}
            <div className="rounded-[24px] overflow-hidden relative group min-h-[340px] flex flex-col justify-between p-7 text-white shadow-soft transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 border border-[#273E63]/30 hover:border-[#63B3ED]/50">
              <img
                src={SPECIALITY_IMAGE}
                alt="Adventurous traveller on mountain trail"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-100 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Indigo-Slate Tint Overlay with Strong Bottom Dark Gradient for WCAG AA */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060A14] via-[#0B1324]/95 via-55% to-[#273E63]/30" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#273E63]/90 backdrop-blur-md text-[#90CDF4] flex items-center justify-center border border-white/20">
                  <Shield className="w-5 h-5" />
                </div>
              </div>

              <div className="relative z-10 space-y-2 pt-16">
                <h3 className="font-serif-display text-2xl font-bold text-white">
                  Speciality Vaccines
                </h3>
                <p className="text-white/95 text-sm leading-relaxed">
                  Targeted non-travel and occupational immunisations including Rabies, HPV, Tick-Borne Encephalitis, and Shingles for long-term clinical protection.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => scrollToSection('vaccines')}
                    className="inline-flex items-center gap-2.5 bg-white/25 hover:bg-white text-white hover:text-[#0B2A33] backdrop-blur-md pl-3.5 pr-2.5 py-1.5 rounded-full transition-all duration-300 group/btn cursor-pointer text-sm font-semibold"
                  >
                    <span>Learn more</span>
                    <div className="w-6 h-6 rounded-full bg-white text-[#0B2A33] group-hover/btn:bg-[#273E63] group-hover/btn:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Tile 6: Private COVID Vaccination - Vibrant Aqua Tint */}
            <div className="rounded-[24px] overflow-hidden relative group min-h-[340px] flex flex-col justify-between p-7 text-white shadow-soft transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1.5 border border-[#0E6C75]/30 hover:border-[#2EC4B6]/50">
              <img
                src={COVID_IMAGE}
                alt="Pharmacist in consultation room"
                className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-100 group-hover:scale-105 transition-transform duration-700"
              />
              {/* Vibrant Aqua Tint Overlay with Strong Bottom Dark Gradient for WCAG AA */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#021012] via-[#051B1F]/95 via-55% to-[#0E6C75]/30" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-[#0E6C75]/90 backdrop-blur-md text-[#2EC4B6] flex items-center justify-center border border-white/20">
                  <Syringe className="w-5 h-5" />
                </div>
              </div>

              <div className="relative z-10 space-y-2 pt-16">
                <h3 className="font-serif-display text-2xl font-bold text-white">
                  Private COVID Vaccination
                </h3>
                <p className="text-white/95 text-sm leading-relaxed">
                  Convenient access to updated strain-matched COVID-19 booster vaccinations for travellers and individuals seeking private immunisation.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setBookingData((prev) => ({ ...prev, service: 'Private COVID Vaccination' }));
                      setBookingConfirmed(false);
                      setBookingStep(1);
                      setBookingModalOpen(true);
                    }}
                    className="inline-flex items-center gap-2.5 bg-white/25 hover:bg-white text-white hover:text-[#0B2A33] backdrop-blur-md pl-3.5 pr-2.5 py-1.5 rounded-full transition-all duration-300 group/btn cursor-pointer text-sm font-semibold"
                  >
                    <span>Learn more</span>
                    <div className="w-6 h-6 rounded-full bg-white text-[#0B2A33] group-hover/btn:bg-[#0E6C75] group-hover/btn:text-white flex items-center justify-center transition-colors">
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. ABOUT US (Editorial Photo Collage with Passport Visual + 01-03 Line)     */}
      {/* ========================================================================= */}
      <section id="about" className="py-[120px] bg-[#FAF7F2] relative overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-16 items-center">
            {/* Left: Overlapping Photo Collage with Rotated Passport Photo & Glass Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[420px] lg:max-w-none">
                {/* Main Clinic Photo */}
                <div className="relative rounded-[24px] overflow-hidden aspect-[4/4.5] shadow-xl border-4 border-white">
                  <img
                    src={CLINIC_IMAGE}
                    alt="Northolt Village Pharmacy consultation room"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2A33]/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Overlapping Second Photo: Traveler with Passport/Suitcase Rotated 3° */}
                <div className="w-48 sm:w-56 aspect-[4/3] rounded-[20px] overflow-hidden shadow-2xl border-4 border-white absolute -bottom-8 -right-6 z-10 rotate-3 transform hover:rotate-0 transition-transform duration-300">
                  <img
                    src={ABOUT_PASSPORT_IMAGE}
                    alt="Traveller with luggage and passport ready for departure"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating Glass Card Top-Left */}
                <div className="glass-card rounded-2xl px-4 py-3 shadow-floating border border-white/90 absolute -top-5 -left-5 z-20 max-w-[260px]">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#0F8B8D]">
                    <Clock className="w-4 h-4 text-[#0F8B8D]" />
                    <span>Walk-ins welcome</span>
                  </div>
                  <p className="text-sm text-[#0B2A33]/85 mt-1 leading-snug">
                    Booking ahead means no waiting.
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Editorial Narrative with 01, 02, 03 Connected by a Thin Line */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white text-[#0F8B8D] text-xs font-bold tracking-wider uppercase border border-[#0B2A33]/10">
                <ShieldCheck className="w-4 h-4 text-[#0F8B8D]" />
                <span>Northolt Village Pharmacy</span>
              </div>

              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B2A33] leading-tight text-balance">
                Expert travel health, from a pharmacy you already trust.
              </h2>

              <p className="text-base sm:text-lg text-[#0B2A33]/85 leading-relaxed font-normal">
                Northolt Travel Clinic is operated by Northolt Village Pharmacy. Our qualified pharmacists provide expert advice and vaccinations you can trust for every destination.
              </p>

              {/* Numbered Highlights 01, 02, 03 with a Connecting Line */}
              <div className="relative pl-6 pt-3 space-y-6">
                {/* Thin vertical connecting line */}
                <div className="absolute left-[19px] top-4 bottom-4 w-[2px] bg-[#0F8B8D]/25 pointer-events-none" />

                {/* Highlight 01 */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-[#0F8B8D] text-white font-serif-display text-sm font-bold flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
                    01
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0B2A33]">Up to date with WHO and NaTHNaC advisories</h4>
                    <p className="text-sm text-[#0B2A33]/75 mt-0.5 leading-relaxed">
                      We monitor official international health guidance to deliver current destination-specific advice.
                    </p>
                  </div>
                </div>

                {/* Highlight 02 */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-[#0F8B8D] text-white font-serif-display text-sm font-bold flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
                    02
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0B2A33]">Personalised vaccination plan for your destination</h4>
                    <p className="text-sm text-[#0B2A33]/75 mt-0.5 leading-relaxed">
                      Tailored protection based on your exact itinerary, activities, and individual health history.
                    </p>
                  </div>
                </div>

                {/* Highlight 03 */}
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-9 h-9 rounded-full bg-[#0F8B8D] text-white font-serif-display text-sm font-bold flex items-center justify-center shrink-0 shadow-sm border-2 border-white">
                    03
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[#0B2A33]">Friendly clinic. Walk-ins welcome, booking ahead means no waiting</h4>
                    <p className="text-sm text-[#0B2A33]/75 mt-0.5 leading-relaxed">
                      Relaxed consultation room with prompt service and care for the whole family.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => scrollToSection('faq')}
                  className="inline-flex items-center gap-2 text-base font-bold text-[#0F8B8D] hover:text-[#0B2A33] transition-colors cursor-pointer group"
                >
                  <span>Learn more about our consultations</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. VACCINES AND TABLETS GRID (Varied Bento with 2 Featured Cards)          */}
      {/* ========================================================================= */}
      <section id="vaccines" className="py-[120px] bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F6F6] text-[#0F8B8D] text-xs font-bold uppercase tracking-wider mb-2">
                <Syringe className="w-4 h-4" />
                <span>Protection Directory</span>
              </div>
              <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#0B2A33]">
                Vaccines and tablets
              </h2>
              <p className="mt-2 text-base md:text-lg text-[#0B2A33]/80 max-w-xl">
                Explore destination and speciality vaccinations administered in our Northolt clinic.
              </p>
            </div>

            {/* Filter Chips with Smooth Filtering */}
            <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#FAF7F2] rounded-2xl border border-[#0B2A33]/8 self-start md:self-auto">
              {['All', 'Travel', 'Speciality', 'Meningitis', 'Hepatitis'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedVaccineFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    selectedVaccineFilter === filter
                      ? 'bg-[#0B2A33] text-white shadow-sm'
                      : 'text-[#0B2A33]/70 hover:text-[#0B2A33] hover:bg-white/60'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Clean 3-Column Grid: Featured Cards (2-cols) + Compact Cards (1-col) - No gaps */}
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 [grid-auto-rows:1fr] items-stretch gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredVaccines.map((item) => {
                if (item.isFeatured) {
                  // FEATURED CARD: Spans 2 columns on desktop & tablet with gradient header, larger title & teal border
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      key={item.id}
                      className="md:col-span-2 lg:col-span-2 rounded-[24px] bg-gradient-to-br from-[#FAF7F2] via-white to-[#E6F6F6]/50 border-2 border-[#0F8B8D]/35 p-8 flex flex-col justify-between shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-[#0F8B8D] text-white flex items-center justify-center shadow-md">
                              {item.iconType === 'shield' && <Shield className="w-7 h-7" />}
                              {item.iconType === 'stamp' && <FileText className="w-7 h-7" />}
                            </div>
                            <div>
                              <span className="text-xs uppercase tracking-wider font-bold text-[#0F8B8D] block">
                                {item.featuredSubtitle || 'Travel Requirement'}
                              </span>
                              <span className="text-xs text-[#0B2A33]/60 font-semibold uppercase">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          <span className="bg-[#0F8B8D]/15 text-[#0F8B8D] text-xs font-bold px-3 py-1 rounded-full">
                            Featured
                          </span>
                        </div>

                        <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0B2A33] group-hover:text-[#0F8B8D] transition-colors mt-2">
                          {item.name}
                        </h3>

                        <p className="mt-3 text-base text-[#0B2A33]/85 leading-relaxed max-w-2xl">
                          {item.description}
                        </p>

                        <div className="mt-5 pt-4 border-t border-[#0B2A33]/8 flex flex-wrap items-center gap-3">
                          <span className="text-sm font-bold text-[#0B2A33]/70 uppercase tracking-wider">
                            Typically needed for:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {item.neededFor.map((dest) => (
                              <span
                                key={dest}
                                className="text-sm bg-white text-[#0B2A33] border border-[#0B2A33]/15 px-3 py-1 rounded-lg font-medium shadow-xs"
                              >
                                {dest}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-[#0B2A33]/8 flex items-center justify-end">
                        <button
                          onClick={() => {
                            setBookingData((prev) => ({ ...prev, service: `${item.name} Vaccine` }));
                            setBookingConfirmed(false);
                            setBookingStep(1);
                            setBookingModalOpen(true);
                          }}
                          className="inline-flex items-center gap-2 bg-[#0B2A33] hover:bg-[#0F8B8D] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                        >
                          <span>Learn more</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                }

                // COMPACT CARDS: Icon, Title, ONE Short Sentence, Destination Pills, "Learn more" - zero dose lines
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                    key={item.id}
                    className="col-span-1 rounded-[24px] bg-white border border-[#0B2A33]/10 p-7 flex flex-col justify-between shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 hover:border-[#0F8B8D]/40 transition-all duration-300 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-[#E6F6F6] text-[#0F8B8D] group-hover:bg-[#0F8B8D] group-hover:text-white transition-colors duration-300 flex items-center justify-center">
                          {item.iconType === 'shield' && <Shield className="w-6 h-6" />}
                          {item.iconType === 'bug' && <AlertCircle className="w-6 h-6" />}
                          {item.iconType === 'cell' && <Activity className="w-6 h-6" />}
                          {item.iconType === 'paw' && <Heart className="w-6 h-6" />}
                          {item.iconType === 'meningitis' && <ShieldCheck className="w-6 h-6" />}
                          {item.iconType === 'stamp' && <FileText className="w-6 h-6" />}
                          {item.iconType === 'mosquito' && <Compass className="w-6 h-6" />}
                          {item.iconType === 'dna' && <Sparkles className="w-6 h-6" />}
                          {item.iconType === 'liver' && <Syringe className="w-6 h-6" />}
                        </div>

                        <span className="text-xs font-semibold text-[#0B2A33]/60 uppercase tracking-wider">
                          {item.category}
                        </span>
                      </div>

                      <h3 className="font-serif-display text-xl font-bold text-[#0B2A33] group-hover:text-[#0F8B8D] transition-colors">
                        {item.name}
                      </h3>

                      {/* ONE short sentence */}
                      <p className="mt-2 text-sm text-[#0B2A33]/80 leading-relaxed">
                        {item.description}
                      </p>

                      {/* Destination pills row */}
                      <div className="mt-4 pt-4 border-t border-[#0B2A33]/8">
                        <div className="text-sm font-semibold text-[#0B2A33]/70 mb-2">
                          Typically needed for:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.neededFor.map((dest) => (
                            <span
                              key={dest}
                              className="text-sm bg-[#FAF7F2] text-[#0B2A33] px-2.5 py-1 rounded-lg font-medium"
                            >
                              {dest}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Clean Footer with "Learn more" arrow link */}
                    <div className="mt-6 pt-4 border-t border-[#0B2A33]/8 flex items-center justify-end">
                      <button
                        onClick={() => {
                          setBookingData((prev) => ({ ...prev, service: `${item.name} Vaccine` }));
                          setBookingConfirmed(false);
                          setBookingStep(1);
                          setBookingModalOpen(true);
                        }}
                        className="font-bold text-sm text-[#0F8B8D] hover:text-[#0B2A33] flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>Learn more</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}

              {/* 12th Slot: Compact CTA Card filling Row 4 cleanly */}
              {(selectedVaccineFilter === 'All' || selectedVaccineFilter === 'Travel') && (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  key="vaccine-cta-card"
                  className="col-span-1 rounded-[24px] bg-gradient-to-br from-[#0F8B8D] via-[#0B6B6D] to-[#0B2A33] p-7 flex flex-col justify-between shadow-soft hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 border border-[#2EC4B6]/30 text-white group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/15 text-[#2EC4B6] flex items-center justify-center backdrop-blur-md border border-white/20">
                        <HelpCircle className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider bg-white/20 text-white px-3 py-1 rounded-full">
                        Advisory
                      </span>
                    </div>

                    <h3 className="font-serif-display text-xl sm:text-2xl font-bold text-white group-hover:text-[#2EC4B6] transition-colors">
                      Not sure what you need?
                    </h3>

                    <p className="mt-3 text-sm text-white/90 leading-relaxed font-normal">
                      Tell us where you're travelling and we'll advise.
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/15">
                    <button
                      onClick={() => {
                        setBookingConfirmed(false);
                        setBookingStep(1);
                        setBookingModalOpen(true);
                      }}
                      className="w-full bg-[#FF7A59] hover:bg-[#F26744] text-white font-semibold text-sm py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Book a consultation</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* View all vaccine prices link */}
          <div className="mt-14 text-center">
            <button
              onClick={() => setPricingModalOpen(true)}
              className="inline-flex items-center gap-2 bg-[#FAF7F2] hover:bg-[#E6F6F6] text-[#0B2A33] border border-[#0B2A33]/15 font-semibold text-base px-8 py-3.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-sm"
            >
              <FileText className="w-5 h-5 text-[#0F8B8D]" />
              <span>View all vaccine prices</span>
              <ArrowRight className="w-4 h-4 text-[#0F8B8D]" />
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HOW EARLY SHOULD YOU GET TRAVEL VACCINES? (HERO TIMELINE EXPERIENCE)    */}
      {/* ========================================================================= */}
      <section id="timeline" className="py-[140px] bg-[#0B2A33] text-white relative overflow-hidden">
        {/* Ambient mesh glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] rounded-full mesh-glow-dark pointer-events-none blur-3xl opacity-75" />

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-20">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0F8B8D]/30 border border-[#2EC4B6]/30 text-[#2EC4B6] text-xs font-bold uppercase tracking-wider mb-4">
              <Clock className="w-4 h-4" />
              <span>Timing Guide</span>
            </div>
            <h2 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              How early should you get travel vaccines?
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-white/85 leading-relaxed font-normal">
              Most travel vaccines require time to trigger protective immunity before departure. Plan ahead to ensure complete peace of mind.
            </p>
          </div>

          {/* Connected Hero Timeline on Desktop (Animated left-to-right), Vertical on Mobile */}
          <div className="relative mb-24">
            {/* Desktop Horizontal Line Structure: 6px thick connecting line */}
            <div className="hidden sm:block absolute top-[33px] left-[5%] right-[5%] h-[6px] bg-white/15 rounded-full overflow-hidden">
              {/* Background drawing track */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="h-full w-full bg-white/40 origin-left rounded-full"
              />
            </div>

            {/* Glowing Teal Bar for Ideal Window (6 to 8 weeks) - 12px thick with rich aqua glow */}
            <div className="hidden sm:block absolute top-[30px] left-[5%] w-[32%] z-10">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.9, delay: 0.3, ease: 'easeOut' }}
                className="h-[12px] bg-gradient-to-r from-[#2EC4B6] via-[#2EC4B6] to-[#0F8B8D] origin-left rounded-full shadow-[0_0_28px_#2EC4B6,0_0_12px_#2EC4B6]"
              />
            </div>

            {/* Visible Floating Pill Label directly above the glowing segment: 14px bold */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              className="hidden sm:inline-flex items-center gap-2 mb-12 bg-[#2EC4B6] text-[#0B2A33] font-bold text-sm uppercase tracking-wider px-4 py-2 rounded-full shadow-[0_4px_24px_rgba(46,196,182,0.5)] border border-white/50"
            >
              <Sparkles className="w-4 h-4 fill-[#0B2A33]" />
              <span>Ideal window: 6 to 8 weeks before departure</span>
            </motion.div>

            {/* 4 Interactive Nodes popping in one by one (72px nodes, 28px titles, 17px text) */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 lg:gap-10 relative">
              {/* Node 1: 8 Weeks */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
                className="relative pt-0 sm:pt-4"
              >
                <div className="flex items-start gap-4 sm:block">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#0F8B8D] border-4 border-[#2EC4B6] shadow-[0_0_28px_rgba(46,196,182,0.7)] flex items-center justify-center font-serif-display font-bold text-2xl text-white mb-6 shrink-0 ring-4 ring-[#2EC4B6]/25">
                    8w
                  </div>
                  <div>
                    <h4 className="font-serif-display text-[26px] sm:text-[28px] font-bold text-[#2EC4B6]">8 weeks</h4>
                    <p className="text-[16px] sm:text-[17px] text-white/90 leading-relaxed mt-2.5 font-normal">
                      Ideal window for comprehensive travel health consultations and primary vaccinations before departure.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Node 2: 4 Weeks */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.4, duration: 0.5, type: 'spring' }}
                className="relative pt-0 sm:pt-4"
              >
                <div className="flex items-start gap-4 sm:block">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#0B2A33] border-4 border-white/60 flex items-center justify-center font-serif-display font-bold text-2xl text-white mb-6 shrink-0 shadow-lg">
                    4w
                  </div>
                  <div>
                    <h4 className="font-serif-display text-[26px] sm:text-[28px] font-bold text-white">4 weeks</h4>
                    <p className="text-[16px] sm:text-[17px] text-white/90 leading-relaxed mt-2.5 font-normal">
                      Standard window for travel vaccines and health advice before your journey.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Node 3: 2 Weeks */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.6, duration: 0.5, type: 'spring' }}
                className="relative pt-0 sm:pt-4"
              >
                <div className="flex items-start gap-4 sm:block">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#0B2A33] border-4 border-white/60 flex items-center justify-center font-serif-display font-bold text-2xl text-white mb-6 shrink-0 shadow-lg">
                    2w
                  </div>
                  <div>
                    <h4 className="font-serif-display text-[26px] sm:text-[28px] font-bold text-white">2 weeks</h4>
                    <p className="text-[16px] sm:text-[17px] text-white/90 leading-relaxed mt-2.5 font-normal">
                      Vital window to receive essential vaccinations and collect prescribed antimalarial medication.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Node 4: Departure with Plane Icon */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: 0.8, duration: 0.5, type: 'spring' }}
                className="relative pt-0 sm:pt-4"
              >
                <div className="flex items-start gap-4 sm:block">
                  <div className="w-[72px] h-[72px] rounded-full bg-[#0B2A33] border-4 border-[#2EC4B6] flex items-center justify-center text-[#2EC4B6] mb-6 shrink-0 shadow-[0_0_24px_rgba(46,196,182,0.45)] ring-4 ring-[#2EC4B6]/20">
                    <Plane className="w-8 h-8 text-[#2EC4B6]" />
                  </div>
                  <div>
                    <h4 className="font-serif-display text-[26px] sm:text-[28px] font-bold text-white">Departure</h4>
                    <p className="text-[16px] sm:text-[17px] text-white/90 leading-relaxed mt-2.5 font-normal">
                      Ready to travel with your travel health preparations and advice complete.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Reassurance Card with Coral Accent Border & Pulsing Dot */}
          <div className="rounded-[24px] bg-gradient-to-r from-white/10 to-white/5 border-2 border-[#FF7A59]/40 p-8 md:p-10 shadow-2xl relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A59] animate-ping" />
                  <span className="text-xs font-bold text-[#FF7A59] uppercase tracking-wider block">
                    Last-Minute Departures
                  </span>
                </div>

                <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-white">
                  Travelling soon? It's not too late.
                </h3>
                <p className="text-base text-white/90 leading-relaxed max-w-xl">
                  Fast-track appointments available for last-minute travellers. Contact the clinic to discuss same-day protection options.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => {
                      setBookingConfirmed(false);
                      setBookingStep(1);
                      setBookingModalOpen(true);
                    }}
                    className="bg-[#FF7A59] hover:bg-[#F26744] text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-lg shadow-[#FF7A59]/30 transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Book a consultation</span>
                  </button>

                  <a
                    href="tel:02088411585"
                    className="inline-flex items-center gap-2 text-base font-semibold text-white hover:text-[#2EC4B6] transition-colors py-3.5 px-5 rounded-xl bg-white/10 hover:bg-white/15"
                  >
                    <Phone className="w-4 h-4 text-[#2EC4B6]" />
                    <span>Call 020 8841 1585</span>
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/5 rounded-2xl p-6 border border-white/10 space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2EC4B6] shrink-0 mt-0.5" />
                  <p className="text-base text-white/90 leading-relaxed font-medium">
                    Fast-track appointments for last-minute travellers
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2EC4B6] shrink-0 mt-0.5" />
                  <p className="text-base text-white/90 leading-relaxed font-medium">
                    Same-day appointments available
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#2EC4B6] shrink-0 mt-0.5" />
                  <p className="text-base text-white/90 leading-relaxed font-medium">
                    Walk-ins welcome
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. PATIENT REVIEWS (Staggered Masonry with Large Featured Quote)           */}
      {/* ========================================================================= */}
      <section id="reviews" className="py-[120px] bg-[#FAF7F2] relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Left Summary: 5.0 on Google */}
            <div className="lg:col-span-4 space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-[#0F8B8D] text-xs font-bold uppercase tracking-wider border border-[#0B2A33]/10">
                <Star className="w-4 h-4 fill-[#0F8B8D] text-[#0F8B8D]" />
                <span>Patient Reviews</span>
              </div>

              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#0B2A33] leading-tight">
                What our patients say
              </h2>

              <p className="text-base text-[#0B2A33]/80 leading-relaxed">
                Real feedback from patients visiting our Northolt pharmacy for travel health and vaccinations.
              </p>

              {/* 5.0 Google Summary Card */}
              <div className="bg-white rounded-[20px] p-6 border border-[#0B2A33]/10 shadow-soft">
                <div className="flex items-center gap-3.5 mb-2">
                  <div className="w-11 h-11 rounded-xl bg-[#FAF7F2] flex items-center justify-center">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <div>
                    <div className="font-serif-display font-bold text-2xl text-[#0B2A33]">5.0 on Google</div>
                    <div className="flex items-center gap-1 text-[#2EC4B6]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-[#0B2A33]/70">
                  Reviews from Google Maps
                </div>
              </div>
            </div>

            {/* Right: Staggered Masonry Layout with Large Featured Quote */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* LARGE FEATURED QUOTE CARD: Kevin Lewis */}
              <div className="sm:col-span-2 bg-white rounded-[24px] p-8 sm:p-10 border-2 border-[#0F8B8D]/25 shadow-soft relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-4 right-8 font-serif-display text-8xl text-[#2EC4B6]/20 font-bold leading-none select-none pointer-events-none">
                  “
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-1.5 text-[#2EC4B6]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-[#0B2A33]/60">7 months ago</span>
                  </div>

                  <blockquote className="font-serif-display text-2xl sm:text-3xl text-[#0B2A33] font-semibold leading-snug mb-6">
                    “Popped in off the street and seen promptly”
                  </blockquote>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#0B2A33]/10 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E6F6F6] text-[#0F8B8D] font-bold text-sm flex items-center justify-center">
                      KL
                    </div>
                    <div>
                      <span className="text-sm font-bold text-[#0B2A33] block">Kevin Lewis</span>
                      <span className="text-sm text-[#0B2A33]/70">Google Review</span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-sm text-[#0F8B8D] font-semibold">
                    <CheckCircle2 className="w-4 h-4" /> Verified patient
                  </span>
                </div>
              </div>

              {/* Smaller Card 2: Katherine Bloomer */}
              <div className="bg-white rounded-[20px] p-6 border border-[#0B2A33]/10 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#2EC4B6]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-[#0B2A33]/60">7 months ago</span>
                  </div>
                  <blockquote className="font-serif-display text-lg text-[#0B2A33] font-medium leading-snug mb-5">
                    “Excellent prompt service”
                  </blockquote>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#0B2A33]/8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E6F6F6] text-[#0F8B8D] font-bold text-xs flex items-center justify-center">
                      KB
                    </div>
                    <span className="text-sm font-bold text-[#0B2A33]">Katherine Bloomer</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-[#0F8B8D] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>

              {/* Smaller Card 3: John Foster */}
              <div className="bg-white rounded-[20px] p-6 border border-[#0B2A33]/10 shadow-soft flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-[#2EC4B6]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-[#0B2A33]/60">7 months ago</span>
                  </div>
                  <blockquote className="font-serif-display text-xl text-[#0B2A33] font-semibold leading-snug mb-5">
                    “Perfect.”
                  </blockquote>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-[#0B2A33]/8">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#E6F6F6] text-[#0F8B8D] font-bold text-xs flex items-center justify-center">
                      JF
                    </div>
                    <span className="text-sm font-bold text-[#0B2A33]">John Foster</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-sm text-[#0F8B8D] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>

              {/* Smaller Card 4: Aimee Honeywell */}
              <div className="sm:col-span-2 bg-white rounded-[20px] p-6 border border-[#0B2A33]/10 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-[#2EC4B6]">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-[#0B2A33]/60">7 months ago</span>
                  </div>
                  <blockquote className="font-serif-display text-lg text-[#0B2A33] font-medium">
                    “Very good”
                  </blockquote>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-8 h-8 rounded-full bg-[#E6F6F6] text-[#0F8B8D] font-bold text-xs flex items-center justify-center">
                    AH
                  </div>
                  <span className="text-sm font-bold text-[#0B2A33]">Aimee Honeywell</span>
                  <span className="inline-flex items-center gap-1 text-sm text-[#0F8B8D] font-semibold ml-2">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. SERVING NORTHOLT AND SURROUNDING AREAS (With Active Area Map Label)     */}
      {/* ========================================================================= */}
      <section id="areas" className="py-[120px] bg-white relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Heading, short intro, and 7 selectable postcode pills */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E6F6F6] text-[#0F8B8D] text-xs font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>West London Coverage</span>
              </div>

              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B2A33] leading-tight">
                Serving Northolt and surrounding areas
              </h2>

              <p className="text-base text-[#0B2A33]/80 leading-relaxed">
                Located on Church Road, our clinic serves patients across Northolt and neighbouring West London communities.
              </p>

              {/* 7 Selectable Postcode Pills */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold text-[#0B2A33] uppercase tracking-wider block">
                  Select your area:
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {SERVICE_ZONES.map((zone) => {
                    const isSelected = activeZone === zone.code;
                    return (
                      <button
                        key={zone.code}
                        onClick={() => setActiveZone(zone.code)}
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                          isSelected
                            ? 'bg-[#0F8B8D] text-white shadow-md shadow-[#0F8B8D]/25 scale-105'
                            : 'bg-[#FAF7F2] text-[#0B2A33] hover:bg-[#E6F6F6] border border-[#0B2A33]/8'
                        }`}
                      >
                        <span className="font-mono">{zone.code}</span>
                        <span>{zone.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Get Directions Button */}
              <div className="pt-4">
                <a
                  href="https://maps.google.com/?q=Northolt+Village+Pharmacy+32+Church+Rd+Northolt+UB5+5AB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#0B2A33] hover:bg-[#0F8B8D] text-white font-semibold text-base px-7 py-3.5 rounded-xl transition-all cursor-pointer shadow-md"
                >
                  <MapPin className="w-4 h-4 text-[#2EC4B6]" />
                  <span>Get directions</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right: Large Custom SVG Map Card (at least 480px tall) with Glowing Selected Zone */}
            <div className="lg:col-span-6">
              <div className="rounded-[28px] bg-[#0B2A33] p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden border border-white/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <div className="text-xs text-[#2EC4B6] font-bold tracking-wider uppercase mb-1">Clinic Location</div>
                    <div className="text-base font-bold text-white flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#FF7A59]" />
                      <span>32 Church Rd, Northolt, UB5 5AB</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 bg-[#0F8B8D]/50 text-white px-3.5 py-1.5 rounded-xl border border-[#2EC4B6]/40 shadow-[0_0_16px_rgba(46,196,182,0.3)] self-start sm:self-auto">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#2EC4B6] animate-ping shrink-0" />
                    <div>
                      <span className="text-[11px] font-bold text-[#2EC4B6] uppercase tracking-wider block leading-none">Active Area</span>
                      <span className="text-sm font-bold text-white leading-tight">{SERVICE_ZONES.find((z) => z.code === activeZone)?.fullName}</span>
                    </div>
                  </div>
                </div>

                {/* Scaled-up SVG Map Canvas (Min 480px tall, completely filled with no empty dark areas) */}
                <div className="relative min-h-[480px] h-[520px] rounded-2xl bg-[#071C22] p-4 flex items-center justify-center overflow-hidden border border-white/10 shadow-inner">
                  {/* Subtle radial teal ambient mesh */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(15,139,141,0.25)_0%,transparent_75%)] pointer-events-none" />

                  <svg className="w-full h-full relative z-10" viewBox="0 0 640 480" fill="none">
                    <defs>
                      <filter id="teal-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
                        <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="blur2" />
                        <feMerge>
                          <feMergeNode in="blur2" />
                          <feMergeNode in="blur1" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    {/* West London Arterial Road Networks & Geographic Infrastructure */}
                    <path d="M 15 285 C 180 255, 420 275, 625 225" stroke="#0F8B8D" strokeWidth="5" strokeDasharray="8 6" opacity="0.65" />
                    <text x="500" y="215" fill="#2EC4B6" fontSize="13" fontWeight="bold" opacity="0.85">A40 Western Ave</text>

                    {/* Mandeville Road / Church Road Corridor */}
                    <path d="M 320 20 L 320 460" stroke="#0F8B8D" strokeWidth="3" opacity="0.45" />
                    <text x="326" y="45" fill="#2EC4B6" fontSize="11" opacity="0.6">Church Road Corridor</text>

                    {/* Grand Union Canal Paddington Arm */}
                    <path d="M 25 450 C 200 410, 360 460, 615 390" stroke="#2EC4B6" strokeWidth="2.5" opacity="0.35" strokeDasharray="5 5" />
                    <text x="40" y="440" fill="#2EC4B6" fontSize="11" opacity="0.6">Grand Union Canal</text>

                    {/* Central Line Railway Track */}
                    <path d="M 20 180 C 180 160, 420 190, 625 150" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.25" />

                    {/* ZONE 1: UB5 Northolt (Central Hub - Scaled up r=64) */}
                    <g className="cursor-pointer group" onClick={() => setActiveZone('UB5')}>
                      {activeZone === 'UB5' && (
                        <circle cx="320" cy="250" r="74" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeDasharray="6 4" className="animate-spin" />
                      )}
                      <circle
                        cx="320"
                        cy="250"
                        r="64"
                        fill={activeZone === 'UB5' ? '#0F8B8D' : '#0B2A33'}
                        fillOpacity={activeZone === 'UB5' ? '0.85' : '0.45'}
                        stroke={activeZone === 'UB5' ? '#2EC4B6' : '#0F8B8D'}
                        strokeWidth={activeZone === 'UB5' ? '4' : '2'}
                        filter={activeZone === 'UB5' ? 'url(#teal-glow)' : undefined}
                        className="transition-all duration-300 group-hover:stroke-[#2EC4B6]"
                      />
                      <text x="320" y="244" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="bold">UB5</text>
                      <text x="320" y="262" textAnchor="middle" fill="#2EC4B6" fontSize="13" fontWeight="bold">Northolt</text>
                    </g>

                    {/* ZONE 2: UB4 Yeading / Hayes (Scaled up r=58) */}
                    <g className="cursor-pointer group" onClick={() => setActiveZone('UB4')}>
                      {activeZone === 'UB4' && (
                        <circle cx="170" cy="350" r="68" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeDasharray="6 4" className="animate-spin" />
                      )}
                      <circle
                        cx="170"
                        cy="350"
                        r="58"
                        fill={activeZone === 'UB4' ? '#0F8B8D' : '#0B2A33'}
                        fillOpacity={activeZone === 'UB4' ? '0.85' : '0.45'}
                        stroke={activeZone === 'UB4' ? '#2EC4B6' : '#0F8B8D'}
                        strokeWidth={activeZone === 'UB4' ? '4' : '2'}
                        filter={activeZone === 'UB4' ? 'url(#teal-glow)' : undefined}
                        className="transition-all duration-300 group-hover:stroke-[#2EC4B6]"
                      />
                      <text x="170" y="344" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">UB4</text>
                      <text x="170" y="362" textAnchor="middle" fill="#2EC4B6" fontSize="12" fontWeight="bold">Hayes / Yeading</text>
                    </g>

                    {/* ZONE 3: HA2 South Harrow / Rayners Lane (Scaled up r=58) */}
                    <g className="cursor-pointer group" onClick={() => setActiveZone('HA2')}>
                      {activeZone === 'HA2' && (
                        <circle cx="460" cy="145" r="68" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeDasharray="6 4" className="animate-spin" />
                      )}
                      <circle
                        cx="460"
                        cy="145"
                        r="58"
                        fill={activeZone === 'HA2' ? '#0F8B8D' : '#0B2A33'}
                        fillOpacity={activeZone === 'HA2' ? '0.85' : '0.45'}
                        stroke={activeZone === 'HA2' ? '#2EC4B6' : '#0F8B8D'}
                        strokeWidth={activeZone === 'HA2' ? '4' : '2'}
                        filter={activeZone === 'HA2' ? 'url(#teal-glow)' : undefined}
                        className="transition-all duration-300 group-hover:stroke-[#2EC4B6]"
                      />
                      <text x="460" y="139" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">HA2</text>
                      <text x="460" y="157" textAnchor="middle" fill="#2EC4B6" fontSize="12" fontWeight="bold">South Harrow</text>
                    </g>

                    {/* ZONE 4: UB6 Greenford / Perivale (Scaled up r=58) */}
                    <g className="cursor-pointer group" onClick={() => setActiveZone('UB6')}>
                      {activeZone === 'UB6' && (
                        <circle cx="495" cy="340" r="68" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeDasharray="6 4" className="animate-spin" />
                      )}
                      <circle
                        cx="495"
                        cy="340"
                        r="58"
                        fill={activeZone === 'UB6' ? '#0F8B8D' : '#0B2A33'}
                        fillOpacity={activeZone === 'UB6' ? '0.85' : '0.45'}
                        stroke={activeZone === 'UB6' ? '#2EC4B6' : '#0F8B8D'}
                        strokeWidth={activeZone === 'UB6' ? '4' : '2'}
                        filter={activeZone === 'UB6' ? 'url(#teal-glow)' : undefined}
                        className="transition-all duration-300 group-hover:stroke-[#2EC4B6]"
                      />
                      <text x="495" y="334" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">UB6</text>
                      <text x="495" y="352" textAnchor="middle" fill="#2EC4B6" fontSize="12" fontWeight="bold">Greenford</text>
                    </g>

                    {/* ZONE 5: HA4 Ruislip / South Ruislip (Scaled up r=58) */}
                    <g className="cursor-pointer group" onClick={() => setActiveZone('HA4')}>
                      {activeZone === 'HA4' && (
                        <circle cx="160" cy="130" r="68" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeDasharray="6 4" className="animate-spin" />
                      )}
                      <circle
                        cx="160"
                        cy="130"
                        r="58"
                        fill={activeZone === 'HA4' ? '#0F8B8D' : '#0B2A33'}
                        fillOpacity={activeZone === 'HA4' ? '0.85' : '0.45'}
                        stroke={activeZone === 'HA4' ? '#2EC4B6' : '#0F8B8D'}
                        strokeWidth={activeZone === 'HA4' ? '4' : '2'}
                        filter={activeZone === 'HA4' ? 'url(#teal-glow)' : undefined}
                        className="transition-all duration-300 group-hover:stroke-[#2EC4B6]"
                      />
                      <text x="160" y="124" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="bold">HA4</text>
                      <text x="160" y="142" textAnchor="middle" fill="#2EC4B6" fontSize="12" fontWeight="bold">Ruislip</text>
                    </g>

                    {/* ZONE 6: UB10 Hillingdon / Ickenham (Scaled up r=54) */}
                    <g className="cursor-pointer group" onClick={() => setActiveZone('UB10')}>
                      {activeZone === 'UB10' && (
                        <circle cx="75" cy="240" r="64" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeDasharray="6 4" className="animate-spin" />
                      )}
                      <circle
                        cx="75"
                        cy="240"
                        r="54"
                        fill={activeZone === 'UB10' ? '#0F8B8D' : '#0B2A33'}
                        fillOpacity={activeZone === 'UB10' ? '0.85' : '0.45'}
                        stroke={activeZone === 'UB10' ? '#2EC4B6' : '#0F8B8D'}
                        strokeWidth={activeZone === 'UB10' ? '4' : '2'}
                        filter={activeZone === 'UB10' ? 'url(#teal-glow)' : undefined}
                        className="transition-all duration-300 group-hover:stroke-[#2EC4B6]"
                      />
                      <text x="75" y="234" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">UB10</text>
                      <text x="75" y="252" textAnchor="middle" fill="#2EC4B6" fontSize="11" fontWeight="bold">Hillingdon</text>
                    </g>

                    {/* ZONE 7: HA1 Harrow / Harrow on the Hill (Scaled up r=54) */}
                    <g className="cursor-pointer group" onClick={() => setActiveZone('HA1')}>
                      {activeZone === 'HA1' && (
                        <circle cx="545" cy="65" r="64" fill="none" stroke="#2EC4B6" strokeWidth="2" strokeDasharray="6 4" className="animate-spin" />
                      )}
                      <circle
                        cx="545"
                        cy="65"
                        r="54"
                        fill={activeZone === 'HA1' ? '#0F8B8D' : '#0B2A33'}
                        fillOpacity={activeZone === 'HA1' ? '0.85' : '0.45'}
                        stroke={activeZone === 'HA1' ? '#2EC4B6' : '#0F8B8D'}
                        strokeWidth={activeZone === 'HA1' ? '4' : '2'}
                        filter={activeZone === 'HA1' ? 'url(#teal-glow)' : undefined}
                        className="transition-all duration-300 group-hover:stroke-[#2EC4B6]"
                      />
                      <text x="545" y="59" textAnchor="middle" fill="#FFFFFF" fontSize="14" fontWeight="bold">HA1</text>
                      <text x="545" y="77" textAnchor="middle" fill="#2EC4B6" fontSize="11" fontWeight="bold">Harrow</text>
                    </g>

                    {/* Pulsing Pin on 32 Church Rd Clinic Hub */}
                    <g transform="translate(320, 245)">
                      <circle cx="0" cy="0" r="18" fill="#FF7A59" fillOpacity="0.4" className="animate-ping" />
                      <circle cx="0" cy="0" r="9" fill="#FF7A59" stroke="#FFFFFF" strokeWidth="2.5" />
                      <circle cx="0" cy="0" r="3.5" fill="#FFFFFF" />
                      <rect x="-70" y="16" width="140" height="22" rx="6" fill="#0B2A33" fillOpacity="0.95" stroke="#FF7A59" strokeWidth="1" />
                      <text x="0" y="31" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="bold">32 Church Rd Clinic</text>
                    </g>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 9. FINAL CTA BAND (Slow Animated Gradient & Soft Photo Overlay)             */}
      {/* ========================================================================= */}
      <section className="py-20 lg:py-24 bg-gradient-to-r from-[#0B2A33] via-[#0F8B8D] to-[#0B2A33] text-white relative overflow-hidden">
        {/* Soft Background Photo Scrim */}
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <img
            src={HERO_IMAGE}
            alt="Travel background"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center">
          <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-tight text-balance">
            Ready to travel safely? Book your appointment now.
          </h2>

          <p className="mt-4 text-base md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Same-day appointments available. Don't wait until it's too late.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-5">
            {/* Coral "Book now" Button */}
            <button
              onClick={() => {
                setBookingConfirmed(false);
                setBookingStep(1);
                setBookingModalOpen(true);
              }}
              className="bg-[#FF7A59] hover:bg-[#F26744] text-white font-bold text-base px-8 py-4 rounded-xl shadow-xl shadow-[#FF7A59]/30 hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer flex items-center gap-2.5"
            >
              <Calendar className="w-5 h-5" />
              <span>Book now</span>
            </button>

            {/* Secondary White Outline "Call 020 8841 1585" Button */}
            <a
              href="tel:02088411585"
              className="border-2 border-white text-white hover:bg-white hover:text-[#0B2A33] font-bold text-base px-7 py-3.5 rounded-xl transition-all active:scale-95 cursor-pointer flex items-center gap-2.5 shadow-sm"
            >
              <Phone className="w-5 h-5" />
              <span>Call 020 8841 1585</span>
            </a>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 10. FAQ (Smooth Height Animation, Plus/Minus Rotation, First Open)          */}
      {/* ========================================================================= */}
      <section id="faq" className="py-[120px] bg-[#FAF7F2] relative">
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Column: Sticky Title + Contact Card */}
            <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#0F8B8D] text-xs font-bold uppercase tracking-wider border border-[#0B2A33]/10">
                <HelpCircle className="w-4 h-4" />
                <span>Frequently Asked Questions</span>
              </div>

              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold tracking-tight text-[#0B2A33]">
                Got questions before your trip?
              </h2>

              <p className="text-base text-[#0B2A33]/80 leading-relaxed">
                Everything you need to know about booking, travel health requirements, and our Northolt clinic.
              </p>

              {/* Still Unsure Card */}
              <div className="bg-white rounded-[20px] p-6 border border-[#0B2A33]/10 shadow-soft space-y-3">
                <h4 className="font-serif-display font-bold text-lg text-[#0B2A33]">Still unsure? Call us</h4>
                <p className="text-sm text-[#0B2A33]/75 leading-relaxed">
                  Our pharmacists can check your exact destination and advise which vaccines you need.
                </p>
                <div className="pt-1">
                  <a
                    href="tel:02088411585"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[#0F8B8D] hover:text-[#0B2A33] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#0F8B8D]" />
                    <span>020 8841 1585</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Accordion */}
            <div className="lg:col-span-7 space-y-4">
              {[
                {
                  q: 'How early should I book my travel vaccinations in Northolt?',
                  a: 'We recommend booking 6 to 8 weeks before departure. This allows time for vaccinations to build peak immunity. Last-minute travellers can contact the clinic for fast-track options.',
                },
                {
                  q: 'What vaccinations do I need for my holiday or business trip?',
                  a: 'Required and recommended vaccinations depend on your destination, planned activities, and medical history. Our pharmacists consult official WHO and NaTHNaC guidelines to advise you.',
                },
                {
                  q: 'Do I need a travel health consultation if I’ve had jabs before?',
                  a: 'Yes, because some vaccines require boosters after several years to maintain protection. Bring any past vaccination records and our pharmacists will check which ones are due.',
                },
                {
                  q: 'How much do travel vaccinations cost at the Northolt Travel Clinic?',
                  a: 'We provide competitive, transparent private pricing for all travel vaccines, antimalarials, and speciality injections. You can view our full vaccine price list on our website.',
                },
                {
                  q: 'Can I get multiple travel vaccines in one appointment?',
                  a: 'Yes, in most cases multiple vaccines can be safely administered in a single appointment, saving you time before your trip.',
                },
                {
                  q: 'Which areas does Northolt Travel Clinic serve?',
                  a: 'We serve Northolt, Yeading, Hayes, South Harrow, Rayners Lane, Greenford, Perivale, Ruislip, South Ruislip, Eastcote, Hillingdon, Ickenham, and Harrow.',
                },
              ].map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-[20px] border border-[#0B2A33]/10 overflow-hidden shadow-xs transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                    >
                      <span className="font-serif-display font-semibold text-base sm:text-lg text-[#0B2A33]">
                        {item.q}
                      </span>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                          isOpen ? 'bg-[#0F8B8D] text-white rotate-45' : 'bg-[#FAF7F2] text-[#0B2A33]'
                        }`}
                      >
                        <span className="text-xl leading-none font-light">+</span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6 pt-1 text-base text-[#0B2A33]/80 leading-relaxed border-t border-[#0B2A33]/5 animate-in fade-in duration-200">
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 11. FOOTER (Wave Pattern & Real Opening Hours Driver)                      */}
      {/* ========================================================================= */}
      <footer id="footer" className="bg-[#0B2A33] text-white relative pt-16 pb-12 overflow-hidden">
        {/* Subtle Wave Topographic Background Pattern at Low Opacity */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 Q 300 120 600 40 T 1200 40" fill="none" stroke="#2EC4B6" strokeWidth="2" />
            <path d="M0 100 Q 300 180 600 100 T 1200 100" fill="none" stroke="#2EC4B6" strokeWidth="2" />
            <path d="M0 160 Q 300 240 600 160 T 1200 160" fill="none" stroke="#2EC4B6" strokeWidth="2" />
          </svg>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 relative z-10">
          {/* Top Strip */}
          <div className="pb-12 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <span className="text-xs uppercase tracking-wider text-[#2EC4B6] font-bold block mb-1">
                Travel Health Advice
              </span>
              <div className="font-serif-display text-2xl md:text-3xl font-bold text-white">
                Questions before you fly? Call{' '}
                <a href="tel:02088411585" className="text-[#2EC4B6] hover:underline">
                  020 8841 1585
                </a>
              </div>
            </div>

            <button
              onClick={() => {
                setBookingConfirmed(false);
                setBookingStep(1);
                setBookingModalOpen(true);
              }}
              className="bg-[#FF7A59] hover:bg-[#F26744] text-white font-semibold text-base px-7 py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book appointment</span>
            </button>
          </div>

          {/* 4 Main Columns */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Col 1: Brand Blurb */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F8B8D] flex items-center justify-center text-white font-bold">
                  <Globe2 className="w-5 h-5 text-[#2EC4B6]" />
                </div>
                <div>
                  <span className="font-serif-display font-bold text-lg text-white block leading-none">
                    Northolt Travel Clinic
                  </span>
                  <span className="text-xs text-[#2EC4B6] font-medium uppercase tracking-wider">
                    Village Pharmacy
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Operated by Northolt Village Pharmacy. Delivering travel vaccinations, antimalarials, and expert advice across West London.
              </p>
            </div>

            {/* Col 2: Quick Links */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2EC4B6]">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <button onClick={() => scrollToSection('hero')} className="hover:text-white transition-colors cursor-pointer">
                    Home
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('about')} className="hover:text-white transition-colors cursor-pointer">
                    About Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">
                    Services
                  </button>
                </li>
                <li>
                  <button onClick={() => setPricingModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                    Vaccine Prices
                  </button>
                </li>
                <li>
                  <button onClick={() => setBookingModalOpen(true)} className="hover:text-white transition-colors cursor-pointer">
                    Book Appointment
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('footer')} className="hover:text-white transition-colors cursor-pointer">
                    Contact Us
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('faq')} className="hover:text-white transition-colors cursor-pointer">
                    Blog
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 3: Our Services */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2EC4B6]">Our Services</h4>
              <ul className="space-y-2 text-sm text-white/80">
                <li>
                  <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">
                    Travel Clinic
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">
                    Antimalarials
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">
                    Hajj and Umrah Vaccine
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">
                    Speciality Vaccines
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('services')} className="hover:text-white transition-colors cursor-pointer">
                    Vitamin B12 Injection
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Real Hours */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#2EC4B6]">Contact</h4>
              <div className="text-sm text-white/80 space-y-2">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#2EC4B6] shrink-0 mt-0.5" />
                  <span>32 Church Rd, Northolt, UB5 5AB</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#2EC4B6] shrink-0" />
                  <a href="tel:02088411585" className="hover:text-white transition-colors">020 8841 1585</a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#2EC4B6] shrink-0" />
                  <a href="mailto:pharmacy.faf65@nhs.net" className="hover:text-white transition-colors">pharmacy.faf65@nhs.net</a>
                </div>
              </div>

              {/* Today's Hours Live Indicator */}
              <div className="pt-3 border-t border-white/10 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-white">
                  <span className={`w-2.5 h-2.5 rounded-full ${livePharmacyStatus.isOpen ? 'bg-[#2EC4B6] animate-pulse' : 'bg-amber-400'}`} />
                  <span className="font-semibold">{livePharmacyStatus.text}</span>
                </div>
                <div className="text-sm text-white/70 space-y-0.5">
                  <div>Mon-Fri 9:00am-7:00pm</div>
                  <div>Sat 9:00am-2:00pm</div>
                  <div>Sunday and Bank Holidays closed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Policies */}
          <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/60">
            <div>
              © 2026 Northolt Travel Clinic. All rights reserved.
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">Terms and Conditions</a>
              <span>·</span>
              <a href="#" className="hover:text-white transition-colors">Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* EXTRA UX: Floating Mobile Bottom Bar                                       */}
      {/* ========================================================================= */}
      {isScrolled && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#0B2A33]/10 p-3 z-40 shadow-floating flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-200">
          <a
            href="tel:02088411585"
            className="flex-1 py-3 px-3 rounded-xl border border-[#0B2A33]/15 text-[#0B2A33] font-semibold text-sm flex items-center justify-center gap-1.5"
          >
            <Phone className="w-4 h-4 text-[#0F8B8D]" />
            <span>Call</span>
          </a>

          <button
            onClick={() => {
              setBookingConfirmed(false);
              setBookingStep(1);
              setBookingModalOpen(true);
            }}
            className="flex-1 py-3 px-3 rounded-xl bg-[#FF7A59] text-white font-semibold text-sm shadow-md flex items-center justify-center gap-1.5"
          >
            <Calendar className="w-4 h-4" />
            <span>Book</span>
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: Interactive Destination Requirements Checker                     */}
      {/* ========================================================================= */}
      {destinationModalOpen && selectedDestinationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 md:p-8 shadow-floating relative border border-[#0B2A33]/10 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setDestinationModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] text-[#0B2A33] flex items-center justify-center hover:bg-[#0B2A33] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#0F8B8D] uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4" />
              <span>Destination Health Advice</span>
            </div>

            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{selectedDestinationData.flag}</span>
              <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0B2A33]">
                {selectedDestinationData.name}
              </h3>
            </div>
            <div className="text-sm text-[#0B2A33]/70 mb-5">
              Region: {selectedDestinationData.region}
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold text-[#0B2A33] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-[#0F8B8D]" />
                <span>Entry / Visa Requirements</span>
              </div>
              {selectedDestinationData.mandatory.length > 0 ? (
                <div className="space-y-1.5">
                  {selectedDestinationData.mandatory.map((item, i) => (
                    <div key={i} className="text-sm bg-[#E6F6F6] text-[#0B2A33] border border-[#2EC4B6]/30 px-3.5 py-2.5 rounded-xl font-medium flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#0F8B8D] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-[#0B2A33]/75 bg-[#FAF7F2] px-3.5 py-2.5 rounded-xl">
                  No mandatory vaccinations required for standard UK tourist entry.
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="text-xs font-bold text-[#0B2A33] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0F8B8D]" />
                <span>Recommended Vaccinations</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedDestinationData.recommended.map((item, i) => (
                  <div key={i} className="text-sm bg-[#E6F6F6] text-[#0B2A33] px-3 py-2 rounded-xl font-medium flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#0F8B8D] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#0B2A33]/8 text-sm space-y-1.5 mb-6">
              <div className="font-bold text-[#0B2A33] flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-[#0F8B8D]" />
                <span>Malaria: {selectedDestinationData.malariaRisk ? 'Risk present in certain areas' : 'Low / minimal risk'}</span>
              </div>
              <p className="text-[#0B2A33]/80 leading-relaxed">
                {selectedDestinationData.notes}
              </p>
            </div>

            <button
              onClick={() => {
                setDestinationModalOpen(false);
                setBookingData((prev) => ({
                  ...prev,
                  destination: selectedDestinationData.name,
                  service: `Travel Clinic Consultation (${selectedDestinationData.name})`,
                }));
                setBookingConfirmed(false);
                setBookingStep(1);
                setBookingModalOpen(true);
              }}
              className="w-full bg-[#FF7A59] hover:bg-[#F26744] text-white text-base font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Book consultation for {selectedDestinationData.name}</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: Appointment Booking Wizard                                       */}
      {/* ========================================================================= */}
      {bookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 md:p-8 shadow-floating relative border border-[#0B2A33]/10 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setBookingModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] text-[#0B2A33] flex items-center justify-center hover:bg-[#0B2A33] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingConfirmed ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#E6F6F6] text-[#0F8B8D] flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-[#0B2A33]">
                  Appointment Request Received
                </h3>
                <p className="text-base text-[#0B2A33]/80 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{bookingData.patientName || 'Traveler'}</strong>. Your appointment request for{' '}
                  <strong>{bookingData.service}</strong> has been logged for{' '}
                  <strong>{bookingData.preferredTime} on {bookingData.departureDate}</strong> at Northolt Village Pharmacy.
                </p>

                <div className="p-4 rounded-2xl bg-[#FAF7F2] text-sm text-left space-y-2 border border-[#0B2A33]/8">
                  <div className="flex justify-between">
                    <span className="text-[#0B2A33]/70">Location:</span>
                    <span className="font-semibold text-[#0B2A33]">32 Church Rd, Northolt, UB5 5AB</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#0B2A33]/70">Questions?</span>
                    <span className="font-semibold text-[#0F8B8D]">020 8841 1585</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setBookingModalOpen(false)}
                    className="w-full bg-[#0B2A33] hover:bg-[#0F8B8D] text-white text-base font-semibold py-3.5 rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F8B8D] uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>Northolt Travel Clinic</span>
                </div>
                <h3 className="font-serif-display text-2xl font-bold text-[#0B2A33] mb-1">
                  Book appointment
                </h3>
                <p className="text-sm text-[#0B2A33]/70 mb-6">
                  Select your service and preferred date.
                </p>

                <div className="flex items-center justify-between mb-6 border-b border-[#0B2A33]/10 pb-3 text-sm">
                  <span className={`font-semibold ${bookingStep >= 1 ? 'text-[#0F8B8D]' : 'text-[#0B2A33]/40'}`}>
                    1. Service
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#0B2A33]/30" />
                  <span className={`font-semibold ${bookingStep >= 2 ? 'text-[#0F8B8D]' : 'text-[#0B2A33]/40'}`}>
                    2. Date & Time
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#0B2A33]/30" />
                  <span className={`font-semibold ${bookingStep >= 3 ? 'text-[#0F8B8D]' : 'text-[#0B2A33]/40'}`}>
                    3. Details
                  </span>
                </div>

                {bookingStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0B2A33] mb-1.5">Select Service</label>
                      <select
                        value={bookingData.service}
                        onChange={(e) => setBookingData({ ...bookingData, service: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#0B2A33]/15 rounded-xl px-4 py-3 text-base text-[#0B2A33] focus:outline-none focus:ring-2 focus:ring-[#0F8B8D]"
                      >
                        <option value="Travel Clinic Consultation">Travel Clinic Consultation</option>
                        <option value="Hajj and Umrah Vaccine">Hajj and Umrah Vaccine (ACWY)</option>
                        <option value="Antimalarials Consultation">Antimalarials</option>
                        <option value="Vitamin B12 Injection Service">Vitamin B12 Injection Service</option>
                        <option value="Speciality Vaccines">Speciality Vaccines</option>
                        <option value="Private COVID Vaccination">Private COVID Vaccination</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0B2A33] mb-1.5">Destination Country</label>
                      <input
                        type="text"
                        placeholder="e.g. Thailand, Kenya, India..."
                        value={bookingData.destination}
                        onChange={(e) => setBookingData({ ...bookingData, destination: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#0B2A33]/15 rounded-xl px-4 py-3 text-base text-[#0B2A33] focus:outline-none focus:ring-2 focus:ring-[#0F8B8D]"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => setBookingStep(2)}
                      className="w-full mt-4 bg-[#0F8B8D] hover:bg-[#0B6B6D] text-white text-base font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Continue to Date & Time</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0B2A33] mb-1.5">Preferred Date</label>
                      <input
                        type="date"
                        value={bookingData.departureDate}
                        onChange={(e) => setBookingData({ ...bookingData, departureDate: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#0B2A33]/15 rounded-xl px-4 py-3 text-base text-[#0B2A33] focus:outline-none focus:ring-2 focus:ring-[#0F8B8D]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0B2A33] mb-1.5">Preferred Time</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['09:30 AM', '10:30 AM', '11:45 AM', '02:15 PM', '04:00 PM', '06:15 PM'].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingData({ ...bookingData, preferredTime: slot })}
                            className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                              bookingData.preferredTime === slot
                                ? 'bg-[#0F8B8D] text-white border-[#0F8B8D] shadow-sm'
                                : 'bg-[#FAF7F2] text-[#0B2A33] border-transparent hover:border-[#0F8B8D]/30'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setBookingStep(1)}
                        className="w-1/3 bg-[#FAF7F2] text-[#0B2A33] text-sm font-semibold py-3.5 rounded-xl"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingStep(3)}
                        className="w-2/3 bg-[#0F8B8D] hover:bg-[#0B6B6D] text-white text-base font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>Continue</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {bookingStep === 3 && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-[#0B2A33] mb-1.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Jane Smith"
                        value={bookingData.patientName}
                        onChange={(e) => setBookingData({ ...bookingData, patientName: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#0B2A33]/15 rounded-xl px-4 py-3 text-base text-[#0B2A33] focus:outline-none focus:ring-2 focus:ring-[#0F8B8D]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0B2A33] mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="e.g. 07700 900123"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#0B2A33]/15 rounded-xl px-4 py-3 text-base text-[#0B2A33] focus:outline-none focus:ring-2 focus:ring-[#0F8B8D]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-[#0B2A33] mb-1.5">Email Address</label>
                      <input
                        type="email"
                        placeholder="e.g. jane@example.com"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        className="w-full bg-[#FAF7F2] border border-[#0B2A33]/15 rounded-xl px-4 py-3 text-base text-[#0B2A33] focus:outline-none focus:ring-2 focus:ring-[#0F8B8D]"
                      />
                    </div>

                    <div className="flex gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => setBookingStep(2)}
                        className="w-1/3 bg-[#FAF7F2] text-[#0B2A33] text-sm font-semibold py-3.5 rounded-xl"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={() => setBookingConfirmed(true)}
                        className="w-2/3 bg-[#FF7A59] hover:bg-[#F26744] text-white text-base font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md"
                      >
                        <Check className="w-4 h-4" />
                        <span>Confirm Appointment</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: Vaccine Prices Schedule Modal                                     */}
      {/* ========================================================================= */}
      {pricingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] max-w-xl w-full p-6 md:p-8 shadow-floating relative border border-[#0B2A33]/10 max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => setPricingModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FAF7F2] text-[#0B2A33] flex items-center justify-center hover:bg-[#0B2A33] hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-[#0F8B8D] uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4" />
              <span>Northolt Travel Clinic</span>
            </div>
            <h3 className="font-serif-display text-2xl sm:text-3xl font-bold text-[#0B2A33]">
              Vaccine Prices
            </h3>
            <p className="text-sm text-[#0B2A33]/70 mb-6">
              Contact our clinic at 32 Church Road or call 020 8841 1585 for up-to-date pricing and appointment availability.
            </p>

            <div className="space-y-3">
              {[
                { name: 'Typhoid', service: 'Travel Vaccination' },
                { name: 'Hepatitis A', service: 'Travel Vaccination' },
                { name: 'Hepatitis B', service: 'Travel & Occupational' },
                { name: 'Meningitis ACWY', service: 'Hajj & Umrah' },
                { name: 'Rabies', service: 'Travel Vaccination' },
                { name: 'Japanese Encephalitis', service: 'Travel Vaccination' },
                { name: 'Tick-Borne Encephalitis', service: 'Speciality Vaccination' },
                { name: 'Vitamin B12 Injection', service: 'Wellness Service' },
                { name: 'Private COVID Vaccination', service: 'Vaccination Service' },
                { name: 'Antimalarials', service: 'Travel Health Protection' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5 px-3.5 rounded-xl bg-[#FAF7F2] text-sm">
                  <span className="font-semibold text-[#0B2A33]">{item.name}</span>
                  <span className="text-[#0B2A33]/70 font-medium">{item.service}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-[#0B2A33]/10 flex flex-wrap items-center justify-between gap-4">
              <span className="text-sm text-[#0B2A33]/70">
                Walk in or book in advance on Church Rd.
              </span>
              <button
                onClick={() => {
                  setPricingModalOpen(false);
                  setBookingConfirmed(false);
                  setBookingStep(1);
                  setBookingModalOpen(true);
                }}
                className="bg-[#FF7A59] hover:bg-[#F26744] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-md"
              >
                Book appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
