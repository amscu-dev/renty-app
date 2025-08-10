import { usePathname } from "next/navigation";
import React from "react";
import {
  Building,
  FileText,
  Heart,
  Home,
  Menu,
  Settings,
  X,
} from "lucide-react";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";

const AppSidebar = ({ userType }: AppSidebarProps) => {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();

  const navLinks =
    userType === "manager"
      ? [
          { icon: Building, label: "Properties", href: "/managers/properties" },
          {
            icon: FileText,
            label: "Applications",
            href: "/managers/applications",
          },
          { icon: Settings, label: "Settings", href: "/managers/settings" },
        ]
      : [
          { icon: Heart, label: "Favorites", href: "/tenants/favorites" },
          {
            icon: FileText,
            label: "Applications",
            href: "/tenants/applications",
          },
          { icon: Home, label: "Residences", href: "/tenants/residences" },
          { icon: Settings, label: "Settings", href: "/tenants/settings" },
        ];

  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      className="left-7 p-0 shadow-xl"
      style={{
        top: `75px`,
        height: `87%`,
      }}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div
              className={cn(
                "mb-3 flex min-h-[56px] w-full items-center pt-3",
                open ? "justify-between px-6" : "justify-center",
              )}
            >
              {open ? (
                <>
                  <h1 className="text-xl font-bold text-gray-800">
                    {userType === "manager" ? "Manager View" : "Renter View"}
                  </h1>
                  <button
                    className="rounded-md p-2 hover:bg-gray-100"
                    onClick={() => toggleSidebar()}
                  >
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              ) : (
                <button
                  className="rounded-md p-2 hover:bg-gray-100"
                  onClick={() => toggleSidebar()}
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
              )}
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu className={cn(open ? "" : "translate-x-2 space-y-4")}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <SidebarMenuItem key={link.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "flex items-center px-7 py-7",
                    isActive ? "bg-gray-100" : "hover:bg-gray-100",
                    open ? "text-blue-600" : "ml-[5px] p-0",
                  )}
                >
                  <Link href={link.href} className="w-full" scroll={false}>
                    <div className="flex items-center justify-center gap-3">
                      <link.icon
                        className={`h-5 w-5 ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-700 group-hover/menu-item:text-slate-950"
                        }`}
                      />
                      <span
                        className={`font-medium ${
                          isActive
                            ? "text-blue-600"
                            : "text-slate-700 group-hover/menu-item:text-slate-950"
                        }`}
                      >
                        {link.label}
                      </span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
