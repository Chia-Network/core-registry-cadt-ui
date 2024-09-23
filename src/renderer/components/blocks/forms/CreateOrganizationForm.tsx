import React, { useCallback } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { FloatingLabel, FormButton } from '@/components';
import { FormattedMessage, IntlShape, useIntl } from 'react-intl';

interface FormProps {
  onSubmit: (values: CreateOrgFormValues) => Promise<any>;
}

interface CreateOrgFormValues {
  name: string;
  prefix: string;
}

const CreateOrganizationForm: React.FC<FormProps> = ({ onSubmit }) => {
  const intl: IntlShape = useIntl();

  const validationSchema = yup.object({
    name: yup.string().required(intl.formatMessage({ id: 'name-is-required' })),
    prefix: yup.string().required(intl.formatMessage({ id: 'prefix-is-required' })),
  });

  const handleSubmit = useCallback(
    async (values: CreateOrgFormValues, { setSubmitting }) => {
      await onSubmit(values);
      setSubmitting(false);
    },
    [onSubmit],
  ); // Include onSuccess in the dependencies array

  return (
    <Formik<CreateOrgFormValues>
      initialValues={{ name: '', prefix: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <div className="mb-4">
            <Field name="name">
              {({ field }) => (
                <FloatingLabel
                  id="name"
                  label={intl.formatMessage({ id: 'organization-name' })}
                  color={(errors.name && touched.name && 'error') || undefined}
                  variant="outlined"
                  type="text"
                  {...field}
                />
              )}
            </Field>
            {touched.name && <ErrorMessage name="name" component="div" className="text-red-600" />}
          </div>
          <div className="mb-4">
            <Field name="prefix">
              {({ field }) => (
                <FloatingLabel
                  id="prefix"
                  label={intl.formatMessage({ id: 'organization-prefix' })}
                  color={(errors.name && touched.name && 'error') || undefined}
                  variant="outlined"
                  type="text"
                  {...field}
                />
              )}
            </Field>
            {touched.prefix && <ErrorMessage name="prefix" component="div" className="text-red-600" />}
          </div>
          <FormButton isSubmitting={isSubmitting} formikErrors={errors}>
            <FormattedMessage id="submit" />
          </FormButton>
        </Form>
      )}
    </Formik>
  );
};

export { CreateOrganizationForm };
