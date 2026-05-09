const BASE_URL = "http://localhost:5000/api";

export async function getLocalTransport(
  source: string,
  destination: string
) {

  try {

    const response = await fetch(
      `${BASE_URL}/gemini/local-transport?source=${source}&destination=${destination}`
    );

    return await response.json();

  } catch (error) {

    console.error(error);

    return null;
  }
}