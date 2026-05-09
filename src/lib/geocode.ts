export async function getCoordinates(place: string) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${place}&format=jsonv2`
  );

  const data = await response.json();

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
  };
}