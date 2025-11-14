"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigationState } from "@/hooks/useNavigationState";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/hooks/use-translations";

interface SecondaryNavProps {
  activeMenuObj: any;
}

const subLinkVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

export const SecondaryNav: React.FC<SecondaryNavProps> = ({
  activeMenuObj,
}) => {
  const { t } = useTranslations();
  const [currentPath, setCurrentPath] = React.useState("");
  const pathname = usePathname();
  const { secondaryLinks: storeSecondary, activeMenuId: selectedMenuId } =
    useNavigationState();
  React.useEffect(() => {
    setCurrentPath(pathname);
  }, [pathname]);
  const secondaryLinks =
    storeSecondary && storeSecondary.length > 0
      ? storeSecondary
      : activeMenuObj?.secondary || [];
  if (!secondaryLinks || secondaryLinks.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-sidebar border-t h-fit pt-1 pb-0.5 px-6 flex items-baseline space-x-2">
      {secondaryLinks.map((item: any, idx: number) => {
        const isRouteActive = pathname === item.href;
        const isMenuSelected = activeMenuObj?.id && selectedMenuId === activeMenuObj.id;
        const key = item.href || item.label || `sub-link-${idx}`;
        let displayLabel: string = item.label;
        if (item.labelKey) {
          displayLabel = t(item.labelKey);
        } else if (
          activeMenuObj?.secondary &&
          activeMenuObj.secondary.length > 0
        ) {
          const found = activeMenuObj.secondary.find(
            (s: any) => s.href === item.href || s.label === item.label
          );
          if (found?.labelKey) displayLabel = t(found.labelKey);
        }

        const linkClass = isRouteActive
          ? "text-primary font-semibold"
          : isMenuSelected
          ? "font-medium"
          : "text-muted-foreground";

        return (
          <motion.div key={key} variants={subLinkVariant}>
            <Link
              href={item.href}
              aria-current={isRouteActive ? "page" : undefined}
              className={cn(
                "p-1 font-medium text-xs transition-all text-nowrap hover:text-primary block relative",
                linkClass
              )}
            >
              {displayLabel}
              {isRouteActive && (
                <span className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
};
