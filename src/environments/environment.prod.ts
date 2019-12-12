const server_url = '127.0.0.1'; //127.0.0.1 Will be replace with server url at running server

const server_host_url = `http://${server_url}`;
// const server_host_url = `https://${server_url}`;

export const environment = {
  production: true,
  API_URL: `${server_host_url}/api`,
  SERVER_URL: server_host_url,
  SOCKET_URL: `ws://${server_url}`,
  STORAGE_URL: `${server_host_url}/storage/download`,
  STORAGE_ZIP_URL: `${server_host_url}/storage/download-dataset`,
  MQTT_URL: `${server_url}`,
  MQTT_PORT: 1880
};
