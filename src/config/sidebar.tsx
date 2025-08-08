import {
  HomeIcon,
  DocumentDuplicateIcon,
  ClipboardDocumentIcon,
  ShoppingBagIcon,
  CogIcon,
  CommandLineIcon,
} from "@heroicons/react/24/outline";

export type SidebarRoute = {
  id: string;
  label: string;
  href: string;
  Icon: React.ComponentType<React.ComponentProps<"svg">>;
  activeMatch?: "exact" | "startsWith";
};

export const SIDEBAR_ROUTES: SidebarRoute[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    Icon: HomeIcon,
    activeMatch: "exact",
  },
  {
    id: "clones",
    label: "My Clones",
    href: "/clones",
    Icon: DocumentDuplicateIcon,
    activeMatch: "exact",
  },
  {
    id: "templates",
    label: "Templates",
    href: "/templates",
    Icon: ClipboardDocumentIcon,
    activeMatch: "exact",
  },
  {
    id: "studio",
    label: "Studio",
    href: "/studio",
    Icon: CommandLineIcon,
    activeMatch: "exact",
  },
  {
    id: "marketplace",
    label: "Marketplace",
    href: "/marketplace",
    Icon: ShoppingBagIcon,
    activeMatch: "exact",
  },
  {
    id: "settings",
    label: "Settings",
    href: "/studio/settings",
    Icon: CogIcon,
    activeMatch: "startsWith",
  },
];
