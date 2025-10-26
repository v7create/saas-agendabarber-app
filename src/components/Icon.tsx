
import React from 'react';
import {
  BiCut, BiLogIn, BiLogOut, BiCalendar, BiDollar, BiGroup, BiUser, BiTimeFive,
  BiPlus, BiCheck, BiStar, BiDotsVerticalRounded, BiX, BiSearch,
  BiFilterAlt, BiUpArrowAlt, BiDownArrowAlt, BiChevronLeft,
  BiChevronRight, BiDownload, BiHistory, BiBell, BiMenu, BiHome,
  BiCreditCard, BiReceipt, BiTrendingUp, BiMoney, BiFace, BiBrush, BiLayer,
  BiLogoWhatsapp, BiPencil, BiTrash, BiCheckCircle, BiLogoInstagram, BiLogoFacebook,
  BiLogoTiktok, BiMap, BiGlobe, BiPhone, BiPalette, BiKey, BiShieldQuarter,
  BiHelpCircle, BiGift, BiCog, BiLogoGoogle, BiArchive, BiDoorOpen, BiWallet
} from 'react-icons/bi';

interface IconProps {
  name: string;
  className?: string;
}

const iconMap: { [key: string]: React.ElementType } = {
  scissors: BiCut,
  login: BiLogIn,
  logout: BiLogOut,
  calendar: BiCalendar,
  dollar: BiDollar,
  users: BiGroup,
  user: BiUser,
  clock: BiTimeFive,
  plus: BiPlus,
  check: BiCheck,
  star: BiStar,
  dots: BiDotsVerticalRounded,
  x: BiX,
  search: BiSearch,
  filter: BiFilterAlt,
  arrowUp: BiUpArrowAlt,
  arrowDown: BiDownArrowAlt,
  left: BiChevronLeft,
  right: BiChevronRight,
  download: BiDownload,
  history: BiHistory,
  bell: BiBell,
  menu: BiMenu,
  home: BiHome,
  payment: BiCreditCard,
  receipt: BiReceipt,
  trendUp: BiTrendingUp,
  cash: BiMoney,
  wallet: BiWallet,
  creditCard: BiCreditCard,
  face: BiFace,
  brush: BiBrush,
  layer: BiLayer,
  whatsapp: BiLogoWhatsapp,
  door: BiDoorOpen,
  pencil: BiPencil,
  trash: BiTrash,
  checkCircle: BiCheckCircle,
  instagram: BiLogoInstagram,
  facebook: BiLogoFacebook,
  tiktok: BiLogoTiktok,
  map: BiMap,
  globe: BiGlobe,
  phone: BiPhone,
  palette: BiPalette,
  key: BiKey,
  shield: BiShieldQuarter,
  help: BiHelpCircle,
  gift: BiGift,
  settings: BiCog,
  google: BiLogoGoogle,
  inbox: BiArchive,
};

export const Icon: React.FC<IconProps> = ({ name, className }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found.`);
    return null; 
  }
  return <IconComponent className={className} />;
};