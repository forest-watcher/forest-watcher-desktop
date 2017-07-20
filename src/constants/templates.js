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
    "status": "draft"
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

export const QUESTION_TYPES = ['text', 'image', 'list'];

export const QUESTION_OPTIONS = [
    {
        value: 'text',
        label: 'text'
    },
    {
        value: 'image',
        label: 'image'
    },
    {
        value: 'checkbox',
        label: 'checkbox'
    },
    {
        value: 'radio',
        label: 'radio'
    },
        {
        value: 'select',
        label: 'radio'
    },
    {
        value: 'number',
        label: 'number'
    }
];

export default { TEMPLATE, QUESTION, QUESTION_TYPES, QUESTION_OPTIONS };