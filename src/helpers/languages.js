const setLanguages = (selected, state) => {
  const activeLanguages = state.languages;
  activeLanguages.indexOf(selected) === -1 && activeLanguages.push(selected);
  const index = activeLanguages.indexOf(state.defaultLanguage);
  if (index > -1) {
    activeLanguages.splice(index, 1);
  }
  return activeLanguages;
};

const traverseLanguageObjects = (state, keys, oldLang, newLang) => {
  // This function handles arrays and objects
  for (var field in state) {
    if (typeof state[field] === "object" && keys.indexOf(field) > -1 && field !== "languages") {
      // lets change out them keys
      state[field][newLang] = state[field][oldLang];
      delete state[field][oldLang];
    } else if (typeof state[field] === "object" && state[field] !== null) {
      // object but not one we want to change, start again
      traverseLanguageObjects(state[field], keys, oldLang, newLang);
    } else {
      // lets start again!
    }
  }
  return state;
};

const syncLanguagesWithDefaultLanguage = (newLanguage, currentState) => {
  const langKeys = ["name", "label", "defaultValue", "values"];
  let state = { ...currentState };
  const currentLanguage = state.defaultLanguage;

  // Lets recursively fix those language objects
  const updatedState = traverseLanguageObjects(state, langKeys, currentLanguage, newLanguage);

  return updatedState;
};

export { setLanguages, syncLanguagesWithDefaultLanguage };
