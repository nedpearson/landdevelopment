export const requireMapboxToken = (): string => {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    throw new Error("Mapbox token is missing. Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment.");
  }
  
  if (!token.startsWith("pk.") && !token.startsWith("sk.")) {
    throw new Error("Invalid Mapbox token format. Public tokens should start with 'pk.'.");
  }

  return token;
};
