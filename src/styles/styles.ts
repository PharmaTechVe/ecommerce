import { Poppins } from 'next/font/google';
import '../styles/globals.css';

export const Colors = {
  primary: '#1C2143',
  secondary: '#2ECC71',
  secondaryLight: '#A3E4D7',
  secondaryWhite: '#FFFFFF',
  disabled: '#D3D3D3',
  primaryTransparent: 'rgb(28, 33, 67, .75)',
  neuter: '#6B7280',
  ribbon: '#FFD569',

  textMain: '#393938',
  textWhite: '#FFFFFF',
  textHighContrast: '#000000',
  textLowContrast: '#666666',
  stroke: '#DFE4EA',
  disableText: '#777675',
  placeholder: '#666666',

  semanticSuccess: '#00C814',
  semanticWarning: '#FFD569',
  semanticDanger: '#E10000',
  semanticInfo: '#A3E4D7',

  iconMainDefault: '#292D32',
  iconWhite: '#FFFFFF',
  iconMainPrimary: '#1C2143',
  iconMainSecondary: '#A3E4D7',

  menuWhite: '#FFFFFF',
  menuPrimary: '#1C2143',

  toggleOn: '#1C2143',
  toggleOff: '#D7D5D3',
};

export const FontSizes = {
  h1: { size: 48, lineHeight: 58 },
  h2: { size: 40, lineHeight: 48 },
  h3: { size: 32, lineHeight: 38 },
  h4: { size: 28, lineHeight: 34 },
  h5: { size: 24, lineHeight: 28 },
  s1: { size: 18, lineHeight: 28 },
  s2: { size: 16, lineHeight: 24 },
  b1: { size: 16, lineHeight: 24 },
  b3: { size: 14, lineHeight: 20 },
  c1: { size: 12, lineHeight: 16 },
  c3: { size: 10, lineHeight: 14 },
  label: { size: 12, lineHeight: 16 },
};

export const CardDimensions = {
  cardSizes: {
    regular: 'w-[351px] h-[610px]',
    minimal: 'w-[253px] h-[399px]',
    responsive: 'w-[170px] h-[302px]',
  },

  ribbonDimensions: {
    regular: { width: '98px', height: '100px', svgWidth: 98, svgHeight: 98 },
    minimal: { width: '90px', height: '90px', svgWidth: 90, svgHeight: 90 },
    responsive: { width: '', height: '', svgWidth: 0, svgHeight: 0 },
  },
};
export const baseStyles = {
  container: {
    paddingX: {
      regular: 'px-[16px]',
      minimal: 'px-[24px]',
      responsive: 'px-[24px]',
    },
  },
  responsiveButtonMargin: 'mt-[-10px] mb-[5px]',
  stockSpacing: {
    minimal: 'mb-[5px] mt-[20px]',
    responsive: 'mb-[2px] mt-[10px]',
    regular: 'mb-[20px] mt-[38px]',
  },
  priceContainerPaddingBottom: {
    minimal: 'pb-[16px]',
    responsive: 'pb-[6px]',
    default: 'pb-[30px]',
  },
  lastPriceMarginTop: {
    responsive: 'mt-[5px]',
    regular: 'mt-[10px]',
  },
  currentPriceMarginTop: {
    minimal: 'mt-[10px]',
    responsive: 'mt-[5px]',
    regular: 'mt-[16px]',
  },
};
export const imageSizes = {
  regular: { width: 300, height: 300 },
  minimal: { width: 200, height: 200 },
  responsive: { width: 150, height: 150 },
};

export const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '900'],
});

const theme = {
  Colors,
  FontSizes,
  poppins,
  baseStyles,
  imageSizes,
};

export default theme;
