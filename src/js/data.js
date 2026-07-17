export async function getTrails() {
  const trailDataUrl = `${import.meta.env.BASE_URL}data/trails.json`;

  let response;

  try {
    response = await fetch(trailDataUrl);
  } catch (error) {
    throw new Error('Unable to reach trail data.');
  }

  if (!response.ok) {
    throw new Error(`Error fetching data. Status: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') || '';

  if (!contentType.includes('application/json')) {
    throw new Error('Trail data was not returned as JSON.');
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error('Trail data format was invalid.');
  }

  return data;
}

