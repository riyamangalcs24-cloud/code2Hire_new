const PULSEIQ_API_KEY = process.env.PULSEIQ_API_KEY;
const PULSEIQ_PROJECT_ID = process.env.PULSEIQ_PROJECT_ID || '69ea80d090498114ea9f81e3';
const PULSEIQ_ENDPOINT = process.env.PULSEIQ_ENDPOINT || 'https://pulseiq-ffio.onrender.com/api/ingest/event';

async function track(eventName, userId = null, properties = {}, anonymousId = 'server_event') {
  if (!PULSEIQ_API_KEY || !eventName) {
    return false;
  }

  try {
    const response = await fetch(PULSEIQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': PULSEIQ_API_KEY,
      },
      body: JSON.stringify({
        projectId: PULSEIQ_PROJECT_ID,
        eventName,
        userId: userId || undefined,
        anonymousId,
        properties,
      }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

module.exports = { track };