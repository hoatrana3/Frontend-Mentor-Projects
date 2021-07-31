import "./styles.scss";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const searchResult = document.querySelector(".search-result");

const defaultZoom = 13;
const { L } = global;
const mapConfig = {
  attributionControl: false,
  center: [10.7743, 106.6669],
  zoom: defaultZoom,
  zoomControl: false
};
const map = L.map("map", mapConfig);
const markerIcon = L.icon({
  iconUrl: "../images/icon-location.svg",
  iconSize: [46, 55],
  iconAnchor: [23, 55]
});
let marker = null;

const validateIpAddress = (ipAddress) => {
  return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
    ipAddress
  );
};

const renderResultLine = (title, val) => {
  return `
    <div class="search-result__line">
      <small>${title}</small>
      <span>${val}</span>
    </div>
  `.trim();
};

const renderResults = (result) => {
  if (result && !result.code) {
    const {
      ip,
      location: { city, country, timezone },
      isp
    } = result;

    searchResult.innerHTML = `
      ${renderResultLine("Ip address", ip)}
      ${renderResultLine("Location", `${city}, ${country}`)}
      ${renderResultLine("Timezone", `UTC ${timezone}`)}
      ${renderResultLine("isp", isp)}
    `.trim();
  } else
    searchResult.innerHTML = `
      ${renderResultLine("Ip address", "-")}
      ${renderResultLine("Location", "-")}
      ${renderResultLine("Timezone", "-")}
      ${renderResultLine("isp", "-")}
    `.trim();
};

const processMap = (result) => {
  if (result && !result.code) {
    const {
      location: { lat, lng }
    } = result;
    const latLng = new L.LatLng(lat, lng);
    map.flyTo(latLng, defaultZoom);

    if (!marker) marker = L.marker(latLng, { icon: markerIcon }).addTo(map);
    else marker.setLatLng(latLng);
  }
};

const handleSearch = async () => {
  const val = searchInput.value;
  if (!val.length) return;

  const apiKey = "at_t2XIvSQk3EdRe7Ur0wWkkmMw8ppII";
  const searchField = validateIpAddress(val) ? "ipAddress" : "domain";
  const searchUrl = `https://geo.ipify.org/api/v1?apiKey=${apiKey}&${searchField}=${val}`;
  const response = await (await fetch(searchUrl)).json();
  renderResults(response);
  processMap(response);
};

const getUserCurrentIp = async () => {
  const response = await (
    await fetch("https://api.ipify.org?format=json")
  ).json();
  searchInput.value = response.ip;
  handleSearch();
};

const initMap = () => {
  map.whenReady(() => {
    console.log("A load event occurred.");
    getUserCurrentIp();
    renderResults();
  });

  L.mapboxGL({
    attribution:
      '\u003ca href="https://www.maptiler.com/copyright/" target="_blank"\u003e\u0026copy; MapTiler\u003c/a\u003e \u003ca href="https://www.openstreetmap.org/copyright" target="_blank"\u003e\u0026copy; OpenStreetMap contributors\u003c/a\u003e',
    style:
      "https://api.maptiler.com/maps/dd0e86c1-e040-468e-8ad5-8cbe729132dd/style.json?key=sYyteaQIVQN6jfQwSKUG"
  }).addTo(map);
};

searchBtn.addEventListener("click", () => {
  handleSearch();
});

searchInput.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();
    handleSearch();
  }
});

initMap();
