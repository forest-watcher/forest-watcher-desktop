// API URLs
export const API_BASE_URL = process.env.REACT_APP_API_AUTH;
export const CARTO_URL = process.env.REACT_APP_CARTO;
export const API_CALLBACK_URL = process.env.REACT_APP_API_AUTH_CALLBACK_URL;
export const MAPBOX_TOKEN = process.env.REACT_APP_API_MAPBOX_TOKEN;

export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_FORMAT = 'DD/MM/YYYY';
export const ADMIN = 'ADMIN';
export const USER = 'USER';
export const CONFIRMED_USER = 'CONFIRMED_USER';
export const MAX_NUMBER_OF_LAYERS = 2;
export const TABLE_PAGE_SIZE = 8;

export default { API_BASE_URL, API_CALLBACK_URL, MAPBOX_TOKEN, DEFAULT_LANGUAGE, ADMIN, USER, CARTO_URL, MAX_NUMBER_OF_LAYERS, TABLE_PAGE_SIZE };
