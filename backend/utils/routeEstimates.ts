export const estimateCost = (
  mode: string,
  distance: number
) => {
  const km = Math.max(distance, 1);

  switch (mode.toLowerCase()) {
    case "cab":
      return Math.round(100 + km * 14);

    case "bus":
      return Math.round(100 + km * 2.2);

    case "train":
      return Math.round(150 + km * 1.5);

    case "flight":
      return Math.round(2500 + km * 2);

    default:
      return Math.round(km * 5);
  }
};