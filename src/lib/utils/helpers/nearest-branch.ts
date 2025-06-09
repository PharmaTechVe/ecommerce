import { BranchResponse } from '@pharmatech/sdk';

export default function getNearestBranch(
  userLocation: { lat: number; lng: number },
  branches: BranchResponse[],
) {
  if (!userLocation) return null;

  function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  let nearest = branches[0];
  let minDist = haversine(
    userLocation.lat,
    userLocation.lng,
    branches[0].latitude,
    branches[0].longitude,
  );

  for (const branch of branches) {
    const dist = haversine(
      userLocation.lat,
      userLocation.lng,
      branch.latitude,
      branch.longitude,
    );
    if (dist < minDist) {
      minDist = dist;
      nearest = branch;
    }
  }
  return nearest;
}
