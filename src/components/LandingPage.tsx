import React from "react";
import Navbar from "./Navbar";
import Hero from "./Hero";
import ResumeModes from "./ResumeModes";
import Features from "./Features";
import HowItWorks from "./HowItWorks";
import CTA from "./CTA";
import Footer from "./Footer";

interface LandingPageProps {
  setCurrentView: (view: "home" | "editor" | "ats") => void;
  setShowUploadModal: (show: boolean) => void;
  setResumeData: (data: any) => void;
  defaultResumeData: any;
  configStatus: any;
}

export default function LandingPage({
  setCurrentView,
  setShowUploadModal,
  setResumeData,
  defaultResumeData,
  configStatus,
}: LandingPageProps) {
  const onLaunchEditor = () => {
    setResumeData(defaultResumeData);
    setCurrentView("editor");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onLaunchATS = () => {
    setCurrentView("ats");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex-1 flex flex-col bg-[#000000] text-[#F2F1ED] font-sans relative overflow-x-hidden selection:bg-blue-900/40 selection:text-white">
      <Navbar onLaunchEditor={onLaunchEditor} onLaunchATS={onLaunchATS} />
      <Hero onLaunchEditor={onLaunchEditor} configStatus={configStatus} />
      <ResumeModes
        setCurrentView={setCurrentView}
        setShowUploadModal={setShowUploadModal}
        setResumeData={setResumeData}
      />
      <Features />
      <HowItWorks />
      <CTA onLaunchEditor={onLaunchEditor} />
      <Footer onLaunchEditor={onLaunchEditor} onLaunchATS={onLaunchATS} />
    </div>
  );
}
