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
      const order = [];

      questionnaireData.item.forEach(element => {
        const itemKey = `va-${element.linkId.toString()}`;
        uiSchemaObject[itemKey] = { 'ui:options': {} };
        // order.push(itemKey);
        if (
          element.type === R4.Questionnaire_ItemTypeKind._date ||
          element.type === R4.Questionnaire_ItemTypeKind._dateTime ||
          element.type === R4.Questionnaire_ItemTypeKind._time
        ) {
          uiSchemaObject[itemKey] = currentOrPastDateUI(element.text);
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
            uiSchemaObject[itemKey] = {
              'ui:title': element.text,
              'ui:widget': 'radio',
              'ui:options': {
                labels,
              },
            };
          } else {
            uiSchemaObject[itemKey] = {
              'ui:title': element.text,
            };

            Object.keys(labels).forEach(key => {
              uiSchemaObject[itemKey] = {
                ...uiSchemaObject[itemKey],
                [key]: { 'ui:title': labels[key] },
              };
            });
          }
        } else {
          uiSchemaObject[itemKey] = {
            'ui:title': element.text,
          };
        }
        if (element.enableWhen !== undefined) {
          // console.log('CONDITIONAL ENABLEMENT');
          // console.log('uischema when adding conditional: ', uiSchemaObject);

          uiSchemaObject[itemKey]['ui:options'] = {
            ...uiSchemaObject[itemKey]['ui:options'],
            expandUnder: 'va-100',
            expandUnderCondition: '100.01',
          };
        }
      });
      // console.log('Order: ', order);
      uiSchemaObject['ui:order'] = order;
      // console.log('UISCHEMA Object Created: ', uiSchemaObject);
      // console.log('SCHEMA AT UISCHEMA CREATED: ', schema);
      setUiSchema(uiSchemaObject);
      // console.log('UISCema: ', uiSchemaObject);
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
        const itemKey = `va-${element.linkId.toString()}`;

        if (element.required) {
          schemaObject.required.push(itemKey);
        }
        if (
          element.type === R4.Questionnaire_ItemTypeKind._date ||
          element.type === R4.Questionnaire_ItemTypeKind._dateTime ||
          element.type === R4.Questionnaire_ItemTypeKind._time
        ) {
          schemaObject.properties[itemKey] = {
            type: 'string',
          };
        } else if (element.type === R4.Questionnaire_ItemTypeKind._choice) {
          const keysArray = element.answerOption.map(option => {
            return Object.keys(option)[0];
          });
          const subtype =
            element.extension[0].valueCodeableConcept.coding[0].code;
          if (subtype === 'radio-button') {
            schemaObject.properties[itemKey] = {
              type: 'string',
              enum: keysArray,
            };
          } else {
            // Select Group
            const properties = {};
            keysArray.forEach(key => {
              properties[key] = { type: 'boolean' };
            });
            schemaObject.properties[itemKey] = {
              type: 'object',
              properties,
            };
          }
        } else {
          schemaObject.properties[itemKey] = {
            type: element.type,
          };
        }
      });
      // console.log('Schema Object Created: ', schemaObject);

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

// "enableWhen": [
//   {
//     "question": "1.1",
//     "operator": "=",
//     "answerCoding": {
//       "system": "http://terminology.hl7.org/CodeSystem/v2-0136",
//       "code": "Y"
//     }
//   }
// ],
