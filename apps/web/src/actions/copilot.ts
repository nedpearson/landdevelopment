"use server";

// Phase 11: Proactive AI Copilot

export async function getProactiveInsights(role: string) {
  // In a real app, this would query the database to find anomalies, high scores, or tasks needing attention
  // based on the specific role of the user, and use OpenAI to format a human-readable notification.
  
  await new Promise(res => setTimeout(res, 1000)); // simulate latency

  switch (role) {
    case "LAND_INVESTOR":
    case "BROKER":
      return "I scanned your portfolio and found 3 properties in Texas with Flip Scores over 85. Would you like me to draft direct mail campaigns for them?";
    
    case "PROPERTY_MANAGER":
      return "Alert: 2 of your multifamily assets have projected occupancy dropping below 90% next quarter based on expiring leases. Should I generate a tenant retention strategy?";
      
    case "DEVELOPER":
    case "RENEWABLE_DEVELOPER":
      return "I've detected a zoning variance request approved on a parcel adjacent to your target site. This may increase your Highest & Best Use density. Want to see the updated scorecard?";
      
    case "LANDMAN":
      return "Title defect detected on Tract 4A. An Affidavit of Heirship is missing from the 1998 conveyance. I have added a Curative Item to your task list.";
      
    default:
      return "I am actively monitoring the platform for anomalies and opportunities. Let me know if you want me to run a deep scan.";
  }
}
