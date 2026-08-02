"use client";

import React from "react";
import { useIndustryRole, IndustryRole } from "../providers/IndustryRoleProvider";
import { Building2, Pickaxe, Map, UserCircle, Settings, Home, Trees, Factory } from "lucide-react";

export function RoleSwitcher() {
  const { currentRole, setRole } = useIndustryRole();
  const [isOpen, setIsOpen] = React.useState(false);

  const roles: { value: IndustryRole; label: string; icon: React.ReactNode }[] = [
    { value: "LAND_INVESTOR", label: "Land Investor", icon: <Map className="w-4 h-4 text-emerald-400" /> },
    { value: "LANDMAN", label: "Landman (Energy)", icon: <Pickaxe className="w-4 h-4 text-amber-500" /> },
    { value: "COMMERCIAL_BROKER", label: "Commercial Broker", icon: <Building2 className="w-4 h-4 text-indigo-400" /> },
    { value: "PROPERTY_MANAGER", label: "Property Manager", icon: <Settings className="w-4 h-4 text-slate-400" /> },
    { value: "RESIDENTIAL_REALTOR", label: "Residential Realtor", icon: <Home className="w-4 h-4 text-sky-400" /> },
    { value: "DEVELOPER", label: "Developer", icon: <Factory className="w-4 h-4 text-orange-400" /> },
    { value: "RENEWABLE_DEVELOPER", label: "Renewable Energy", icon: <Trees className="w-4 h-4 text-lime-400" /> }
  ];

  const current = roles.find(r => r.value === currentRole) || roles[0];

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors text-sm text-slate-200"
      >
        {current.icon}
        <span className="font-medium">{current.label}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-xl py-1 overflow-hidden">
          <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-950/50">
            Switch Workspace
          </div>
          {roles.map((role) => (
            <button
              key={role.value}
              onClick={() => {
                setRole(role.value);
                setIsOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 text-sm text-left transition-colors ${
                currentRole === role.value 
                  ? "bg-indigo-600/20 text-white" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {role.icon}
              {role.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
