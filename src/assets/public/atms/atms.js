import '../_config/header/header.js'
import '../atms/_atms.scss'

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('bearerToken')) {
    ymaps.ready(init)
  } else {
    document.location.href = 'index.html'
  }
})

async function init() {
  const banksUrl = new URL(`http://localhost:3000/banks`)
  let myMap = new ymaps.Map('map', {
    center: [55.75, 37.61],
    zoom: 11,
  })
  let coords = []
  await fetch(banksUrl, {
    headers: {
      Authorization: `Basic ${localStorage.getItem('bearerToken')}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      res.payload.forEach((coord) => {
        coords.push([
          Number(coord.lat.toFixed(2)),
          Number(coord.lon.toFixed(2)),
        ])
      })
    })
  let myCollection = new ymaps.GeoObjectCollection()
  for (let i = 0; i < coords.length; i++) {
    myCollection.add(new ymaps.Placemark(coords[i]))
  }
  const mapElement = document.getElementById('map')
  mapElement.classList.remove('skeleton')
  myMap.geoObjects.add(myCollection)
}
