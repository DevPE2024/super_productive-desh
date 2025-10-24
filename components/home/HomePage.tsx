"use client";
import {
  homePageAssignmentFilterAndStarredImgs,
  homePageCalendarImgs,
  homePageChatImgs,
  homePageMindMapsImgs,
  homePagePomodoroImgs,
  homePageRolesAndSettingsImgs,
  homePageTasksImgs,
  homePageAffinifyEcosystemImgs,
} from "@/lib/constants";
import { Header } from "./header/Header";
import { Nav } from "./nav/Nav";
import { Section } from "./section/Section";
import { TextSection } from "./section/TextSection";
import { Footer } from "./footer/Footer";
import { useTranslations } from "next-intl";

export const HomePage = () => {
  const t = useTranslations("sections");
  
  return (
    <>
      <Nav />
      <div className="w-full mx-auto max-w-screen-xl px-4 sm:px-6">
        <Header />
        <main>
          <Section
            id="Affinify-Ecosystem"
            title={t("affinify_ecosystem.title")}
            desc={t("affinify_ecosystem.desc")}
            images={homePageAffinifyEcosystemImgs}
          />

          <TextSection
            title={t("productivity_partner.title")}
            desc={t("productivity_partner.desc")}
          />

          <Section
            id="Mind-Maps"
            title={t("mind_maps.title")}
            desc={t("mind_maps.desc")}
            images={homePageMindMapsImgs}
            reverse
          />

          <Section
            id="Tasks"
            title={t("tasks.title")}
            desc={t("tasks.desc")}
            images={homePageTasksImgs}
          />
          <Section
            id="Roles"
            title={t("roles.title")}
            desc={t("roles.desc")}
            images={homePageRolesAndSettingsImgs}
          />
          <Section
            id="Pomodoro"
            title={t("pomodoro.title")}
            desc={t("pomodoro.desc")}
            images={homePagePomodoroImgs}
            reverse
          />
          <TextSection
            title={t("collaboration.title")}
            desc={t("collaboration.desc")}
          />

          <Section
            id="Chat"
            title={t("chat.title")}
            desc={t("chat.desc")}
            images={homePageChatImgs}
          />

          <Section
            id="Calendar"
            title={t("calendar.title")}
            desc={t("calendar.desc")}
            images={homePageCalendarImgs}
            reverse
          />

          <Section
            id="Filters"
            title={t("filters.title")}
            desc={t("filters.desc")}
            images={homePageAssignmentFilterAndStarredImgs}
          />
        </main>
      </div>
      <Footer />
    </>
  );
};


