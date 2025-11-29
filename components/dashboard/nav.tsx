"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  DollarSign,
  Clock,
  Settings,
  Key,
  UserCog,
  ScrollText,
  Server,
  User,
} from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  requiredRoles?: string[]
}

const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "My Profile", href: "/dashboard/profile", icon: User },
  { title: "My Payroll", href: "/dashboard/payroll", icon: DollarSign },
  { title: "Access Requests", href: "/dashboard/access-requests", icon: Key },
  { title: "Leave Requests", href: "/dashboard/leave", icon: Clock },
  { title: "My Documents", href: "/dashboard/documents", icon: FileText },
  {
    title: "User Management",
    href: "/dashboard/admin/users",
    icon: Users,
    requiredRoles: ["System Administrator", "HR Manager"],
  },
  {
    title: "Role Management",
    href: "/dashboard/admin/roles",
    icon: UserCog,
    requiredRoles: ["System Administrator"],
  },
  {
    title: "Access Policies",
    href: "/dashboard/admin/policies",
    icon: Shield,
    requiredRoles: ["System Administrator"],
  },
  {
    title: "Payroll Admin",
    href: "/dashboard/admin/payroll",
    icon: DollarSign,
    requiredRoles: ["System Administrator", "HR Manager", "Finance Manager", "Payroll Manager"],
  },
  {
    title: "Audit Logs",
    href: "/dashboard/admin/audit",
    icon: ScrollText,
    requiredRoles: ["System Administrator", "Security Auditor"],
  },
  {
    title: "System Status",
    href: "/dashboard/admin/system",
    icon: Server,
    requiredRoles: ["System Administrator"],
  },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
]

interface DashboardNavProps {
  userRoles: string[]
}

export function DashboardNav({ userRoles }: DashboardNavProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) => {
    if (!item.requiredRoles) return true
    return item.requiredRoles.some((role) => userRoles.includes(role))
  })

  // Separate admin items
  const regularItems = filteredNavItems.filter((item) => !item.href.includes("/admin/"))
  const adminItems = filteredNavItems.filter((item) => item.href.includes("/admin/"))

  return (
    <nav className="w-64 min-h-[calc(100vh-4rem)] border-r bg-card p-4">
      <div className="space-y-1">
        {regularItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </div>

      {adminItems.length > 0 && (
        <>
          <div className="my-4 border-t" />
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Administration
          </div>
          <div className="space-y-1">
            {adminItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
        </>
      )}
    </nav>
  )
}
