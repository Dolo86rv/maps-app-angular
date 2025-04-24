import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';
import { v4 as UUIDV4 } from 'uuid';

mapboxgl.accessToken = environment.mapboxKey;

interface Marker {
  id: string;
  mapboxMarker: mapboxgl.Marker;
}

@Component({
  selector: 'app-markers-page',
  imports: [],
  templateUrl: './markers-page.component.html',
})
export class MarkersPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal< mapboxgl.Map | null>(null);
  markers = signal<Marker[]>([]);

  async ngAfterViewInit(){
    await new Promise((resolve) => setTimeout(resolve, 80) );
    const element = this.divElement()!.nativeElement;

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [-122.40985, 37.793085], // starting position [lng, lat]
      zoom: 14, // starting zoom
    });

   /* //Añadir un marcador al mapa
    const marker = new mapboxgl.Marker({
      draggable: false,
      color: '#FF0000',
    }).setLngLat([-122.40985, 37.793085]).addTo(map);

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      console.log(lngLat);
    });*/

    this.mapListeners(map);
  }


  mapListeners(map: mapboxgl.Map){
    //Listener para cuando se haga clic en el mapa
    map.on('click', (event) => {
      this.mapClick(event, map)
      })
    /*map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    })

    map.on('moveend', () => {
      const center = map.getCenter();
      this.coordinates.set(center);
    })

    map.on('load', () => {
      console.log('Map loaded');
    })

    map.addControl(new mapboxgl.FullscreenControl());
    map.addControl(new mapboxgl.NavigationControl());
    map.addControl(new mapboxgl.ScaleControl());*/

    this.map.set(map);
  }

  mapClick(event: mapboxgl.MapMouseEvent, map: mapboxgl.Map){
    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );

    const marker = new mapboxgl.Marker({
      color: color,
    }).setLngLat(event.lngLat).addTo(map);

    const newMarker: Marker = {
      id: UUIDV4(),
      mapboxMarker: marker,
    }
    this.markers.set([ newMarker, ...this.markers()]);
    //this.markers.update((markers) => [ newMarker, ...markers]);
  }
}
