import { PharmaTech } from '@pharmatech/sdk';

const devModeFlag = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

const BASE_URL = 'https://api-d8h5.onrender.com';
const DEV_URL = 'https://api-dev-8jfx.onrender.com';
export const API_URL = devModeFlag ? DEV_URL : BASE_URL;

export const api = PharmaTech.getInstance(devModeFlag);
