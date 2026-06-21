"use client";

import React from "react";
import { NavBar } from "@/components/ds/NavBar";
import { Hero } from "@/components/sections/Hero";
import { Divisions } from "@/components/sections/Divisions";
import { Shisha } from "@/components/sections/Shisha";
import { Shop } from "@/components/sections/Shop";
import { FlavorOS } from "@/components/sections/FlavorOS";
import { Technology } from "@/components/sections/Technology";
import { CompanyContact, Footer } from "@/components/sections/CompanyContact";

export default function Page() {
  const [active, setActive] = React.useState("home");

  const go = (key: string) => {
    setActive(key);
    const id = key === "home" ? null : key;
    if (!id) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el)
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 64,
        behavior: "smooth",
      });
  };

  React.useEffect(() => {
    const ids = ["shisha", "shop", "flavor-os", "technology", "company"];
    const onScroll = () => {
      const y = window.scrollY + 120;
      let cur = "home";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= y) cur = id;
      }
      setActive(cur);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div>
      <div className="navwrap">
        <NavBar active={active} onNavigate={go} />
      </div>
      <Hero onNavigate={go} />
      <Divisions onNavigate={go} />
      <Shisha onNavigate={go} />
      <Shop onNavigate={go} />
      <FlavorOS onNavigate={go} />
      <Technology onNavigate={go} />
      <CompanyContact />
      <Footer onNavigate={go} />
    </div>
  );
}
