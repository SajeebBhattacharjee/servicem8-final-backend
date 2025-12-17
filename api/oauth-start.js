export default function handler(req, res) {
  const clientId = process.env.SERVICEM8_APP_ID;
  const redirectUri = `${process.env.BASE_URL}/api/oauth-callback`;

  const scopes = [
    'read_jobs',
    'publish_job_attachments'
  ].join(' ');

  const authUrl =
    'https://go.servicem8.com/oauth/authorize' +
    `?response_type=code` +
    `&client_id=${encodeURIComponent(clientId)}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  res.writeHead(302, { Location: authUrl });
  res.end();
}
