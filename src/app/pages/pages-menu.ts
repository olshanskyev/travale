import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Home',
    link: '/pages/home',
    icon: {
      icon: 'ios-home',
      pack: 'ion'
    },
    home: true,
  },
  {
    title: 'CreateRoute',
    link: '/pages/create-route',
    icon: {
      icon: 'ios-navigate',
      pack: 'ion'
    },
  },
  {
    title: 'Map',
    link: '/pages/map',
    icon: {
      icon: 'ios-map',
      pack: 'ion'
    },
  },

  {
    title: 'Management',
    icon: {
      icon: 'ios-construct',
      pack: 'ion'
    },
    group: true,
  },
  {
    title: 'NewDestination',
    link: '/pages/destinations/new-destination',
    icon: {
      icon: 'ios-add-circle-outline',
      pack: 'ion'
    },

  },
];