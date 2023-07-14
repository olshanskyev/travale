import { Component } from '@angular/core';
import * as protomaps from 'protomaps';

@Component({
  selector: 'travale-leaflet-offline-map-component',
  templateUrl: './leaflet-offline-map.component.html',
  styleUrls: ['./leaflet-offline-map.component.scss']
})
export class LeafletOfflineMapComponent  {
/*class MyPlaceSymbolizer {

      draw(context: any, geom: any, z: any, feature: any) {
          //console.log(context);
          const pt = geom[0][0];
          let fill = 'palegreen';
          if (feature.props.place === 'suburb') fill = 'lightgreen';
          if (feature.props.place === 'city') fill = 'mediumseagreen';
          context.fillStyle = fill;
          context.strokeStyle = 'black';
          context.beginPath();
          context.arc(pt.x,pt.y,12,0,2*Math.PI);
          context.stroke();
          context.fill();
      }
  }*/

 /* const PAINT_RULES = [
      {
          dataLayer: 'places',
          symbolizer:new MyPlaceSymbolizer(),
          minzoom: 12
      },
  ];*/

  /*const p = new protomaps.PMTiles('assets/pmtiles/Thessaloniki.pmtiles');

    const layer: L.Layer = protomaps.leafletLayer(
      {
        url:'assets/pmtiles/Thessaloniki.pmtiles',
        paint_rules:PAINT_RULES,

      });


    this.map.addLayer(layer);*/

    //console.log(p);
    /*p.getHeader().then(value => {
      console.log(value);
    })*/


}
