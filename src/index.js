import initMap from "./map";
import * as ymaps from "faker/locale/.publish/scripts/prettify/jquery.min";

ymaps.ready(() => {
  initMap(ymaps, "map");
  console.log("inited");
});
