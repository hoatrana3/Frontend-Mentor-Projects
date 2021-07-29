import "./styles.scss";
import numeral from "numeral";
import Tilt from "vanilla-tilt";

const darkModeToggler = document.getElementById("darkModeToggler");
const regionFilterToggler = document.getElementById("regionFilterToggler");
const regionFilterDropdown = document.getElementById("regionFilterDropdown");
const countryDetails = document.getElementById("countryDetails");
const countryDataGrid = document.getElementById("countryDataGrid");
const searchInput = document.getElementById("searchInput");
const regionFilterOptions = document.querySelectorAll(
  "#regionFilterDropdown li"
);
const regionPickedInput = document.querySelector("#regionFilterToggler input");
const btnDetailsBack = document.getElementById("btnBack");

let countryData = [];
let currentShowCountry = null;
let currentSearchValue = "";
let currentRegionPicked = "*";
let searchTimeout = null;

const renderCountryDetails = () => {
  if (!countryData.length) return;

  const {
    flag,
    name,
    population,
    region,
    capital,
    subregion,
    topLevelDomain,
    currencies,
    languages,
    borders
  } = currentShowCountry;

  const borderCountries = countryData
    .filter((c) => borders.includes(c.alpha3Code))
    .sort((c1, c2) => c1.name.length - c2.name.length);
  const borderCountriesHtml = borderCountries.reduce((res, { name }) => {
    return (
      res +
      `
      <div class="country-details__border">
        ${name}
      </div>
    `.trim()
    );
  }, "");

  countryDetails.innerHTML = `
    <img src="${flag}" alt="" class="country-flag" />
    <div class="country-details__main">
      <h2 class="country-name">${name}</h2>
      <div class="country-details__infos">
        <div>
          <div class="country-info-line">
            <span>Population:</span>
            <span>${numeral(population).format("0,0")}</span>
          </div>
          <div class="country-info-line">
            <span>Region:</span>
            <span>${region}</span>
          </div>
          <div class="country-info-line">
            <span>Sub Region:</span>
            <span>${subregion}</span>
          </div>
          <div class="country-info-line">
            <span>Capital:</span>
            <span>${capital}</span>
          </div>
        </div>
        <div>
          <div class="country-info-line">
            <span>Top Level Domain:</span>
            <span>${topLevelDomain.join(", ")}</span>
          </div>
          <div class="country-info-line">
            <span>Currencies:</span>
            <span>${currencies.map((c) => c.name).join(", ")}</span>
          </div>
          <div class="country-info-line">
            <span>Languages:</span>
            <span>${languages.map((l) => l.name).join(", ")}</span>
          </div>
        </div>
      </div>
      <div class="country-details__footer">
        <span>Border Countries:</span>
        ${borderCountriesHtml}
      </div>
    </div>
  `.trim();
};

const createCountryItemEl = (country, index) => {
  const { flag, name, population, region, capital } = country;
  const elHtml = `
  <div class="country has-country-info" data-index="${index}">
    <img class="country-flag" src="${flag}" alt="" />
    <div class="country__main">
      <h2 class="country-name">${name}</h2>
      <div class="country-info-line">
        <span>Population:</span>
        <span>${numeral(population).format("0,0")}</span>
      </div>
      <div class="country-info-line">
        <span>Region:</span>
        <span>${region}</span>
      </div>
      <div class="country-info-line">
        <span>Capital:</span>
        <span>${capital}</span>
      </div>
    </div>
  </div>
  `.trim();

  const countryEl = document.createElement("div");
  countryEl.innerHTML = elHtml;

  countryEl.firstElementChild.addEventListener("click", () => {
    document.body.classList.add("show-details");
    currentShowCountry = country;
    renderCountryDetails();
  });

  return countryEl.firstElementChild;
};

const resetCountryEls = () => {
  document.querySelectorAll(".country").forEach((el) => {
    el.classList.remove("is-hidden");
  });
};

const hideCountryByIndex = (index) => {
  const countryEl = document.querySelector(`.country[data-index="${index}"]`);
  countryEl.classList.add("is-hidden");
};

const lowerCaseInclude = (main, sub) => {
  return main.toLowerCase().includes(sub.toLowerCase());
};

const filterCountries = () => {
  if (!countryData.length) return;

  resetCountryEls();

  if (!currentSearchValue.length && currentSearchValue === "*") return;

  countryData.forEach(({ name, region }, index) => {
    if (
      (!currentSearchValue.length ||
        lowerCaseInclude(name, currentSearchValue)) &&
      (currentRegionPicked === "*" || region === currentRegionPicked)
    )
      return;

    hideCountryByIndex(index);
  });
};

darkModeToggler.addEventListener("click", () => {
  document.body.classList.toggle("is-dark");

  const modeIconEl = darkModeToggler.querySelector("ion-icon");
  const modeTextEl = darkModeToggler.querySelector("span");

  if (document.body.classList.contains("is-dark")) {
    modeIconEl.setAttribute("name", "sunny");
    modeTextEl.innerHTML = "Light Mode";
  } else {
    modeIconEl.setAttribute("name", "moon");
    modeTextEl.innerHTML = "Dark Mode";
  }
});

regionFilterToggler.addEventListener("click", () => {
  regionFilterDropdown.classList.toggle("is-open");
});

searchInput.addEventListener("input", (e) => {
  if (searchTimeout) clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    currentSearchValue = e.target.value;
    filterCountries();
  }, 500);
});

regionFilterOptions.forEach((optionEl) => {
  optionEl.addEventListener("click", (e) => {
    if (!countryData.length) return;

    resetCountryEls();
    regionFilterDropdown.classList.remove("is-open");

    const regionPicked = e.target.getAttribute("data-region");
    currentRegionPicked = regionPicked;
    regionPickedInput.value = e.target.innerHTML;

    filterCountries();
  });
});

btnDetailsBack.addEventListener("click", () => {
  document.body.classList.remove("show-details");
});

fetch("https://restcountries.eu/rest/v2/all").then(async (response) => {
  countryData = await response.json();
  countryData.forEach((country, index) => {
    countryDataGrid.appendChild(createCountryItemEl(country, index));
  });

  Tilt.init(document.querySelectorAll(".country"), {
    max: 20,
    speed: 200,
    scale: 1.05
  });
});
