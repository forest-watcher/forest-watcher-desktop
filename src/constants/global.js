// env
export const API_BASE_URL = process.env.REACT_APP_API_AUTH;
export const CARTO_URL = process.env.REACT_APP_CARTO;
export const CARTO_TABLE = process.env.REACT_APP_CARTO_TABLE;
export const API_CALLBACK_URL = process.env.REACT_APP_API_AUTH_CALLBACK_URL;
export const CARTO_COUNTRIES = process.env.REACT_APP_CARTO_COUNTRIES;
export const GFW_API_KEY = process.env.REACT_APP_GFW_API_KEY;
export const TWITTER_WIDGET_API = process.env.REACT_APP_TWITTER_WIDGET_API;
export const FACEBOOK_WIDGET_API = process.env.REACT_APP_FACEBOOK_WIDGET_API;
export const GA_UA = process.env.REACT_APP_GA_UA;
export const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;
export const ENVIRONMENT = process.env.NODE_ENV
export const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY

// constants
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_FORMAT = 'DD/MM/YYYY';
export const ADMIN = 'ADMIN';
export const USER = 'USER';
export const CONFIRMED_USER = 'CONFIRMED_USER';
export const MAX_NUMBER_OF_LAYERS = 2;
export const TABLE_PAGE_SIZE = 8;
export const MANAGER = 'MANAGER';
export const MY_GFW_LINK = 'https://www.globalforestwatch.org/my_gfw';

export const LAYERS_BLACKLIST = [6];

export default {
  API_BASE_URL,
  API_CALLBACK_URL,
  DEFAULT_LANGUAGE,
  ADMIN,
  USER,
  CARTO_URL,
  CARTO_COUNTRIES,
  MAX_NUMBER_OF_LAYERS,
  TABLE_PAGE_SIZE,
  GFW_API_KEY,
  TWITTER_WIDGET_API,
  FACEBOOK_WIDGET_API,
  GA_UA,
  GOOGLE_PLACES_API_KEY,
  MY_GFW_LINK
};
