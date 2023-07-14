import { Icon } from 'leaflet';
import { HistoricKeyType, TourismKeyType } from './poi.data';

export abstract class IconsSericeData {

abstract getDefaultIconByKey(key: TourismKeyType | HistoricKeyType): Icon | undefined;
abstract getMouseOverIconByKey(key: TourismKeyType | HistoricKeyType): Icon | undefined;
abstract getIconUrlByKey(key: string): string | undefined;

}