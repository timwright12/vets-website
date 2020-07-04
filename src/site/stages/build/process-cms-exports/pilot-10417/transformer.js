"use strict";

const _ = require('lodash');
const fs = require('fs');

const schemaDir = '.';
const schemaName  = 'bundles.json';
const nodeDir = '../../../../../../../cms-export/content'; // Where to find the node files

const schema = loadSchema();
let stackDepth = 0; // how deep are we recursing when fetching references
let loadedFiles = {}; // Keep track of the files we've already loaded

class Transformer {
  /**
   * Create a Transformer.
   * @param {String} nodeName - The name of the node's file
   * @param {boolean} rootNode - Is this a root node that gets converted into HTML?
   * 1. loads the node file
   * 2. gets the corresponding schema from the bundles
   * 3. Applies the schema, populates the fields
   * 4. Recursively gets the references (includes) for the node
   * 5. Saves the json file
   *
*/

  constructor(nodeFile, rootNode) {
    this.outJson = {}; // The JSON output goes in here
    this.prettyOutJson = {}; // Pretty version of the above

    if (rootNode) {
      stackDepth = 0;
      loadedFiles = {};
    } else {
      if(loadedFiles[nodeFile]) {
        // Avoid circular references where one files includes the second and
        // the second includes the first causing an infinite loop.
        console.warn('circular reference, not loading node');
        return;
      }
    }

    this.nodeFile = nodeFile; // the node file we're processing
    this.nodeSchema = {}; // The schema for the current node
    const currentNode = this.loadNode();
    if (!currentNode) {
      return; //Failed to load the current node
    }
    loadedFiles[nodeFile] = true;
    if (!rootNode || this.node.entityUrl // A root node needs to have an entity URL
          && this.node.status && this.node.status[0]
          && (this.node.status[0].value === true)) { // And status to indicate it's published
        console.log(`=========== ${nodeFile} stackDepth: ${stackDepth} =================`)
        stackDepth++;
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
  }

/*
* Load the node file that was created in the tar file.
*/

  loadNode() {
    const nodePath = `${nodeDir}/${this.nodeFile}.json`;
    let rawContent;
    try {
      rawContent = fs.readFileSync(nodePath);
    } catch(err) {
      console.error(err); // TODO shouldn't happen
      return (false);
    }
    this.node = JSON.parse(rawContent);
    // Most node types will have a field "type"
    if(!this.node.type) {
      if (this.node.vid || this.node.mid) { // taxonomy has vid instead of "type"
        // For now also ignore media nodes  //TODO
        return(false); // Ignore taxonomy node types. That what graphQL does
      } else {
        console.error('Unknown file type:', nodePath);
        return(false); // So we know which file/node types aren't working
      }
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
      /*
      case 'taxonomy_vocabulary':
        this.nodeType = 'vocabulary';
      break;
      */
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
    this.nodeSchema = schema[this.fullBundleName];
    const jsonSchema = JSON.stringify(this.nodeSchema, null, 2);
    const moderationState = node.moderation_state;
    const published = moderationState.length > 0 && moderationState[0].value === 'published';
    this.outJson = {
      "entityBundle": this.bundleType,
      "entityId": node.nid[0].value.toString(),
      "entityPublished": published,
      "title": node.title[0].value,
      "entityUrl": node.entityUrl,
      "entityMetatags": this.metaTags,
      // TODO clean entityMetatags: 
    };

  }

  populateFields() {
    _.map(this.nodeSchema.fields, (value, key) => {
      const fieldName = value['Machine name'];
      const fieldType = value['Field type'];
      const fieldValue = this.populateFieldValue(fieldType, fieldName);
    });
  }

/*
* Populate the different fields for the current node 
* based on the bundle type
* @param {String} type - field type
* @param {String} fieldName - field name
*/
  populateFieldValue(type, fieldName) {
    const field = this.node[fieldName];
    const camelName = _.camelCase(fieldName);
    if(field === undefined) {
      console.error('empty', fieldName);
      return (null);
    }

    // These are handled in their respective functions
    if (type.startsWith('Entity reference') || (type === 'Meta tags')) {
      return (null);
    }

    // Looks like the various Drupal text fields all start
    // with "Text"
    if (type.startsWith('Text') || type === 'List (text)') {
      if(field && field[0]) {
        if (field[0].format === 'rich_text') {
          this.outJson[camelName] = {
            'processed': field[0].value, //TODO process the HTML
          }
        } else {
          this.outJson[camelName] = field[0].value;
        }
        return;
      } else {
        return (null);
      }
    }

    switch (type) {
      case 'Boolean':
        this.outJson[camelName] = field[0].value;
      break;
      case 'Number (integer)':
        if (field[0]) {
        this.outJson[camelName] = field[0].value;
      }
      break;
      case 'Date':
        if (field[0]) {
        this.outJson[camelName] = { 
          date: field[0].value
        }
      }
      break;
      case 'Link':
        const linkField = field[0];
      if (linkField) {
        this.outJson[camelName] =  {
          "options": linkField.options,
          "title": linkField.title,
          "url": {
            "path": linkField.uri // notice url -> uri
            //TODO We sometimes get 
            //    "path": "entity:node/2ba48b5f-a92c-4775-9cfd-9530d1c87347"
            //    instead of
            //    "path": "/claim-or-appeal-status
          }
        }
      }
      break;
      default:
        console.error('unhandled type -' + type + '- ' + fieldName, JSON.stringify(field, 2, null));
      break;
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
          if(
            (!field) ||
                (field.length === 0) ||
                (targetType === 'taxonomy_term') ||
                (targetType === 'media') //TODO
          ) {
            // Don't inline these
            return;
          }
          const targetUuid = field.target_uuid;
          const referenceName = `${targetType}.${targetUuid}`;
          console.log(fieldName, fieldType, referenceName);
          const reference = new Transformer(referenceName, false);
          stackDepth--;
          const refNode = reference.getNode();
          if(refNode) { // If we loaded a node
          let entityId;
          if(refNode.id) {
            entityId = refNode.id[0].value.toString(); //default
          } else {
            // Node is included rather than paragraph or block
            entityId = refNode.nid[0].value.toString(); 
          }
          const singleRefOutField = {
            "entity": {
              "entityType": targetType,
              "entityBundle": refNode.type[0].target_id,
              "entityId": entityId
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

  /*
  * Load a bunch of nodes and process them
   * @param {Number} number - The name of the node we'll process
  */
  static loadNodes(number) {
    let files = fs.readdirSync(nodeDir).filter(file => file.startsWith('node.'));
    files = files.slice(0,number);
    for (let ii = 0; ii < files.length; ii++) {
      console.log(ii);
      const file = files[ii];
      console.log('=====', file);
      const fileName = file.replace('.json', '');
      const transformer = new Transformer(fileName, true);
      const outJson = transformer.getJson();
      const node = transformer.getNode();
      let id = ii;;
      if(node.nid) {
        id = `node-${node.nid[0].value}`;
      }
      const prettyOutJson = JSON.stringify(outJson, null, 2);
      fs.writeFileSync(`output/${id}.json`, prettyOutJson);
    }
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
