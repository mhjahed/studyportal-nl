export const NAV_ITEMS = {
  primary: [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: 'bx-home-alt',
      exact: true,
    },
    {
      to: '/register-interview',
      label: 'Book interview',
      icon: 'bx-calendar-plus',
    },
    {
      to: '/upcoming-interviews',
      label: 'Upcoming interviews',
      icon: 'bx-calendar-event',
    },
    {
      to: '/notifications',
      label: 'Notifications',
      icon: 'bx-bell',
    },
  ],
  secondary: [
    {
      to: '/results',
      label: 'Results',
      icon: 'bx-award',
    },
    {
      to: '/scorecard',
      label: 'Scorecards',
      icon: 'bx-line-chart',
    },
    {
      to: '/documents',
      label: 'Documents',
      icon: 'bx-file',
    },
    {
      to: '/visa-updates',
      label: 'Study updates',
      icon: 'bx-news',
    },
  ],
  account: [
    {
      to: '/profile',
      label: 'Profile',
      icon: 'bx-user',
    },
    {
      to: '/settings',
      label: 'Settings',
      icon: 'bx-cog',
    },
  ],
  // Mobile bottom nav (5 max)
  mobile: [
    {
      to: '/dashboard',
      label: 'Dashboard',
      mobileLabel: 'Home',
      icon: 'bx-home-alt',
      exact: true,
    },
    {
      to: '/upcoming-interviews',
      label: 'Upcoming interviews',
      mobileLabel: 'Interviews',
      icon: 'bx-calendar-event',
    },
    {
      to: '/register-interview',
      label: 'Book interview',
      mobileLabel: 'Book',
      icon: 'bx-calendar-plus',
    },
    {
      to: '/notifications',
      label: 'Notifications',
      mobileLabel: 'Alerts',
      icon: 'bx-bell',
    },
    {
      to: '/profile',
      label: 'Profile',
      mobileLabel: 'Profile',
      icon: 'bx-user',
    },
  ],
}