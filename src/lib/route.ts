export async function getRoute(start: any, end: any) {
  const apiKey = import.meta.env.VITE_ORS_API_KEY;

  const response = await fetch(
    `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lon},${start.lat}&end=${end.lon},${end.lat}`
  );

  return response.json();
}