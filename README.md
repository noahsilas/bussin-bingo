# Muni's Bussin' Bingo Map

See it live: [bussin-bingo.vercel.app/](https://bussin-bingo.vercel.app/)

A UI for finding places participating in
[Muni's Bussin' Bingo](https://www.sfmta.com/calendar/munis-bussin-bingo).


## Technical Considerations

Since the idea for this was so simple, I wanted to try to do something
incredibly minimal. No libraries beyond Google Maps, no build step, just
some classic HTML + CSS + JS.

There's no server component. There are no cookies. Your selections of visited
locations are only persisted to your browser's localStorage.

## Geocoding participating locations

After copy/pasting the participating locations from the Bussin' Bingo
announcement, I fed them into the Google Maps geocoder to get locations
that I could plot on the map. The script I used to do so is checked in
and can be run from the root directory of the repo:

```
MAPS_API_KEY=abcd node geocode.js
```
