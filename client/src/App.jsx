import React from 'react';
import LaunchSequence from './components/LaunchSequence';
import CustomCursor from './components/CustomCursor';
import Navbar from './components/Navbar';
import HeroSolarSystem from './components/HeroSolarSystem';
import CrystalVision from './components/CrystalVision';
import ServicesCards from './components/ServicesCards';
import DeliveredMetrics from './components/DeliveredMetrics';
import AboutTeam from './components/AboutTeam';
import Footer from './components/Footer';
import RegistrationForm from './components/RegistrationForm';
import AdminPanel from './components/AdminPanel';

// New Components
import BanaviAeBrandIntro from './components/BanaviAeBrandIntro';
import SecretBusiness from './components/SecretBusiness';
import BusinessCategories from './components/BusinessCategories';
import LiveEditing from './components/LiveEditing';
import PreRecorded from './components/PreRecorded';
import AfterEvent from './components/AfterEvent';
import WhoNotFor from './components/WhoNotFor';
import UpcomingWorkshops from './components/UpcomingWorkshops';
import PricingSection from './components/PricingSection';
import FaqSection from './components/FaqSection';
import FinalCTA from './components/FinalCTA';

function App() {
  const path = window.location.pathname;

  if (path === '/admin') {
    return <AdminPanel />;
  }
  return (
    <>
      <LaunchSequence />
      <CustomCursor />
      <Navbar />
      
      <main>
        <HeroSolarSystem />
        <BanaviAeBrandIntro />
        <CrystalVision />
        <SecretBusiness />
        <BusinessCategories />
        <DeliveredMetrics />
        <LiveEditing />
        <PreRecorded />
        <AfterEvent />
        <ServicesCards />
        <WhoNotFor />
        <AboutTeam />
        <UpcomingWorkshops />
        <PricingSection />
        <FaqSection />
        
        <section id="register" className="py-24 bg-site-bg relative flex justify-center px-4">
          <RegistrationForm />
        </section>
        
        <FinalCTA />
      </main>

      <Footer />
    </>
  );
}

export default App;
