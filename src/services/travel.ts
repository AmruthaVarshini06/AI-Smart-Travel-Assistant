import { supabase } from "@/lib/supabase";

export async function getBusData(
  source?: string,
  destination?: string
) {
  let query = supabase.from("bus").select("*");

  if (source) {
    query = query.eq("From", source);
  }

  if (destination) {
    query = query.eq("To", destination);
  }

  const { data, error } = await query;

  if (error) {
    console.error("BUS ERROR:", error);
    return [];
  }

  return data;
}

export async function getTrainData(
  source?: string,
  destination?: string
) {
  let query = supabase.from("train").select("*");

  if (source) {
    query = query.eq("source_station", source);
  }

  if (destination) {
    query = query.eq("destination_station", destination);
  }

  const { data, error } = await query;

  if (error) {
    console.error("TRAIN ERROR:", error);
    return [];
  }

  return data;
}

export async function getFlightData(
  source?: string,
  destination?: string
) {
  let query = supabase.from("flight").select("*");

  if (source) {
    query = query.eq("Source", source);
  }

  if (destination) {
    query = query.eq("destination", destination);
  }

  const { data, error } = await query;

  if (error) {
    console.error("FLIGHT ERROR:", error);
    return [];
  }

  return data;
}