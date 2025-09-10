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

function tag(tag, children, attrs) {
  const el = document.createElement(tag);
  if (typeof children == 'string') {
    el.textContent = children;
  } else {
    for (const child of children) {
      el.appendChild(child);
    }
  }
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  }
  return el;
}

const h2 = (children, attrs) => tag('h2', children, attrs);
const div = (children, attrs) => tag('div', children, attrs);
const p = (children, attrs) => tag('p', children, attrs);
const button = (children, attrs) => tag('button', children, attrs);
const a = (children, attrs) => tag('a', children, attrs);

async function initMap() {
  const mapP = google.maps.importLibrary("maps");
  const markerP = google.maps.importLibrary("marker");
  const { Map } = await mapP;

  map = new Map(document.getElementById("map"), {
    center: { lat: 37.7620, lng: -122.4450 },
    zoom: 13,
    mapId: 'b8c4fa3c1823c00153f5f936',
  });

  const { AdvancedMarkerElement } = await markerP;

  for (const place of places) {
    markers[place.name] = [];
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

initMap();
