export const TEMPLATE = {
    "name": {
        "en": ""
    },
    "languages": [
        "en"
    ],
    "defaultLanguage": "en",
    "areaOfInterest": "",
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

export const QUESTION_TYPES = ['text', 'image', 'checkbox', 'radio', 'select', 'number'];

export default { TEMPLATE, QUESTION, QUESTION_TYPES };