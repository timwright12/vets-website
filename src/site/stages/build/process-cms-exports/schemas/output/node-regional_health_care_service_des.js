module.exports = {
  type: 'object',
  properties: {
    contentModelType: { enum: ['node-regional_health_care_service_des'] },
    entityType: { enum: ['node'] },
    entityBundle: { enum: ['regional_health_care_service_des'] },
    fieldBody: { $ref: 'ProcessedString' },
    fieldServiceNameAndDescripti: {
      $ref: 'output/taxonomy_term-health_care_service_taxonomy',
    },
    fieldLocalHealthCareService: {
      type: 'array',
      items: {
        entity: {
          title: { type: ['string', 'TBD'] },
          fieldFacilityLocation: {
            entity: {
              title: { type: ['string', 'TBD'] },
              entityUrl: { type: ['string', 'null'] },
            },
          },
        },
      },
    },
  },
  required: [
    'fieldBody',
    'fieldServiceNameAndDescripti',
    'fieldLocalHealthCareService',
  ],
};
