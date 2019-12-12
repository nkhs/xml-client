const server_url = 'localhost'
// const server_url = '52.196.229.187'
// const server_url = '192.168.1.101'

const server_host_url = `http://${server_url}`;
// const server_host_url = `https://${server_url}`;

export const environment = {
  production: false,
  SERVER_URL: server_host_url,
  API_URL: `${server_host_url}/api`,
  SOCKET_URL: `ws://${server_url}`,
  STORAGE_URL: `${server_host_url}/storage/download`,
  STORAGE_ZIP_URL: `${server_host_url}/storage/download-dataset`
};
