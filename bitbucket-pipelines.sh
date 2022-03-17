#!/bin/bash

echo "LOCALES_PATH=$LOCALES_PATH" >> .env
echo "REACT_APP_API_URL=$REACT_APP_API_URL" >> .env
echo "REACT_APP_API_AUTH_URL=$REACT_APP_API_AUTH_URL" >> .env
echo "REACT_APP_API_MAPBOX_TOKEN=$REACT_APP_API_MAPBOX_TOKEN" >> .env
echo "REACT_APP_CARTO=$REACT_APP_CARTO" >> .env
echo "REACT_APP_CARTO_COUNTRIES=$REACT_APP_CARTO_COUNTRIES" >> .env
echo "REACT_APP_CARTO_TABLE=$REACT_APP_CARTO_TABLE" >> .env
echo "REACT_APP_DOWNLOAD_APK_LINK=$REACT_APP_DOWNLOAD_APK_LINK" >> .env
echo "REACT_APP_DOWNLOAD_APK_VERSION=$REACT_APP_DOWNLOAD_APK_VERSION" >> .env
echo "REACT_APP_FACEBOOK_WIDGET_API=$REACT_APP_FACEBOOK_WIDGET_API" >> .env
echo "REACT_APP_GA_UA=$REACT_APP_GA_UA" >> .env
echo "REACT_APP_GFW_API_KEY=$REACT_APP_GFW_API_KEY" >> .env
echo "REACT_APP_GFW_ASSETS_PATH=$REACT_APP_GFW_ASSETS_PATH" >> .env
echo "REACT_APP_TWITTER_WIDGET_API=$REACT_APP_TWITTER_WIDGET_API" >> .env
echo "REACT_APP_GOOGLE_PLACES_API_KEY=$REACT_APP_GOOGLE_PLACES_API_KEY" >> .env
echo "TRANSIFEX_API_TOKEN=$TRANSIFEX_API_TOKEN" >> .env
echo "TRANSIFEX_PROJECT=$TRANSIFEX_PROJECT" >> .env
echo "TRANSIFEX_SLUG=$TRANSIFEX_SLUG" >> .env
echo "TRANSIFEX_URL=$TRANSIFEX_URL" >> .env

if [ $1 = "test" ]
then
  echo "REACT_APP_API_URL=$REACT_APP_API_URL_TEST" >> .env
  echo "REACT_APP_API_AUTH_URL=$REACT_APP_API_AUTH_URL_TEST" >> .env
  echo "REACT_APP_API_AUTH_CALLBACK_URL=$REACT_APP_API_AUTH_CALLBACK_URL_TEST" >> .env
fi

if [ $1 = "staging" ]
then
  echo "REACT_APP_API_URL=$REACT_APP_API_URL_STAGING" >> .env
  echo "REACT_APP_API_AUTH_URL=$REACT_APP_API_AUTH_URL_STAGING" >> .env
  echo "REACT_APP_API_AUTH_CALLBACK_URL=$REACT_APP_API_AUTH_CALLBACK_URL_STAGING" >> .env
fi
