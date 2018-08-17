import { loadList, loadDetails } from './api';
import { getDetailsContentLayout } from './details';
import { createFilterControl } from './filter';
import {hasInactiveStation} from "./cluster";

export default function initMap(ymaps, containerId) {
  const myMap = new ymaps.Map(containerId, {
    center: [55.76, 37.64],
    controls: [],
    zoom: 10
  });

  const objectManager = new ymaps.ObjectManager({
    clusterize: true,
    gridSize: 64,
    clusterIconLayout: 'default#pieChart',
    clusterDisableClickZoom: false,
    geoObjectOpenBalloonOnClick: false,
    geoObjectHideIconOnBalloonOpen: false,
    geoObjectBalloonContentLayout: getDetailsContentLayout(ymaps)
  });

  objectManager.clusters.events.add('add', function(e) {
    let cluster = objectManager.clusters.getById(e.get('objectId')),
        objects = cluster.properties.geoObjects;
        objectManager.clusters.setClusterOptions(cluster.id, {
            preset: hasInactiveStation(objects) ? 'islands#redClusterIcons' : 'islands#greenClusterIcons'
        });

  });

  loadList().then(data => {
    objectManager.add(data);
    myMap.geoObjects.add(objectManager);
  });

  // details
    objectManager.objects.events.add('click', event => {
    const objectId = event.get('objectId');
    const obj = objectManager.objects.getById(objectId);

    objectManager.objects.balloon.open(objectId);

    if (!obj.properties.details) {
      loadDetails(objectId).then(data => {
        obj.properties.details = data;
        objectManager.objects.balloon.setData(obj);
      });
    }
  });

  // filters
  const listBoxControl = createFilterControl(ymaps);
  myMap.controls.add(listBoxControl);

    const filterMonitor = new ymaps.Monitor(listBoxControl.state);
    filterMonitor.add('filters', filters => {
    objectManager.setFilter(
      obj => filters[obj.isActive ? 'active' : 'defective']
    );
  });
}
