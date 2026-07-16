export async function getTrails() {
  const response = await fetch('/data/trails.json');
  if (!response.ok) throw new Error(`Error fetching data.`);
  const data = await response.json();
  return data;
}

