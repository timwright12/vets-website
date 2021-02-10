import { useEffect, useState } from 'react';
import questionnaireData from '../config/testQuestionnaire.json';
import currentOrPastDateUI from 'platform/forms-system/src/js/definitions/currentOrPastDate';
import { R4 } from '@ahryman40k/ts-fhir-types';

export default function useSchemas() {
  const [uiSchema, setUiSchema] = useState({});
  const [schema, setSchema] = useState({});

  useEffect(() => {
    function createUISchema() {
      const uiSchemaObject = {};
      questionnaireData.item.forEach(element => {
        if (
          element.type === R4.Questionnaire_ItemTypeKind._date ||
          element.type === R4.Questionnaire_ItemTypeKind._dateTime ||
          element.type === R4.Questionnaire_ItemTypeKind._time
        ) {
          uiSchemaObject[element.linkId.toString()] = currentOrPastDateUI(
            element.text,
          );
        } else if (element.type === R4.Questionnaire_ItemTypeKind._choice) {
          const labels = {};
          element.answerOption.forEach(option => {
            const key = Object.keys(option)[0];
            labels[key] = option[key].valueString;
          });
          if (
            element.extension[0].valueCodeableConcept.coding[0].code ===
            'radio-button'
          ) {
            uiSchemaObject[element.linkId.toString()] = {
              'ui:title': element.text,
              'ui:widget': 'radio',
              'ui:options': {
                labels,
              },
            };
          } else {
            const schemaKey = element.linkId.toString();

            uiSchemaObject[schemaKey] = {
              'ui:title': element.text,
            };

            Object.keys(labels).forEach(key => {
              uiSchemaObject[schemaKey] = {
                ...uiSchemaObject[schemaKey],
                [key]: { 'ui:title': labels[key] },
              };
            });
          }
        } else {
          uiSchemaObject[element.linkId.toString()] = {
            'ui:title': element.text,
          };
        }
      });
      setUiSchema(uiSchemaObject);
      return uiSchema;
    }
    function createSchema() {
      const schemaObject = {
        type: 'object',
        properties: [],
        questionnaireId: questionnaireData.id,
        required: [],
      };
      questionnaireData.item.forEach(element => {
        if (element.required) {
          schemaObject.required.push(element.linkId.toString());
        }
        if (
          element.type === R4.Questionnaire_ItemTypeKind._date ||
          element.type === R4.Questionnaire_ItemTypeKind._dateTime ||
          element.type === R4.Questionnaire_ItemTypeKind._time
        ) {
          schemaObject.properties[element.linkId.toString()] = {
            type: 'string',
          };
        } else if (element.type === R4.Questionnaire_ItemTypeKind._choice) {
          const keysArray = element.answerOption.map(option => {
            return Object.keys(option)[0];
          });
          const subtype =
            element.extension[0].valueCodeableConcept.coding[0].code;
          if (subtype === 'radio-button') {
            schemaObject.properties[element.linkId.toString()] = {
              type: 'string',
              enum: keysArray,
            };
          } else {
            // Select Group
            const properties = {};
            keysArray.forEach(key => {
              properties[key] = { type: 'boolean' };
            });
            schemaObject.properties[element.linkId.toString()] = {
              type: 'object',
              properties,
            };
          }
        } else {
          schemaObject.properties[element.linkId.toString()] = {
            type: element.type,
          };
        }
      });
      setSchema(schemaObject);
      return schema;
    }

    createSchema();
    createUISchema();
  }, []);

  return [uiSchema, schema];
}

/*
,
    {
      "extension": [
        {
          "url": "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
          "valueCodeableConcept": {
            "coding": [
              {
                "system": "http://hl7.org/fhir/questionnaire-item-control",
                "code": "check-box",
                "display": "Check-Box"
              }
            ],
            "text": "A control where choices are listed with a box beside them. The box can be toggled to select or de-select a given choice. Multiple selections may be possible."
          }
        }
      ],
      "linkId": "08",
      "text": "Select a truck",
      "type": "choice",
      "required": false,
      "answerOption": [
        { "08.01": { "valueString": "Tesla" } },
        { "08.02": { "valueString": "Rivian" } },
        { "08.03": { "valueString": "E150" } }
      ]
    }
*/

// _error3 = TypeError: Cannot read property '08' of null at eval (webpack-internal:///./src/platform/forms-system/src/js/state/helpers.js:65:62) at Array.reduce (<anonymous>) at get (webpack-internal:///./src/platform/forms-system/src/js/state/helpers.js:64:15) at setHiddenFields (webpack-internal:///./src/platform/forms-system/src/js/state/helpers.js:169:26) at eval (webpack-internal:///./src/platform/forms-system/src/js/state/helpers.js:197:23) at Array.reduce (<anonymous>) at setHiddenFields (webpack-internal:///./src/platform/forms-system/src/js/state/helpers.js:196:63) at eval (webpack-internal:///./src/platform/forms-system/src/js/state/helpers.js:197:23) at Array.reduce (<anonymous>) at setHiddenFields (webpack-internal:///./src/platform/forms-system/src/js/state/helpers.js:196:63)
