"use strict";

const _ = require('lodash');
const fs = require('fs');

const schemaDir = '.';
const schemaName  = 'bundles.json';
const nodeDir = '../../../../../../../cms-export/content';

const schema = loadSchema();

class Transformer {
  /**
   * Create a Transformer.
   * @param {String} nodeName - The name of the node's file
   * 1. loads the node file
   * 2. gets the corresponding schema from the bundles
   * 3. Applies the schema, populates the fields
   * 4. Recursively gets the references (includes) for the node
   * 5. Saves the json file
   */

  constructor(nodeFile) {
    this.nodeFile = nodeFile; // the node file we're processing
    this.nodeSchema = {}; // The schema for the current node
    this.outJson = {}; // The JSON output goes in here
    const currentNode = this.loadNode();
    if (currentNode) {
      if(this.nodeType === 'content_type') {
        this.getMetaTags();
        this.populateNode();
      } else {
        this.nodeSchema = schema[this.fullBundleName];
      }
      this.populateFields();
      this.populateReferences();
      this.prettyOutJson = JSON.stringify(this.outJson, null, 2);
    }
  }

  loadNode() {
    const nodePath = `${nodeDir}/${this.nodeFile}.json`;
    const rawContent = fs.readFileSync(nodePath);
    this.node = JSON.parse(rawContent);
    if(!this.node.type) {
      console.error('Unknown file type:');
      return(false); // TODO doesn't work for taxonomy. Anything else?
    }
    this.nodeType = this.node.type[0].target_type;
    // switch from the name in the file to 
    // what we use in the schema
    // TODO understand better the relationship between these
    switch (this.nodeType) {
      case 'paragraphs_type':
        this.nodeType = 'paragraph_type'; 
      break;
      case 'node_type':
        this.nodeType = 'content_type'; 
      break;
      case 'block_content_type':
        this.nodeType = 'custom_block_type'; 
      break;
      default:
        console.error('Unknown node type:', this.nodeType);
      return (false);
    }
    this.bundleType = this.node.type[0].target_id;
    this.fullBundleName = `${this.nodeType}.${this.bundleType}`;  
    console.log('---- loaded:', this.nodeType, `${this.nodeFile}.json`);
    return(true);
  }

  getMetaTags() {
    /* Generate an array with the following fields
    {
    "__typename": "MetaValue",
    "key": "title",
    "value": "Coronavirus FAQs: What Veterans Need To Know | Veterans Affairs"
    },
    */ 
    const metaTags = [];
    _.map(this.node.metatag.value, (value, key) => {
      const metaTag = {
        "__typename": "MetaValue",
        "key": key,
        "value": value,
      }
      metaTags.push(metaTag);
    });
    this.metaTags = metaTags;
  }

  populateNode() {
    const node = this.node
    this.bundleType = node.type[0].target_id;
    this.fullBundleName = `${this.nodeType}.${this.bundleType}`;  
    this.nodeSchema = schema[this.fullBundleName];
    console.log(this.fullBundleName, this.nodeSchema)
    const jsonSchema = JSON.stringify(this.nodeSchema, null, 2);
    this.outJson = {
      "entityBundle": this.bundleType,
      "entityId": node.nid[0].value.toString(),
      "entityPublished": node.moderation_state[0].value === 'published',
      "title": node.title[0].value,
      "entityUrl": node.entityUrl,
      "entityMetatags": this.metaTags,
      // TODO "entityMetatags": 
    };

  }

  populateFields() {
    _.map(this.nodeSchema.fields, (value, key) => {
      const fieldName = value['Machine name'];
      const fieldType = value['Field type'];
      const fieldValue = this.populateFieldValue(fieldType, fieldName);
    });
  }

  populateFieldValue(type, fieldName) {
    const field = this.node[fieldName];
    if(field === undefined) {
      console.error('empty', fieldName);
      return (null);
    }

    if (type.startsWith('Entity reference') || (type === 'Link')  ||
        (type === 'Meta tags')) {
      return (null);
    }

    if (type.startsWith('Text') || type === 'List (text)') {
      if(field && field[0]) {
        if (field[0].format === 'rich_text') {
          this.outJson[_.camelCase(fieldName)] = {
            'processed': field[0].value, //TODO process the HTML
          }
        } else {
          this.outJson[_.camelCase(fieldName)] = field[0].value;
        }
        return;
      } else {
        return (null);
      }
    }

    switch (type) {
      case 'Boolean':
        return this.node[fieldName];
      break;
      case 'Date':
        if (field[0]) {
        this.outJson[_.camelCase(fieldName)] = { 
          date: field[0].value
        }
      }
      break;
      default:
        console.log('unhandled type -' + type + '-');
      console.log( this.node[fieldName]);
      return(null);
    }
  }

  populateReferences() {
    _.map(this.nodeSchema.fields, (value, key) => {
      const fieldName = value['Machine name'];
      const fieldType = value['Field type'];
      if (fieldType.startsWith('Entity reference') || 
          (fieldType.startsWith('Custom block type'))) {
        if(!this.node[fieldName] || !this.node[fieldName][0]) {
          return;
        }
        const refOutField = [];
        _.map(this.node[fieldName], (value, key) => {
          const field = value;
          const targetType = field.target_type;
          const targetUuid = field.target_uuid;
          const referenceName = `${targetType}.${targetUuid}`;
          console.log(fieldName, fieldType, referenceName);
          const reference = new Transformer(referenceName);
          const refNode = reference.getNode();
          if(refNode.type) { // TODO skip taxonomy
            const singleRefOutField = {
              "entity": {
                "entityType": targetType,
                "entityBundle": refNode.type[0].target_id,
                "entityId": refNode.id[0].value.toString(),
              }
            };
            const refNodeFields = reference.getJson();
            _.map(refNodeFields, (value, key) => {
              singleRefOutField.entity[key] = value;
            });
            refOutField.push(singleRefOutField);
          }
        });
        this.outJson[_.camelCase(fieldName)] = refOutField;
      }
    });
  }

  getJson() {
    return (this.outJson);
  }

  getNode() {
    return (this.node);
  }
}

/*
 * Loads the global schema for all bundles and fields
 */
function loadSchema() {
  const schemaPath = `${schemaDir}/${schemaName}`;
  const rawContent = fs.readFileSync(schemaPath);
  return (JSON.parse(rawContent));
}

module.exports = Transformer;
