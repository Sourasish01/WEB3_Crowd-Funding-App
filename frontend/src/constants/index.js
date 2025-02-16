import dashboard from '../assets/dashboard.svg';
import createCampaign from '../assets/create-campaign.svg';
import payment from '../assets/payment.svg';
import withdraw from '../assets/withdraw.svg';
import profile from '../assets/profile.svg';
import logout from '../assets/logout.svg';

export const navlinks = [
  {
    name: 'dashboard',
    imgUrl: dashboard,
    link: '/',
  },
  {
    name: 'campaign',
    imgUrl: createCampaign,
    link: '/create-campaign',
  },
  {
    name: 'payment',
    imgUrl: payment,
    link: '/',
  },
  {
    name: 'withdraw',
    imgUrl: withdraw,
    link: '/',
  },
  {
    name: 'profile',
    imgUrl: profile,
    link: '/profile',
  },
  {
    name: 'logout',
    imgUrl: logout,
    link: '/',
  },
];