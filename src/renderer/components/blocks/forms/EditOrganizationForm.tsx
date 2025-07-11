import React, { useCallback } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as yup from 'yup';
import { Button, FormButton, TextInput } from '@/components';
import { FormattedMessage } from 'react-intl';
import { Organization } from '@/schemas/Organization.schema';

const validationSchema = yup.object({
  organizationName: yup.string().required('The organization name must be at least 3 characters').min(3),
  prefix: yup
    .string()
    .optional()
    .matches(/^[a-zA-Z0-9]+$/, 'Prefix must contain only alphanumeric characters (a-z, A-Z, 0-9)')
    .max(20, 'Prefix must be 20 characters or less'),
});

interface FormProps {
  myOrganization: Organization;
  onSubmit: (values: { organizationName: string; prefix: string }) => Promise<any>;
  onCancel: () => void;
}

const EditOrganizationForm: React.FC<FormProps> = ({ myOrganization, onSubmit, onCancel }: FormProps) => {
  const handleSubmit = useCallback(
    async (values: { organizationName: string; prefix: string }, { setSubmitting }) => {
      await onSubmit(values);
      setSubmitting(false);
    },
    [onSubmit],
  );

  const handleChange = useCallback((event, field) => {
    field.onChange(event); // Call Formik's original onChange
  }, []);

  return (
    <Formik
      initialValues={{ organizationName: myOrganization.name, prefix: myOrganization.prefix }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form>
          <div className="mb-4">
            <Field name="organizationName">
              {({ field }) => (
                <div className="flex justify-start align-middle">
                  <div>
                    <p className="font-bold text-left text-gray-700 dark:text-gray-400 mr-4">
                      <FormattedMessage id="name" />
                    </p>
                  </div>
                  <TextInput
                    className="w-3/5 mb-2"
                    id="organizationName"
                    color={errors.organizationName && touched.organizationName && 'failure'}
                    variant="outlined"
                    required
                    type="text"
                    {...field}
                    onChange={(event) => handleChange(event, field)}
                  />
                </div>
              )}
            </Field>
            {touched.organizationName && (
              <ErrorMessage name="organizationName" component="div" className="text-red-600" />
            )}
            <Field name="prefix">
              {({ field }) => (
                <div className="flex justify-start align-middle">
                  <div>
                    <p className="font-bold text-left text-gray-700 dark:text-gray-400 mr-4">
                      <FormattedMessage id="organization-prefix" />
                    </p>
                  </div>
                  <TextInput
                    className="w-3/5 mb-2"
                    id="prefix"
                    color={errors.prefix && touched.prefix && 'failure'}
                    variant="outlined"
                    required
                    type="text"
                    maxLength={20}
                    {...field}
                    onChange={(event) => handleChange(event, field)}
                  />
                </div>
              )}
            </Field>
            {touched.prefix && <ErrorMessage name="prefix" component="div" className="text-red-600" />}
            <div className="flex justify-start">
              <p className="font-bold text-left text-gray-700 dark:text-gray-400 mr-4">
                <FormattedMessage id="orguid" />
              </p>
              <p className="font-normal text-left text-gray-700 dark:text-gray-400 inline-block">
                {myOrganization.orgUid}
              </p>
            </div>
          </div>
          <div className="space-x-2 flex">
            <FormButton isSubmitting={isSubmitting} formikErrors={errors}>
              <FormattedMessage id="save" />
            </FormButton>
            <Button onClick={onCancel} color="gray">
              <FormattedMessage id="cancel" />
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export { EditOrganizationForm };
