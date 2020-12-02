module.exports = {
  type: ['object', 'null'],
  properties: {
    entity: {
      type: ['object', 'null'],
      properties: {
        entityBundle: { type: 'string' },
        fieldBenefitHubContacts: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              entity: {
                $ref: 'output/node-landing_page',
              },
            },
          },
        },
        fieldContactDefault: { $ref: 'output/node-support_service' },
        fieldAdditionalContact: {
          oneOf: [
            { $ref: 'output/paragraph-email_contact' },
            { $ref: 'output/paragraph-phone_number' },
          ],
        },
      },
    },
  },
};
