const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);

function getLocalAiOrigin(baseUrl) {
  const url = new URL(baseUrl);
  if (url.protocol !== "http:" || !LOCAL_HOSTS.has(url.hostname)) {
    throw new Error("El servidor de IA debe usar HTTP y ejecutarse en este equipo.");
  }
  return url.origin;
}

module.exports = { getLocalAiOrigin };
