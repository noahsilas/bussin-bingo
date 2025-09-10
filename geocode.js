const fs = require('node:fs')

// List of participating locations
// via https://www.sfmta.com/calendar/munis-bussin-bingo
const places = [
  { name: "The Laundromat", addresses: ["3725 Balboa Street"], url: "https://www.thelaundromatsf.com/" },
  { name: "Jim's", addresses: ["2420 Mission Street"], url: "https://www.instagram.com/jims.sf/"},
  { name: "M Stop Market & Deli", addresses: ["2598 San Jose Avenue"], url: "https://mstopdeli.com/" },
  { name: "Sunset Cantina", addresses: ["3414 Judah Street"], url: "https://www.sunsetcantinasf.com/" },
  { name: "Motoring Coffee", addresses: ["1525 Union Street"], url: "https://www.motoring.coffee/sanfrancisco" },
  { name: "New Love Tea", addresses: ["601 Broadway"], url: "https://www.instagram.com/lovetea_sf/" },
  { name: "Whack Donuts", addresses: ["4 Embarcadero Center Suite #4507"], url: "https://www.instagram.com/whackdonuts/" },
  { name: "Smitten Ice Cream", addresses: ["904 Valencia Street"], url: "https://www.smittenicecream.com/" },
  { name: "Devil's Teeth Baking Company", addresses: ["3876 Noriega Street", "3619 Balboa Street", "1 Embarcadero Center"], url: "https://www.devilsteethbakingcompany.com/" },
  { name: "Thorough Bread & Pastry", addresses: ["248 Church Street"], url: "https://www.thoroughbreadandpastry.com/" },
  { name: "Breadbelly", addresses: ["1408 Clement Street", "1070 Maryland Street (Pier 70 Building 12)"], url: "https://www.breadbellysf.com/" },
  { name: "The French Spot", addresses: ["1042 Larkin Street"], url: "https://www.thefrenchspotsf.com/" },
  { name: "Fillmore Bakeshop", addresses: ["1890 Fillmore Street"], url: "https://fillmorebakeshop.com/" },
  { name: "Outta Sight Pizza", addresses: ["422 Larkin Street", "643 Clay Street"], url: "https://www.thatsouttasight.com/" },
  { name: "Standard Deviant Brewing", addresses: ["280 14th Street", "1070 Maryland Street (Pier 70 Building 12)"], url: "https://www.standarddeviantbrewing.com/" },
  { name: "Peacekeeper", addresses: ["925 Bush Street"], url: "https://www.peacekeepersf.com/" },
  { name: "Zeitgeist", addresses: ["199 Valencia Street"], url: "https://www.zeitgeistsf.com/" },
  { name: "Robberbaron", addresses: ["2032 Polk Street"], url: "https://www.robberbaronsf.com/" },
  { name: "Propagation", addresses: ["895 Post Street"], url: "https://www.propagationsf.com/" },
  { name: "Rikki's", addresses: ["2223 Market Street"], url: "https://www.rikkisbarsf.com/" },
  { name: "Oasis Fusion Kitchen", addresses: ["4826 Mission Street"], url: "https://www.instagram.com/oasis_fusion_kitchen/" }
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
    return { name: place.name, url: place.url, addresses };
  }))
  fs.writeFileSync('public/geocoded.json', JSON.stringify(data, null, 2))
}

main();
