import { Injectable } from '@angular/core';
import { IconsSericeData } from '../data/icons.data';
import { DivIcon, Icon, IconOptions, PointExpression, divIcon, icon } from 'leaflet';
import { TourismKeyType, HistoricKeyType } from '../data/poi.data';
import { MarkerIconComponent } from 'src/app/custom-components/marker-icon/marker-icon.component';

@Injectable()
export class IconsService extends IconsSericeData {

    private iconDefaultSize: PointExpression = [42,42];
    private iconMouseOverSize: PointExpression = [48, 48];
    private iconAnchorDefault: PointExpression = [21, 42];
    private iconAnchorMouseOver: PointExpression = [24, 48];
    markerIconComponent: MarkerIconComponent;

    private createIcon(iconURL: string, iconSize: PointExpression, iconAnchor: PointExpression): Icon {
        return icon({
            iconUrl: iconURL,
            shadowUrl: 'assets/img/markers/marker-shadow.png',
            iconSize: iconSize,
            iconAnchor: iconAnchor,
            shadowSize: [41,41],
            shadowAnchor: [12, 42],
            popupAnchor:  [0, -48],
            className: 'icon-class',
          });
    }


    private iconColors: {[name in TourismKeyType | HistoricKeyType]?: string } = {
        'attraction': '#6e63bf',
        'viewpoint': '#109e33',
        'artwork': '#d33109',
        'museum': '#de9c0d',
        'information': '#64aece',
        'gallery': '#09244B',
        'monument': '#963c3c',
        'church': '#2da990',
        'memorial': '#003b8f',
        'castle': '#a1177c',
        'theme_park': 'rgb(94, 159, 29)',
        'zoo': 'rgb(37, 177, 105)',
        'castle_wall': 'rgb(43, 131, 203)',
        'citywalls': 'rgb(43, 131, 203)',
        'city_gate': 'rgb(179, 0, 0)',
        'tower': 'rgb(204, 179, 15)',
    };

    private iconsDefaults: {[name in TourismKeyType | HistoricKeyType]?: Icon } = {
        'attraction': this.createIcon('assets/map_icons/favourite-location-svgrepo-com.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'viewpoint': this.createIcon('assets/map_icons/marker-flags-svgrepo-com.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'artwork': this.createIcon('assets/map_icons/map-pin-svgrepo-com.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'museum': this.createIcon('assets/map_icons/museum-pin-svgrepo-com.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'information': this.createIcon('assets/map_icons/nformation-point-pin-svgrepo-com.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'gallery': this.createIcon('assets/map_icons/my_gallery.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'monument': this.createIcon('assets/map_icons/monument-pin-svgrepo-com.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'church': this.createIcon('assets/map_icons/church-pin-svgrepo-com.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'memorial': this.createIcon('assets/map_icons/my_memorial.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'castle': this.createIcon('assets/map_icons/my_castle.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'theme_park': this.createIcon('assets/map_icons/my_theme_park.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'zoo': this.createIcon('assets/map_icons/my_zoo.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'castle_wall': this.createIcon('assets/map_icons/my_wall.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'citywalls': this.createIcon('assets/map_icons/my_wall.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'city_gate': this.createIcon('assets/map_icons/my_city_gate.svg', this.iconDefaultSize, this.iconAnchorDefault),
        'tower': this.createIcon('assets/map_icons/my_tower.svg', this.iconDefaultSize, this.iconAnchorDefault),
    };

    private iconsMouseOver: {[name in TourismKeyType | HistoricKeyType]?: Icon} = {
        'attraction': this.createIcon('assets/map_icons/favourite-location-svgrepo-com.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'viewpoint': this.createIcon('assets/map_icons/marker-flags-svgrepo-com.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'artwork': this.createIcon('assets/map_icons/map-pin-svgrepo-com.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'museum': this.createIcon('assets/map_icons/museum-pin-svgrepo-com.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'information': this.createIcon('assets/map_icons/nformation-point-pin-svgrepo-com.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'gallery': this.createIcon('assets/map_icons/my_gallery.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'monument': this.createIcon('assets/map_icons/monument-pin-svgrepo-com.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'church': this.createIcon('assets/map_icons/church-pin-svgrepo-com.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'memorial': this.createIcon('assets/map_icons/my_memorial.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'castle': this.createIcon('assets/map_icons/my_castle.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'theme_park': this.createIcon('assets/map_icons/my_theme_park.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'zoo': this.createIcon('assets/map_icons/my_zoo.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'castle_wall': this.createIcon('assets/map_icons/my_wall.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'citywalls': this.createIcon('assets/map_icons/my_wall.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'city_gate': this.createIcon('assets/map_icons/my_city_gate.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
        'tower': this.createIcon('assets/map_icons/my_tower.svg', this.iconMouseOverSize, this.iconAnchorMouseOver),
    };

    override getDefaultIconByKey(key: TourismKeyType | HistoricKeyType): Icon<IconOptions> | undefined {
        return this.iconsDefaults[key];
    }

    override getMouseOverIconByKey(key: TourismKeyType | HistoricKeyType): Icon<IconOptions> | undefined {
        return this.iconsMouseOver[key];
    }

    getDefaultRouteIcon(text: number | undefined, textColor: any, markerColor: any): DivIcon {
        const html = `
        <span style="
            font-size: 2rem;
            color: ${textColor};
            display: inline-block;
            font-weight: 700;
            line-height: 1;
            position: relative;
            text-align: center;
            ">
          <span style="
            font-size: 0.5em;
            left: 0px;
            position: absolute;
            right: 0;
            top: 0.4em;
            pointer-events: none;
            z-index: 1;">${text}</span>

          <div style="color: ${markerColor}" >
            <svg style="width: 43px; height: 43px;" role="img"
              onmouseover="this.style.filter='drop-shadow(2px 4px 6px black)';"
              onmouseout="this.style.filter='none';"
              xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
              <path fill="currentColor" d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"
              />
            </svg>
          </div>
        </span>`;

        return divIcon({
            className: 'my-custom-pin',
            iconSize: [43,43],
            html: html,
            shadowUrl: 'assets/img/markers/marker-shadow.png',
            iconAnchor: [22, 43],
            popupAnchor:  [0, -48]
        });
    }

    override getIconUrlByKey(key: string): string | undefined {
        if ((this.iconsDefaults as any)[key]) {
            const icon =(this.iconsDefaults as any)[key];
            return icon.options['iconUrl'];
        } else {
            return 'assets/img/markers/marker-icon.png';
        }
    }

    override getIconColorByKey(key: string): string {
        if ((this.iconColors as any)[key]) {
            return (this.iconColors as any)[key];
        } else {
            return 'var(--color-basic-700)';
        }
    }


}