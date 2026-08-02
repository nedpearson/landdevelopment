export interface GlossaryTerm {
  professionalTerm: string;
  simpleLabel: string;
  shortExplanation: string;
  whyItMatters: string;
}

const terms: Record<string, GlossaryTerm> = {
  "TRACT": {
    professionalTerm: "Tract",
    simpleLabel: "Property Boundary",
    shortExplanation: "A specific piece of land with defined legal boundaries.",
    whyItMatters: "This is the physical land you are evaluating to buy or develop."
  },
  "NMA": {
    professionalTerm: "Net Mineral Acres",
    simpleLabel: "Mineral Rights Owned",
    shortExplanation: "The actual amount of mineral rights you own beneath the surface, calculated by multiplying the tract size by your ownership percentage.",
    whyItMatters: "It determines how much you get paid for oil, gas, or mining leases."
  },
  "HBP": {
    professionalTerm: "Held By Production",
    simpleLabel: "Active Lease",
    shortExplanation: "A lease that remains active beyond its initial term because the land is currently producing oil, gas, or minerals.",
    whyItMatters: "If a property is HBP, you usually cannot sign a new lease with another company."
  }
};

export function getGlossaryTerm(term: string): GlossaryTerm | undefined {
  return terms[term.toUpperCase()];
}
