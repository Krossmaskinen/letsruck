<script>
  import "../node_modules/leaflet/dist/leaflet.css";
  import "../node_modules/leaflet-control-geocoder/dist/Control.Geocoder.css";

  import { onMount } from "svelte";
  import L from "leaflet";
  import "leaflet-control-geocoder";

  export let coords;
  export let isEditable = false;
  export let clickedPosition;
  export let address;

  const mapId = (Math.random()).toString().replace(".", "-") + "-map";
  const mapBoxAccessToken = "pk.eyJ1Ijoia3Jvc3NtYXNraW5lbiIsImEiOiJja2ZxeGJ0NXQwemk2MnBsaG1qM21venJvIn0.DGN3U88UvVLaEZmEAqd0mg";
  const locationIqToken = "d92afb4d27af3f";
  const reverseGeocodingUrl = "https://us1.locationiq.com/v1/reverse.php?key={token}&lat={lat}&lon={lng}&format=json"

  let map;
  let popup;
  let markers = [];

  onMount(() => {
    initMap();
  });

  $: console.log("editable", isEditable);

  async function initMap() {
     map = L.map(mapId).setView(coords, 13);
     L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: mapBoxAccessToken
    }).addTo(map);

    popup = L.popup({
      closeOnClick: false
    });

    if (isEditable) {
      addGeocoderToMap();
      initPopupOnClick();
    }

    if (!address) {
      const result = await getReverseGeocoding(coords);
      address = getDisplayTextFromAddress(result.address);
    }

    showPopupOnMap(coords, address);
    addMarkerOnMap(coords);
  }

  function addGeocoderToMap() {
    const geocoder = L.Control.geocoder();

    geocoder.on("markgeocode", (event) => {
      clickedPosition = [event.geocode.center.lat, event.geocode.center.lng];
    });
    geocoder.addTo(map);
  }

  function addMarkerOnMap(markerCoords) {
    const marker = L.marker(markerCoords);

    markers.forEach(m => m.remove());
    markers = [marker];
    marker.addTo(map);
  }

  function showPopupOnMap(coords, content) {
    if (!!content) {
      popup.setLatLng(coords)
      .setContent(content)
      .openOn(map);
    }
  }

  async function initPopupOnClick() {
    popup = L.popup();
    map.on("click", async (event) => {
      const result = await getReverseGeocoding([event.latlng.lat, event.latlng.lng]);
      clickedPosition = [event.latlng.lat, event.latlng.lng];

      if (isEditable) {
        address = getDisplayTextFromAddress(result.address);
        showPopupOnMap(event.latlng, address);
        addMarkerOnMap(event.latlng);
      }
    });
  }

  async function getReverseGeocoding(coords) {
    const requsetUrl = reverseGeocodingUrl.replace("{token}", locationIqToken).replace("{lat}", coords[0]).replace("{lng}", coords[1]);
    let result = await fetch(requsetUrl);
    result = await result.json();

    console.log(result);
    return result;
  }

  function getDisplayTextFromAddress(address) {
    let displayText = `${address.road}${address.house_number ? ` ${address.house_number}` : ''}`;
    displayText += address.town ? `, ${address.town}` : `, ${address.city}`;
    displayText += `, ${address.country}`;

    return displayText;
  }
</script>

<div class="map-div" id={mapId}></div>

<style>
  .map-div {
    height: 280px;
  }
</style>