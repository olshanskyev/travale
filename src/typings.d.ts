import * as L from 'leaflet';

declare let Pace: any;
declare module 'leaflet' {

  function polygon(latlngs: LatLngExpression[] | LatLngExpression[][], options?: PathTransformPolylineOptions): Polygon;

  interface PathTransformPolylineOptions extends PolylineOptions {
    transform?: boolean;
    draggable?: boolean;
  }

  interface PathTransformOptions {
    handlerOptions?: L.PathOptions;
    boundsOptions?: L.PolylineOptions;
    rotateHandleOptions?: L.PolylineOptions;
    handleLength?: number;
    rotation?: boolean;
    scaling?: boolean;
    uniformScaling?: boolean;
  }

  interface Polygon {
    transform: PathTransform;
    dragging: PathDrag;
  }

  interface PathDrag {
    enable(): void;
    disable(): void;
  }

  interface PathTransform {
    enable(options?: PathTransformOptions): void;
    setOptions(options: PathTransformOptions): void;
  }
}
