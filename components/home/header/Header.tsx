"use client";

import { homePageHeaderLinks } from "@/lib/constants";
import { useIsVisible } from "@/hooks/useIsVisible";
import { HeaderLink } from "./HeaderLink";
import { ImagesCarousel } from "../carousel/ImagesCarousel";
import { homePageHeaderImgs } from "@/lib/constants";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const Header = () => {
  const { isVisible, ref } = useIsVisible();
  const t = useTranslations("hero");
  
  return (
    <header className="flex flex-col items-center mt-20 w-full relative isolate group">
      <div className="text-center mt-10">
        <h1
          ref={ref}
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 text-white drop-shadow-2xl"
        >
          <span className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent">
            Transform Your Workflow
          </span>
          <br />
          <span className="text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            with AI-Powered Productivity
          </span>
        </h1>
        <p className="text-xl sm:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-lg">
          Join thousands of professionals who are already boosting their efficiency with Prodify's intelligent task management and collaboration tools.
        </p>
        <Link href="/en/sign-up">
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl text-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-2xl">
            Start Your Free Trial
          </button>
        </Link>
      </div>
      <div className="w-full flex flex-wrap items-center justify-center mt-12 gap-2 sm:gap-4">
        {homePageHeaderLinks.map((link, i) => (
          <HeaderLink
            key={i}
            Icon={link.Icon}
            href={link.href}
            titleKey={link.titleKey}
          />
        ))}
      </div>

      <ImagesCarousel
        images={homePageHeaderImgs}
        className="mt-28 h-[40rem] z-20 relative bg-background"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className={`relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#e74b4b] to-[#a50505]  sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] group-hover:opacity-80 dark:group-hover:opacity-60 transition-opacity duration-500 ${
            isVisible
              ? "opacity:80 dark:opacity-60"
              : "opacity-40 dark:opacity-30"
          }`}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-36 "
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className={`relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#e74b4b] to-[#a50505]  sm:left-[calc(50%-30rem)] sm:w-[72.1875rem] group-hover:opacity-80 dark:group-hover:opacity-60 transition-opacity duration-500 ${
            isVisible
              ? "opacity:80 dark:opacity-60"
              : "opacity-40 dark:opacity-30"
          }`}
        />
      </div>
    </header>
  );
};


