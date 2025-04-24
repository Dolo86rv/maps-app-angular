import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { environment } from '../../../environments/environment.development';
import { DecimalPipe, JsonPipe } from '@angular/common';

mapboxgl.accessToken = environment.mapboxKey;

@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
  templateUrl: './fullscreen-map-page.component.html',
  styles:`
    div {
      height: calc( 100vh - 64px );
      width: 100vw;
    }

    #control {
      background-color: white;
      padding: 10px;
      border-radius: 5px;
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      border: 1px solid #e2e8f0;
      width: 250px;
    }
  `
})
export class FullscreenMapPageComponent implements AfterViewInit {
  divElement = viewChild<ElementRef>('map');
  map = signal< mapboxgl.Map | null>(null);
  zoom = signal(14);
  coordinates = signal({
    lng: -74.5,
    lat: 40
  });

  zoomEffect = effect(() => {
    if(!this.map()) return;
    this.map()?.zoomTo(this.zoom());
  });

  async ngAfterViewInit(){
    if(!this.divElement()?.nativeElement) return;

    await new Promise((resolve) => setTimeout(resolve, 80) );
    const element = this.divElement()!.nativeElement;
    const { lat, lng } = this.coordinates();

    const map = new mapboxgl.Map({
      container: element, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: [lat, lng], // starting position [lng, lat]
      zoom: this.zoom(), // starting zoom
    });

    this.mapListeners(map);
  }

  mapListeners(map: mapboxgl.Map){
    map.on('zoomend', (event) => {
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
    map.addControl(new mapboxgl.ScaleControl());

    this.map.set(map);
  }

}
