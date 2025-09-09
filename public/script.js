import places from './geocoded.json' with { type: "json" };

let map;
let openWindow = null;
const markers = {};

function h2(text) {
  const el = document.createElement('h2');
  el.textContent = text;
  return el;
}

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
      markers[place.name].push(marker);
      const infoWindow = new google.maps.InfoWindow({
        headerContent: h2(place.name),
        content: `<p>${address.formatted_address}</p>`,
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
