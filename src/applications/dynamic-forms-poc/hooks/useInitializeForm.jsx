import { useEffect, useState } from 'react';
import _ from 'lodash';

import useSchemas from '../hooks/useSchemas';

export default function useInitializeForm(formState, updateFormData) {
  const [formData, setFormData] = useState({ questionnaireId: null });
  const [uiSchema, schema] = useSchemas();

  useEffect(
    () => {
      if (formData.questionnaireId !== null) {
        updateFormData(schema, uiSchema, {
          questionnaireId: schema.questionnaireId,
        });
      }
    },
    [formData],
  );

  useEffect(
    () => {
      if (!_.isEmpty(schema) && !_.isEmpty(uiSchema)) {
        setFormData({
          questionnaireId: schema.questionnaireId,
        });

        // updateFormData(schema, uiSchema, {
        //   questionnaireId: schema.questionnaireId,
        // });
      }
    },
    [schema, uiSchema],
  );

  return [formData];
}
