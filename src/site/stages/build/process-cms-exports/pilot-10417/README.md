
# Setup
* npm install
* Create *bundles.json* from the csv files: node createBundles.js
* Make sure that ../../../../../../../cms-export is populated with data from the tome sync/tar export
* run node index.js. The result is in *output.json*


# Structure
The basic hierarchy in Drupal. See this in the UI: https://staging.cms.va.gov/admin/structure
Drupal has building blocks:
* Content types/nodes
* Paragraphs
* Blocks
* etc
* We create custom version of these that are collectively called bundles
* Each bundle (similar to a database table) has fields
* Some fields are references, they point to other nodes with content
* We bring the content inline from these nodes

# Process
The class that does the bulk of the work is a Transformer.
* 1. loads the node file with the content and references
* 2. gets the corresponding schema from the bundles
* 3. Applies the schema to the node: populates the fields
* 4. Recursively gets the references (includes) for the node
* 5. Saves the json file
