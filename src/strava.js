import { formatTime, getFromStorage, setToStorage } from './utils';

const STORAGE_KEY = 'strava';
const AUTHORIZE_URL = 'https://www.strava.com/oauth/authorize';
const PROXY_URL = '/strava';
const EXPIRY_MARGIN_MS = 60000;

const toLocalISO = timestamp => {
  const offset = new Date(timestamp).getTimezoneOffset() * 60000;

  return new Date(timestamp - offset).toISOString().slice(0, 19);
};

export const buildActivity = ({ name, sport, startedAt, elapsed, timers }) => ({
  name,
  sport_type: sport,
  start_date_local: toLocalISO(startedAt),
  elapsed_time: elapsed,
  description: timers.map(timer => `${timer.name} — ${formatTime(timer.time)}`).join('\n'),
});

export const createStrava = (workout = {}) => {
  const getConfig = () => getFromStorage(STORAGE_KEY) || {};
  const setConfig = data => setToStorage(STORAGE_KEY, { ...getConfig(), ...data });

  const requestToken = async body => {
    const { clientId, clientSecret } = getConfig();
    const response = await fetch(`${PROXY_URL}/oauth/token`, {
      method: 'POST',
      body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, ...body }),
    });

    if (!response.ok) {
      throw new Error(`Strava token request failed: ${response.status}`);
    }

    const data = await response.json();

    setConfig({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: data.expires_at,
    });

    return data.access_token;
  };

  const getAccessToken = () => {
    const { accessToken, refreshToken, expiresAt } = getConfig();

    if (accessToken && expiresAt * 1000 - EXPIRY_MARGIN_MS > Date.now()) {
      return accessToken;
    }

    return requestToken({ grant_type: 'refresh_token', refresh_token: refreshToken });
  };

  const isConnected = () => Boolean(getConfig().refreshToken);

  const connect = () => {
    const config = getConfig();
    const clientId = config.clientId || window.prompt('Strava Client ID:');
    const clientSecret = config.clientSecret || window.prompt('Strava Client Secret:');

    if (!clientId || !clientSecret) {
      return;
    }

    setConfig({ clientId, clientSecret });

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: window.location.origin + window.location.pathname + window.location.search,
      response_type: 'code',
      approval_prompt: 'auto',
      scope: 'activity:write',
    });

    window.location.assign(`${AUTHORIZE_URL}?${params}`);
  };

  const handleCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');

    if (!code) {
      return;
    }

    ['code', 'scope', 'state'].forEach(name => params.delete(name));
    const query = params.toString();
    window.history.replaceState({}, '', window.location.pathname + (query ? `?${query}` : ''));

    await requestToken({ grant_type: 'authorization_code', code });
  };

  const upload = async summary => {
    const token = await getAccessToken();
    const response = await fetch(`${PROXY_URL}/api/v3/activities`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: new URLSearchParams(buildActivity({ ...workout, ...summary })),
    });

    // 409 means Strava already has this activity, e.g. a retry after
    // a response that failed to parse — the upload itself succeeded
    if (!response.ok && response.status !== 409) {
      throw new Error(`Strava upload failed: ${response.status}`);
    }

    const text = await response.text();

    return text ? JSON.parse(text) : null;
  };

  let pendingSummary = null;

  const setLabel = text => {
    document.getElementById('strava').textContent = text;
  };

  const send = async summary => {
    if (!isConnected()) {
      return;
    }

    pendingSummary = null;
    setLabel('Sending to Strava…');

    try {
      await upload(summary);
      setLabel('Sent to Strava ✓');
    } catch (error) {
      console.error('Strava upload failed:', error);
      pendingSummary = summary;
      setLabel('Strava failed — retry');
    }
  };

  const click = () => (pendingSummary ? send(pendingSummary) : connect());

  const init = async () => {
    try {
      await handleCallback();
    } catch (error) {
      console.error('Strava authorization failed:', error);
    }

    setLabel(isConnected() ? 'Strava ✓' : 'Connect Strava');
  };

  return { click, init, send, upload };
};
