import { supabase } from "@/lib/supabase";

export async function getAllCities() {

  const cities = new Set<string>();

  // BUS
  const { data: buses } = await supabase
    .from("bus")
    .select("From, To");

  buses?.forEach((bus: any) => {
    if (bus.From) cities.add(bus.From);
    if (bus.To) cities.add(bus.To);
  });

  // TRAIN
  const { data: trains } = await supabase
    .from("train")
    .select("source_station, destination_station");

  trains?.forEach((train: any) => {
    if (train.source_station)
      cities.add(train.source_station);

    if (train.destination_station)
      cities.add(train.destination_station);
  });

  // FLIGHT
  const { data: flights } = await supabase
    .from("flight")
    .select("Source, destination");

  flights?.forEach((flight: any) => {
    if (flight.Source)
      cities.add(flight.Source);

    if (flight.destination)
      cities.add(flight.destination);
  });

  return Array.from(cities).sort();
}