"use strict";

const _ = require('lodash');
const fs = require('fs');


const schemaDir = '.';
const schemaName  = 'bundles.json';
const nodeDir = '../../../../../../../cms-export/content';

class Transformer {
  /**
   * Create a Transformer.
   * @param {String} nodeName - The name of the node's file
*/

  constructor(nodeFile) {
    this.nodeFile = nodeFile;
    this.nodeSchema = {}; // The schema for the current node
    this.outJson = {}; // The JSON output goes in here
    this.loadSchema();
    this.loadNode();
    if(this.nodeType === 'node_type') {
      this.getMetaTags();
      this.populateNode();
    } else {
      const nodeType = this.node.type[0].target_id;
      this.nodeSchema = this.schema[nodeType];
    }
    this.populateFields();
    this.populateReferences();
    this.prettyOutJson = JSON.stringify(this.outJson, null, 2);
  }

  loadSchema() {
    const schemaPath = `${schemaDir}/${schemaName}`;
    const rawContent = fs.readFileSync(schemaPath);
    this.schema = JSON.parse(rawContent);
  }

  loadNode() {
    const nodePath = `${nodeDir}/${this.nodeFile}.json`;
    const rawContent = fs.readFileSync(nodePath);
    this.node = JSON.parse(rawContent);
    this.nodeType = this.node.type[0].target_type;
    console.log('---- loaded:', this.nodeType, `${this.nodeFile}.json`);
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
    const nodeType = node.type[0].target_id;
    this.nodeSchema = this.schema[nodeType];
    const jsonSchema = JSON.stringify(this.nodeSchema, null, 2);
    this.outJson = {
      "entityBundle": nodeType,
      "entityId": node.nid[0].value.toString(),
      "entityPublished": node.moderation_state[0].value === 'published',
      "title": node.title[0].value,
      "entityUrl": node.entityUrl,
      "entityMetatags": this.metaTags,
      // TODO "entityMetatags": 
      // TODO "fieldFeaturedContent": reference
      // TODO "fieldContentBlock": reference
      // TODO 
    };

  }

  populateFields() {
    _.map(this.nodeSchema.fields, (value, key) => {
      const fieldName = value['Machine name'];
      const fieldType = value['Field type'];
      const fieldValue = this.getFieldValue(fieldType, fieldName);
    });
  }

  getFieldValue(type, fieldName) {
    const field = this.node[fieldName];
    //console.log(type, fieldName);
    if(!field) {
      console.error('empty', fieldName);
      return (null);
    }

    if (type.startsWith('Entity reference') || (type === 'Link')  ||
        (type === 'Meta tags')) {
      return (null);
    }


    if (type.startsWith('Text')) {
      if(field && field[0]) {
        this.outJson[_.camelCase(fieldName)] = field[0].value;
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
        this.outJson[_.camelCase(fieldName)] = field[0].value;
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
      if (fieldType.startsWith('Entity reference ')) {
        if(!this.node[fieldName] || !this.node[fieldName][0]) {
          return;
        }
        const field = this.node[fieldName][0];
        const targetType = field.target_type;
        const targetUuid = field.target_uuid;
        const referenceName = `${targetType}.${targetUuid}`;
        console.log(fieldName, fieldType, referenceName);
        const reference = new Transformer(referenceName);
        const output = reference.getJson();
        console.log(output);
        return;
      }
    });
  }

  getJson() {
    return (this.prettyOutJson);
  }

}

module.exports = Transformer;
