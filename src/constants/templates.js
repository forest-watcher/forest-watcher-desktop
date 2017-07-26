export const TEMPLATE = {
    "name": {
        "en": ""
    },
    "languages": [
        "en"
    ],
    "defaultLanguage": "en",
    "areaOfInterest": null,
    "questions": [],
    "public": false,
    "status": "unpublished"
}

export const QUESTION = {
    "type": "text",
    "name": "",
    "conditions": [],
    "childQuestions": [],
    "order": 0,
    "required": false,
    "values": {},
    "label": {}
};

export const CHILD_QUESTION = {
    "type": "text",
    "name": "more-info",
    "conditionalValue": 0,
    "order": 0,
    "required": false,
    "label": {},
    "values": {}
}

export const QUESTION_TYPES = ['text', 'image', 'checkbox', 'radio', 'select', 'number'];

export default { TEMPLATE, QUESTION, QUESTION_TYPES };