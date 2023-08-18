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
    title: 'Routes',
      expanded: true,
      children: [
        {
          title: 'CreateRoute',
          link: '/pages/routes/create',
          icon: {
            icon: 'ios-add-circle-outline',
            pack: 'ion'
          },
        },
        {
          title: 'Drafts',
          link: '/pages/routes/drafts',
          icon: {
            icon: 'edit-2-outline',
            pack: 'eva'
          },
        },
      ],
      icon: {
        icon: 'ios-navigate',
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
];
