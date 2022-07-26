# Forest Watcher Web

Web app for managing your [forest watcher](http://forestwatcher.globalforestwatch.org) data.

## Transifex
Locales are managed with transifex.
Please setup the [cli tool](https://github.com/transifex/cli) and ensure you have authenticated with the GFW transifex account

Run `yarn transifex:pull` to fetch current translations
This command will also format the fetched translations so we can see changes

Run `yarn transifex:push` to push en.json to Transifex (ensure you have pulled all changes first!)

## License
MIT License