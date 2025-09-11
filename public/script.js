import places from './geocoded.json' with { type: "json" };

let map;
let openWindow = null;
const markers = {};

const visited = JSON.parse(localStorage.getItem('visited') ?? '{}');
const visit = (name, status = true) => {
  visited[name] = status;
  markers[name].forEach((marker) => {
    if (status) {
      marker.element.classList.add('visitedMarker');
    } else {
      marker.element.classList.remove('visitedMarker');
    }
  })
  localStorage.setItem('visited', JSON.stringify(visited));
}

function tag(tag, children, attrs = {}, listeners = {}) {
  const el = document.createElement(tag);
  if (typeof children == 'string') {
    el.textContent = children;
  } else {
    for (const child of children) {
      el.appendChild(child);
    }
  }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  Object.entries(listeners).forEach(([k,v]) => el.addEventListener(k, v));
  return el;
}

const h2 = (...args) => tag('h2', ...args);
const div = (...args) => tag('div', ...args);
const p = (...args) => tag('p', ...args);
const button = (...args) => tag('button', ...args);
const a = (...args) => tag('a', ...args);

const nav = document.getElementById('nav');

async function initMap() {
  const navLinks = document.getElementById('navLinks');
  const mapP = google.maps.importLibrary("maps");
  const markerP = google.maps.importLibrary("marker");
  const { Map } = await mapP;

  map = new Map(document.getElementById("map"), {
    center: { lat: 37.7620, lng: -122.4450 },
    zoom: 13,
    mapId: 'b8c4fa3c1823c00153f5f936',
    disableDefaultUI: true,
  });

  const { AdvancedMarkerElement } = await markerP;

  for (const place of places) {
    markers[place.name] = [];
    navLinks.appendChild(
      a(place.name, {}, { click: () => {
        markers[place.name][0].click();
        nav.classList.remove('open');
      }})
    );
    for (const address of place.addresses) {
      const marker = new AdvancedMarkerElement({
        map,
        position: { lat: address.location.lat, lng: address.location.lng },
        title: place.name,
      });
      if (place.name in visited && visited[place.name]) {
        marker.element.classList.add('visitedMarker');
      }
      markers[place.name].push(marker);
      const b = button('Visited');
      b.addEventListener('click', () => {
        visit(place.name, !visited[place.name])
      })
      const infoWindow = new google.maps.InfoWindow({
        headerContent: a([h2(place.name)], { href: place.url }),
        content: div([p(address.formatted_address), b])
      });
      marker.content.addEventListener('mouseenter', () => {
        markers[place.name].forEach((marker) => {
          marker.element.classList.add('highlightMarker')
        })
      });
      marker.content.addEventListener('mouseleave', () => {
        markers[place.name].forEach((marker) => {
          marker.element.classList.remove('highlightMarker')
        })
      });
      marker.addListener("click", () => {
        openWindow && openWindow.close();
        openWindow = infoWindow;
        infoWindow.open({ anchor: marker, map })
      });
    }
  }
}

function initNav() {
  document.getElementById('navToggle').addEventListener('click', () => {
    nav.classList.toggle('open')
  });
}

initMap();
initNav();
