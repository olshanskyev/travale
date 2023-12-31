import { DivIcon, Icon } from 'leaflet';
import { HistoricKeyType, TourismKeyType } from './poi.data';

export abstract class IconsSericeData {

abstract getDefaultIconByKey(key: TourismKeyType | HistoricKeyType): Icon | undefined;
abstract getMouseOverIconByKey(key: TourismKeyType | HistoricKeyType): Icon | undefined;
abstract getIconUrlByKey(key: string): string | undefined;
abstract getIconColorByKey(key: string): string;
abstract craeteBoundingBoxIcon(): DivIcon;
abstract getDefaultRouteIcon(text: number | undefined, textColor: any, markerColor: any): DivIcon

}