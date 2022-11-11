# Forest Watcher Web

Web app for managing your [forest watcher](http://forestwatcher.globalforestwatch.org) data.

# API Typescript Codegen

We use `@openapi-codegen/cli` and `@openapi-codegen/typescript` to fetch api schemas from api services (`yaml` hosted files).

reference: https://3sidedcube.atlassian.net/wiki/spaces/GFW/pages/2355494913/Dev+Guides

this will generate for us:

- Interfaces and types
- React Query/Mutations hooks

The GFW api is based on few microservices.

For each microservice we have a script in our `package.json` that generates types/interfaces/hooks for that microservice.

If we want to add support for a new microservice, there is a script for that too!

### Prerequisites

Make sure you have set the api dev url in your `.env` file:

```
REACT_APP_API_CUBE_URL=https://dev-fw-api.globalforestwatch.org
```

### Support for new microservice.

In order to create support for a newly implemented api microservice we can run the command

```
yarn generate:new
```

This will open a wizard setup in the terminal window that will prompt you to fill in values for:

- **File or Url** - select Url
- **`yaml` or `json`** url of API schema
  - e.g https://raw.githubusercontent.com/wri/fw_api/production/docs/fw_api.yaml
- **Namespace** - the name of the microservice
  - e.g api, forms, exports, mail, teams etc..
- **What to generate** - select React Query components
- **Folder** - input `src/generated/<namespace>`

Once done these configurations will be saved and appended to the exported object in `openapi-codegen.config.ts`

In order to interact with the newly added api microservice, we need to generate types, interfaces and hooks.
Let's go ahead and create a new script in our `package.json`

```
"generate:<namespace>": "npx openapi-codegen gen <namespace>",
```

Now run the above command.

Once completed you will see a new folder inside `src/generated` that exports everything we need to interact with the api microservice!

### Support for existing microservice.

Everytime there are backend api changes that get deployed, we need to re-generate types, interfaces and hooks.

in order to do so, we can run the microservice specific script.

example:

```
// Re-generate for api microservice
yarn generate:api

// Re-generate for teams microservice
yarn generate:teams

...etc

```

### Hooks Example

Here is an hook implementation example:

```
import { useGetAllReports } from "generated/forms/formsComponents";

const { httpAuthHeaders } = useAccessToken()
const {
    data: reportsData,
    isLoading: reportsLoading,
    error: reportsError
} = useGetAllReports({ headers: httpAuthHeaders  });

```

# Icons

Easy peasy way to use icons:

When adding a new icon create a `svg` file inside `src/assets/images/icons` and paste the icon svg code.

Remove all colors hex code from all elements attributes (just do CMD+F to search and select all)

replace the hex codes with `currentColor`

example:

```
// BEFORE
<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 6.55556L5.30769 11L15 1" stroke="#FFFFF" stroke-width="1.75" />
</svg>

// AFTER
<svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 6.55556L5.30769 11L15 1" stroke="currentColor" stroke-width="1.75" />
</svg>

```

To use icon:

```
// !IMPORTANT: make sure this is where you import the Icon component from
import Icon from "components/extensive/Icon";


// Full control over size and color through props.

// Icon color will be given by the text-color tailwindcss classname.
// Name prop needs to be equal to the svg filename you saved under assets folder. in this case: check.svg
<Icon name="check" size={22} className="text-neutral-300" />

```

# Transifex

Locales are managed with transifex.
Please setup the [cli tool](https://github.com/transifex/cli) and ensure you have authenticated with the GFW transifex account

Run `yarn transifex:pull` to fetch current translations
This command will also format the fetched translations so we can see changes

Run `yarn transifex:push` to push en.json to Transifex (ensure you have pulled all changes first!)

## License

MIT License
