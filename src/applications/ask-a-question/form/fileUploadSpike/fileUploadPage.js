import fileUiSchema, {
  fileSchema,
} from 'platform/forms-system/src/js/definitions/file';
import environment from 'platform/utilities/environment';

const formFields = {
  files: 'files',
};

const fileUploadPage = {
  uiSchema: {
    'ui:description': 'File Upload Spike',
    [formFields.files]: fileUiSchema('Files To Upload', {
      fileUploadUrl: `${environment.API_URL}/v0/ask/inquiry_documents`,
    }),
  },
  schema: {
    type: 'object',
    properties: {
      files: fileSchema,
    },
  },
};

export default fileUploadPage;
