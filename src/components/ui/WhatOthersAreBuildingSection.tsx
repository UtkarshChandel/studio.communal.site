"use client";

import SectionHeading from "./SectionHeading";
import AIAssistantCard from "./AIAssistantCard";
import {
  RocketIcon,
  UploadIcon,
  StarIcon,
  NetworkIcon,
  UserIcon,
} from "./AssistantIcons";

interface WhatOthersAreBuildingSectionProps {
  className?: string;
}

export default function WhatOthersAreBuildingSection({
  className = "",
}: WhatOthersAreBuildingSectionProps) {
  const assistants = [
    {
      name: "Dr. Ray Titus",
      role: "Startups",
      description:
        "Ray Titus is a serial entrepreneur and investor. He is the founder of several startups, including Ray Titus Startups, which is a platform for startups to find investors and mentors.",
      image: "/profiles/ray-titus-startups.png",
      floatingIcons: [
        // {
        //   icon: <RocketIcon />,
        //   position: { top: "-12px", left: "20px" },
        //   size: "md" as const,
        // },
        // {
        //   icon: <UploadIcon />,
        //   position: { top: "20px", right: "-12px" },
        //   size: "md" as const,
        // },
        // {
        //   icon: <StarIcon />,
        //   position: { bottom: "40px", left: "-16px" },
        //   size: "sm" as const,
        // },
        // {
        //   icon: <NetworkIcon />,
        //   position: { bottom: "-8px", left: "60px" },
        //   size: "sm" as const,
        // },
        // {
        //   icon: <UserIcon />,
        //   position: { bottom: "20px", right: "20px" },
        //   size: "sm" as const,
        // },
      ],
    },
    {
      name: "Bhupesh Manoharan",
      role: "Marketeer",
      description:
        "Your AI assistant learns from your docs, meetings, and chats and always stays up to date.",
      image: "/profiles/bhupesh-manoharan-marketting.png",

      floatingIcons: [
        // {
        //   icon: <RocketIcon />,
        //   position: { top: "-8px", left: "30px" },
        //   size: "md" as const,
        // },
        // {
        //   icon: <UploadIcon />,
        //   position: { top: "30px", right: "-8px" },
        //   size: "md" as const,
        // },
        // {
        //   icon: <StarIcon />,
        //   position: { bottom: "50px", left: "-12px" },
        //   size: "sm" as const,
        // },
        // {
        //   icon: <NetworkIcon />,
        //   position: { bottom: "10px", left: "50px" },
        //   size: "sm" as const,
        // },
        // {
        //   icon: <UserIcon />,
        //   position: { bottom: "30px", right: "30px" },
        //   size: "sm" as const,
        // },
      ],
    },
    {
      name: "Siddhart Menon",
      role: "Strategist",
      description:
        "Ask siddhart for startup strategy and consulting, on market research primary and secondary, communication, leadership, research, data analysis, and more.",
      image: "/profiles/sid-menon.png",
      floatingIcons: [
        // {
        //   icon: <RocketIcon />,
        //   position: { top: "-10px", left: "25px" },
        //   size: "md" as const,
        // },
        // {
        //   icon: <UploadIcon />,
        //   position: { top: "25px", right: "-10px" },
        //   size: "md" as const,
        // },
        // {
        //   icon: <StarIcon />,
        //   position: { bottom: "45px", left: "-14px" },
        //   size: "sm" as const,
        // },
        // {
        //   icon: <NetworkIcon />,
        //   position: { bottom: "5px", left: "55px" },
        //   size: "sm" as const,
        // },
        // {
        //   icon: <UserIcon />,
        //   position: { bottom: "25px", right: "25px" },
        //   size: "sm" as const,
        // },
      ],
    },
  ];

  return (
    <section className={`py-24 z-100 px-4 ${className}`}>
      <div className="max-w-7xl mx-auto z-100">
        {/* Section Heading */}
        <SectionHeading
          title="What Others Are Building"
          subtitle="Communal AI connects the dots across your tools, remembers what matters, and suggests the next move all so you can move faster with less effort."
        />

        {/* AI Assistant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 items-stretch">
          {assistants.map((assistant, index) => (
            <AIAssistantCard
              key={index}
              name={assistant.name}
              role={assistant.role}
              description={assistant.description}
              image={assistant.image}
              floatingIcons={assistant.floatingIcons}
              className="mx-auto max-w-sm h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
