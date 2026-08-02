export interface DictionaryTerm {
  professionalName: string;
  simpleName: string;
  oneSentence: string;
  detailedExplanation: string;
  whyItMatters: string;
  example: string;
}

export const LAND_DICTIONARY: Record<string, DictionaryTerm> = {
  "APN": {
    professionalName: "Assessor's Parcel Number (APN)",
    simpleName: "Property ID Number",
    oneSentence: "A unique number the county uses to identify this specific piece of land for taxes.",
    detailedExplanation: "Just like every car has a VIN or every citizen has a Social Security Number, every piece of land has an APN. It is the only reliable way to track a property, because street addresses can change or may not exist for raw land.",
    whyItMatters: "If you search for the wrong APN, you might accidentally buy the neighbor's property instead of yours.",
    example: "14-88-299"
  },
  "MINERAL_RIGHTS": {
    professionalName: "Mineral Rights / Subsurface Estate",
    simpleName: "Underground Ownership Rights",
    oneSentence: "The legal right to extract oil, gas, gold, or other minerals from beneath the property.",
    detailedExplanation: "In many states (like Texas), the person who owns the surface of the land often does not own what is underneath it. The mineral rights can be sold completely separately from the surface dirt.",
    whyItMatters: "If you don't own the mineral rights, an oil company could legally bring a drilling rig onto your property to extract their minerals, ruining your development plans.",
    example: "Owning the land to build a house, but ExxonMobil owning the oil 5,000 feet below."
  },
  "CURATIVE": {
    professionalName: "Title Curative",
    simpleName: "Fixing Ownership Problems",
    oneSentence: "The legal process of fixing mistakes in a property's history so it can be sold cleanly.",
    detailedExplanation: "When a property changes hands over 100 years, mistakes happen. A deed might have been signed by the wrong person, or a long-lost heir might still technically own 1%. Curative is the detective work and legal paperwork required to 'cure' these defects.",
    whyItMatters: "A bank will not loan you money to develop a property if the title is 'sick' and requires curative work, because someone else might claim they own it.",
    example: "Tracking down a grandson to sign a Quitclaim Deed."
  },
  "WORKING_INTEREST": {
    professionalName: "Working Interest (WI)",
    simpleName: "Ownership That Pays Bills",
    oneSentence: "A type of ownership in an oil/gas well where you have to pay for the drilling costs.",
    detailedExplanation: "Unlike a royalty owner who just sits back and collects a check, a working interest owner is an active partner. If the well costs $1,000,000 to drill and you own 10% WI, you have to write a check for $100,000.",
    whyItMatters: "It is high risk, high reward. You get a larger share of the profits, but if the well is dry, you lose your investment.",
    example: "Paying 10% of the drilling costs to receive 10% of the revenue minus royalties."
  },
  "CAP_RATE": {
    professionalName: "Capitalization Rate (Cap Rate)",
    simpleName: "Annual Return on Investment",
    oneSentence: "The percentage of return you can expect from a rental property if you bought it entirely with cash.",
    detailedExplanation: "Calculated by dividing the Net Operating Income (NOI) by the purchase price. If you buy a property for $100,000 and it profits $8,000 a year after expenses, the cap rate is 8%.",
    whyItMatters: "It is the universal metric investors use to compare the profitability of commercial and residential rental properties.",
    example: "Buying a fourplex at a 7.5% Cap Rate."
  },
  "NOI": {
    professionalName: "Net Operating Income (NOI)",
    simpleName: "Annual Profit",
    oneSentence: "All the revenue a property generates minus all operating expenses.",
    detailedExplanation: "NOI is the true money a property makes in a year before paying the mortgage (debt service) or taxes. Revenue (Rent) - Expenses (Maintenance, Insurance, Management) = NOI.",
    whyItMatters: "Commercial property values are derived almost entirely from their NOI. Higher NOI equals a higher property valuation.",
    example: "A Build-to-Rent community generating $500,000 in rent with $150,000 in expenses has an NOI of $350,000."
  },
  "BTR": {
    professionalName: "Build-to-Rent (BTR)",
    simpleName: "Building Homes to Rent Out",
    oneSentence: "Developing a neighborhood of houses not to sell to families, but to hold and rent them like an apartment complex.",
    detailedExplanation: "A massive trend in real estate where developers build single-family homes but keep them in a unified portfolio to generate rental yield, bypassing the headaches of multi-family high-rises.",
    whyItMatters: "BTR developments require different zoning, massive capital, and professional property management, but offer incredible long-term wealth generation.",
    example: "Building 40 identical homes and hiring a management company to lease them."
  }
};
