import {
  LayoutDashboard, Map, MapPin, Search, Compass, Calculator, Target, Users, Briefcase, LineChart, ShieldCheck, Zap, Pickaxe, Building2, Settings, Home, Trees, Factory, BookOpen, Clock, AlertTriangle, FileText, FolderKanban, Scale, FileCheck, Layers, Sun, Receipt, Sparkles, GraduationCap, ArrowRight, Hammer, Truck, CheckSquare, DollarSign, Wallet, Phone, MessageSquare, Plus, Edit, Share2, Printer, Download, CreditCard, Box, Key, Wrench, Calendar, ClipboardList
} from 'lucide-react';
import React from 'react';

export type WorkspaceType = 
  | "LAND_INVESTOR" 
  | "LANDMAN_ENERGY" 
  | "COMMERCIAL_BROKER" 
  | "PROPERTY_MANAGER" 
  | "RESIDENTIAL_REALTOR" 
  | "DEVELOPER" 
  | "RENEWABLE_ENERGY";

export interface NavItem {
  label: string;
  href: string;
  icon: any;
}

export interface WorkspaceDefinition {
  type: WorkspaceType;
  label: string;
  icon: any;
  themeColor: string; // Tailwind color class like 'text-emerald-400'
  navigation: NavItem[];
  dashboardComponent: string;
  quickActions: string[];
  propertyTabs: string[];
  aiSystemContext: string;
}

export const workspaceRegistry: Record<WorkspaceType, WorkspaceDefinition> = {
  LAND_INVESTOR: {
    type: "LAND_INVESTOR",
    label: "Land Investor",
    icon: Map,
    themeColor: "text-emerald-400",
    dashboardComponent: "LandInvestorDashboard",
    quickActions: ["Find land", "Analyze property", "Contact owner", "Generate offer", "Run due diligence", "Find buyers", "Create listing", "Compare exit strategies"],
    propertyTabs: ["Overview", "Comps", "Valuation", "Seller", "Offer", "Access", "Flood", "Wetlands", "Utilities", "Due Diligence", "Marketing", "Financials", "Timeline"],
    aiSystemContext: "You are an AI assistant for a Land Investor. Focus on finding undervalued land, maximum allowable offer, resale value, acquisition risk, seller motivation, and owner-finance opportunities.",
    navigation: [
      { label: 'Home', href: '/', icon: LayoutDashboard },
      { label: 'Discover Land', href: '/discover', icon: Compass },
      { label: 'Map', href: '/map', icon: MapPin },
      { label: 'Properties', href: '/properties', icon: Home },
      { label: 'Sellers', href: '/sellers', icon: Users },
      { label: 'Pipeline', href: '/pipeline', icon: ArrowRight },
      { label: 'Underwriting', href: '/underwriting', icon: Calculator },
      { label: 'Due Diligence', href: '/diligence', icon: ShieldCheck },
      { label: 'Offers', href: '/offers', icon: FileText },
      { label: 'Transactions', href: '/transactions', icon: Briefcase },
      { label: 'Buyers', href: '/buyers', icon: Target },
      { label: 'Marketing', href: '/marketing', icon: Sparkles },
      { label: 'Portfolio', href: '/portfolio', icon: Layers },
      { label: 'Reports', href: '/reports', icon: LineChart },
      { label: 'Automations', href: '/automations', icon: Settings },
    ]
  },
  LANDMAN_ENERGY: {
    type: "LANDMAN_ENERGY",
    label: "Landman (Energy)",
    icon: Pickaxe,
    themeColor: "text-amber-500",
    dashboardComponent: "LandmanDashboard",
    quickActions: ["Create project", "Add tract", "Upload instrument", "Add runsheet entry", "Calculate ownership", "Create curative item", "Generate ownership report", "Start lease acquisition", "Submit time and expenses"],
    propertyTabs: ["Tract Summary", "Parcels", "Surface Ownership", "Mineral Ownership", "Title Chain", "Runsheet", "Leases", "Depths", "Units", "Wells", "Curative", "Documents", "Contacts", "Acquisition", "Deliverables", "Audit"],
    aiSystemContext: "You are an AI assistant for an Energy Landman. Focus on title gaps, missing instruments, ownership conflicts, leases, and curative requirements. Do NOT make final legal title conclusions.",
    navigation: [
      { label: 'Land Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Projects', href: '/projects', icon: FolderKanban },
      { label: 'Tracts', href: '/tracts', icon: MapPin },
      { label: 'Ownership', href: '/ownership', icon: Scale },
      { label: 'Title', href: '/title', icon: ShieldCheck },
      { label: 'Run Sheets', href: '/runsheets', icon: FileText },
      { label: 'Leases', href: '/leases', icon: FileCheck },
      { label: 'Leasehold', href: '/leasehold', icon: Layers },
      { label: 'Units', href: '/units', icon: Box },
      { label: 'Wells', href: '/wells', icon: Target },
      { label: 'HBP', href: '/hbp', icon: Clock },
      { label: 'Curative', href: '/curative', icon: Wrench },
      { label: 'Acquisition', href: '/acquisition', icon: Wallet },
      { label: 'Right of Way', href: '/row', icon: Zap },
      { label: 'Documents', href: '/documents', icon: FileText },
      { label: 'Field Work', href: '/fieldwork', icon: Truck },
      { label: 'Deliverables', href: '/deliverables', icon: CheckSquare },
      { label: 'Billing', href: '/billing', icon: Receipt },
      { label: 'Reports', href: '/reports', icon: LineChart },
    ]
  },
  COMMERCIAL_BROKER: {
    type: "COMMERCIAL_BROKER",
    label: "Commercial Broker",
    icon: Building2,
    themeColor: "text-indigo-400",
    dashboardComponent: "CommercialBrokerDashboard",
    quickActions: ["Add listing", "Create BOV", "Match client", "Run comps", "Generate offering memorandum", "Schedule tour", "Create marketing campaign", "Draft LOI"],
    propertyTabs: ["Overview", "Sale Comps", "Lease Comps", "Traffic", "Demographics", "Market", "Zoning", "Tenants", "Financials", "Documents", "Marketing", "Offers", "Timeline"],
    aiSystemContext: "You are an AI assistant for a Commercial Broker. Focus on buyer/tenant matches, sale price, lease rate, cap rate, marketability, and demographic fit.",
    navigation: [
      { label: 'Broker Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Listings', href: '/listings', icon: Building2 },
      { label: 'Map', href: '/map', icon: MapPin },
      { label: 'Properties', href: '/properties', icon: Home },
      { label: 'Owners', href: '/owners', icon: Users },
      { label: 'Clients', href: '/clients', icon: Target },
      { label: 'Deals', href: '/deals', icon: Briefcase },
      { label: 'Comps', href: '/comps', icon: LineChart },
      { label: 'Market Analytics', href: '/analytics', icon: Compass },
      { label: 'Traffic', href: '/traffic', icon: Truck },
      { label: 'Demographics', href: '/demographics', icon: Users },
      { label: 'Documents', href: '/documents', icon: FileText },
      { label: 'Marketing', href: '/marketing', icon: Sparkles },
      { label: 'Tours', href: '/tours', icon: Calendar },
      { label: 'Offers', href: '/offers', icon: FileCheck },
      { label: 'Transactions', href: '/transactions', icon: ArrowRight },
      { label: 'Commissions', href: '/commissions', icon: DollarSign },
      { label: 'Reports', href: '/reports', icon: FileText },
    ]
  },
  PROPERTY_MANAGER: {
    type: "PROPERTY_MANAGER",
    label: "Property Manager",
    icon: Settings,
    themeColor: "text-slate-400",
    dashboardComponent: "PropertyManagerDashboard",
    quickActions: ["Add tenant", "Create lease", "Record payment", "Create work order", "Assign vendor", "Schedule inspection", "Send notice", "Review rent recommendation", "Generate owner report"],
    propertyTabs: ["Property Summary", "Units", "Tenants", "Leases", "Rent", "Maintenance", "Inspections", "Vendors", "Expenses", "Documents", "Owner Reporting", "Timeline"],
    aiSystemContext: "You are an AI assistant for a Property Manager. Focus on late rent, vacancy risk, maintenance forecasting, tenant retention, and operating expenses.",
    navigation: [
      { label: 'Management Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Properties', href: '/properties', icon: Home },
      { label: 'Units', href: '/units', icon: Box },
      { label: 'Tenants', href: '/tenants', icon: Users },
      { label: 'Leases', href: '/leases', icon: FileCheck },
      { label: 'Rent', href: '/rent', icon: DollarSign },
      { label: 'Maintenance', href: '/maintenance', icon: Wrench },
      { label: 'Work Orders', href: '/workorders', icon: Hammer },
      { label: 'Inspections', href: '/inspections', icon: ShieldCheck },
      { label: 'Vendors', href: '/vendors', icon: Truck },
      { label: 'Communications', href: '/communications', icon: MessageSquare },
      { label: 'Documents', href: '/documents', icon: FileText },
      { label: 'Accounting', href: '/accounting', icon: Calculator },
      { label: 'Owners', href: '/owners', icon: Users },
      { label: 'Reports', href: '/reports', icon: LineChart },
      { label: 'Automations', href: '/automations', icon: Settings },
    ]
  },
  RESIDENTIAL_REALTOR: {
    type: "RESIDENTIAL_REALTOR",
    label: "Residential Realtor",
    icon: Home,
    themeColor: "text-sky-400",
    dashboardComponent: "ResidentialRealtorDashboard",
    quickActions: ["Add buyer", "Add seller", "Create CMA", "Recommend listing price", "Find homes", "Schedule showing", "Draft offer", "Create listing package", "Follow up with client"],
    propertyTabs: ["Home Overview", "Photos", "Sales Comps", "Estimated Value", "Neighborhood", "Schools", "Taxes", "Insurance", "Market Activity", "Buyer Matches", "Offers", "Documents", "Timeline"],
    aiSystemContext: "You are an AI assistant for a Residential Realtor. Focus on listing price, sales comps, buyer matches, time to sell, showing feedback, and client follow-up.",
    navigation: [
      { label: 'Realtor Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Clients', href: '/clients', icon: Users },
      { label: 'Buyers', href: '/buyers', icon: Target },
      { label: 'Sellers', href: '/sellers', icon: Users },
      { label: 'Listings', href: '/listings', icon: Home },
      { label: 'Home Search', href: '/search', icon: Search },
      { label: 'Map', href: '/map', icon: MapPin },
      { label: 'CMAs', href: '/cmas', icon: Calculator },
      { label: 'Showings', href: '/showings', icon: Calendar },
      { label: 'Offers', href: '/offers', icon: FileText },
      { label: 'Transactions', href: '/transactions', icon: Briefcase },
      { label: 'Marketing', href: '/marketing', icon: Sparkles },
      { label: 'Documents', href: '/documents', icon: FileText },
      { label: 'Contacts', href: '/contacts', icon: Phone },
      { label: 'Reports', href: '/reports', icon: LineChart },
      { label: 'Automations', href: '/automations', icon: Settings },
    ]
  },
  DEVELOPER: {
    type: "DEVELOPER",
    label: "Developer",
    icon: Factory,
    themeColor: "text-orange-400",
    dashboardComponent: "DeveloperDashboard",
    quickActions: ["Start feasibility", "Check zoning", "Verify utilities", "Create concept scenario", "Estimate costs", "Compare density", "Add consultant", "Start entitlement workflow", "Run development pro forma"],
    propertyTabs: ["Site Summary", "Development Scenarios", "Zoning", "Future Land Use", "Utilities", "Access", "Traffic", "Environmental", "Soils", "Drainage", "Engineering", "Entitlements", "Financials", "Documents", "Timeline"],
    aiSystemContext: "You are an AI assistant for a Real Estate Developer. Focus on highest and best use, zoning, density, utilities, entitlement risk, infrastructure costs, and financial viability.",
    navigation: [
      { label: 'Developer Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Site Search', href: '/search', icon: Search },
      { label: 'Map', href: '/map', icon: MapPin },
      { label: 'Projects', href: '/projects', icon: FolderKanban },
      { label: 'Properties', href: '/properties', icon: Home },
      { label: 'Feasibility', href: '/feasibility', icon: Scale },
      { label: 'Zoning', href: '/zoning', icon: BookOpen },
      { label: 'Utilities', href: '/utilities', icon: Zap },
      { label: 'Engineering', href: '/engineering', icon: Wrench },
      { label: 'Environmental', href: '/environmental', icon: Trees },
      { label: 'Entitlements', href: '/entitlements', icon: FileCheck },
      { label: 'Concept Plans', href: '/concepts', icon: Map },
      { label: 'Budgets', href: '/budgets', icon: DollarSign },
      { label: 'Schedules', href: '/schedules', icon: Clock },
      { label: 'Consultants', href: '/consultants', icon: Users },
      { label: 'Documents', href: '/documents', icon: FileText },
      { label: 'Reports', href: '/reports', icon: LineChart },
      { label: 'Automations', href: '/automations', icon: Settings },
    ]
  },
  RENEWABLE_ENERGY: {
    type: "RENEWABLE_ENERGY",
    label: "Renewable Energy",
    icon: Sun,
    themeColor: "text-lime-400",
    dashboardComponent: "RenewableDashboard",
    quickActions: ["Create renewable project", "Add parcel", "Contact landowner", "Generate option", "Generate lease", "Review interconnection", "Analyze environmental constraints", "Track payment", "Review site-control gap"],
    propertyTabs: ["Site Summary", "Parcels", "Landowners", "Site Control", "Options", "Leases", "Interconnection", "Transmission", "Environmental", "Mineral Conflicts", "Payments", "Documents", "Timeline"],
    aiSystemContext: "You are an AI assistant for Renewable Energy Development. Focus on site control, option deadlines, landowner fragmentation, interconnection risk, transmission, and environmental constraints.",
    navigation: [
      { label: 'Renewable Dashboard', href: '/', icon: LayoutDashboard },
      { label: 'Projects', href: '/projects', icon: FolderKanban },
      { label: 'Site Search', href: '/search', icon: Search },
      { label: 'Map', href: '/map', icon: MapPin },
      { label: 'Parcels', href: '/parcels', icon: Map },
      { label: 'Landowners', href: '/landowners', icon: Users },
      { label: 'Site Control', href: '/sitecontrol', icon: ShieldCheck },
      { label: 'Options', href: '/options', icon: FileText },
      { label: 'Leases', href: '/leases', icon: FileCheck },
      { label: 'Interconnection', href: '/interconnection', icon: Zap },
      { label: 'Transmission', href: '/transmission', icon: Zap },
      { label: 'Environmental', href: '/environmental', icon: Trees },
      { label: 'Permitting', href: '/permitting', icon: BookOpen },
      { label: 'Right of Way', href: '/row', icon: MapPin },
      { label: 'Payments', href: '/payments', icon: DollarSign },
      { label: 'Documents', href: '/documents', icon: FileText },
      { label: 'Reports', href: '/reports', icon: LineChart },
    ]
  }
};
