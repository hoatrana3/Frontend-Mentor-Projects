import "./styles.scss";
import copy from "copy-text-to-clipboard";

const menuToggler = document.getElementById("menuToggler");
const navMenu = document.querySelector("nav");
const shortenInputContainer = document.querySelector(".shorten-input");
const shortenInput = document.getElementById("shortenInput");
const shortenBtn = document.getElementById("shortenBtn");
const shortenResults = document.getElementById("shortenResults");

const doShotern = async (url) => {
  const linkRequest = {
    destination: url,
    domain: { fullName: "rebrand.ly" }
  };
  const requestHeaders = {
    "Content-Type": "application/json",
    apikey: "db1d0d6cfa9e4c13aeae2dd29825d05a"
  };
  const res = await fetch("https://api.rebrandly.com/v1/links", {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify(linkRequest)
  });
  return res.json();
};

const setCopyEvent = (el, shortUrl) => {
  el.addEventListener("click", () => {
    el.classList.add("is-copied");
    el.innerHTML = "Copied!";
    copy(shortUrl);

    setTimeout(() => {
      el.classList.remove("is-copied");
      el.innerHTML = "Copy";
    }, 2000);
  });
};

const renderResult = ({ destination, shortUrl }) => {
  const el = document.createElement("div");
  el.innerHTML = `
  <div class="result">
    <a href=${destination} target="_blank" class="link-origin">
      ${destination}
    </a>
    <a href="https://${shortUrl}" target="_blank" class="link-shorten">
      https://${shortUrl}
    </a>
    <button class="is-primary">Copy</button>
  </div>
  `.trim();

  const copyBtn = el.querySelector("button");
  setCopyEvent(copyBtn, shortUrl);
  shortenInput.value = "";

  shortenResults.prepend(el.firstElementChild);
};

menuToggler.addEventListener("click", () => {
  navMenu.classList.toggle("is-open");
});

shortenBtn.addEventListener("click", async () => {
  const val = shortenInput.value;

  if (!val.length) {
    shortenInputContainer.classList.add("has-error");
    return;
  }

  shortenInputContainer.classList.remove("has-error");
  renderResult(await doShotern(val));
});
