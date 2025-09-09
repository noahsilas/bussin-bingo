const fs = require('node:fs')

// List of participating locations
// via https://www.sfmta.com/calendar/munis-bussin-bingo
const places = [
  { "name": "The Laundromat", "addresses": ["3725 Balboa Street"] },
  { "name": "Jim's", "addresses": ["2420 Mission Street"] },
  { "name": "M Stop Market & Deli", "addresses": ["2598 San Jose Avenue"] },
  { "name": "Sunset Cantina", "addresses": ["3414 Judah Street"] },
  { "name": "Motoring Coffee", "addresses": ["1525 Union Street"] },
  { "name": "New Love Tea", "addresses": ["601 Broadway"] },
  { "name": "Whack Donuts", "addresses": ["4 Embarcadero Center Suite #4507"] },
  { "name": "Smitten Ice Cream", "addresses": ["904 Valencia Street"] },
  { "name": "Devil's Teeth Baking Company", "addresses": ["3876 Noriega Street", "3619 Balboa Street", "1 Embarcadero Center"] },
  { "name": "Breadbelly", "addresses": ["1408 Clement Street", "1070 Maryland Street (Pier 70 Building 12)"] },
  { "name": "The French Spot", "addresses": ["1042 Larkin Street"] },
  { "name": "Fillmore Bakeshop", "addresses": ["1890 Fillmore Street"] },
  { "name": "Outta Sight Pizza", "addresses": ["422 Larkin Street", "643 Clay Street"] },
  { "name": "Standard Deviant Brewing", "addresses": ["280 14th Street", "1070 Maryland Street (Pier 70 Building 12)"] },
  { "name": "Peacekeeper", "addresses": ["925 Bush Street"] },
  { "name": "Zeitgeist", "addresses": ["199 Valencia Street"] },
  { "name": "Robberbaron", "addresses": ["2032 Polk Street"] },
  { "name": "Propagation", "addresses": ["895 Post Street"] },
  { "name": "Rikki's", "addresses": ["2223 Market Street"] },
  { "name": "Oasis Fusion Kitchen", "addresses": ["4826 Mission Street"] }
]

async function geocode(address) {
  const params = new URLSearchParams({
    address,
    key: process.env.MAPS_API_KEY,
  })
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?${params}`
  )
  const data = await response.json()
  const { results } = data
  if (results.length !== 1) {
    console.warn(`Awkward number of results (${results.length}) for "${address}"`)
    console.warn(JSON.stringify(results, null, 2))
  }
  const result = results[0];
  return {
    location: result.geometry.location,
    place_id: result.place_id,
    formatted_address: result.formatted_address,
  }
}

async function main() {
  const data = await Promise.all(places.map(async (place) => {
    const addresses = await Promise.all(place.addresses.map(
      (address) => geocode(`${address}, San Francisco CA`)
    ))
    return { name: place.name, addresses };
  }))
  fs.writeFileSync('public/geocoded.json', JSON.stringify(data, null, 2))
}

main();
