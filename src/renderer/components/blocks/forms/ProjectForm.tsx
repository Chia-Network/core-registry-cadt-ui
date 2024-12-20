import React, { forwardRef, useImperativeHandle } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { Card, Field } from '@/components';
import { Project } from '@/schemas/Project.schema';
import { PickList } from '@/schemas/PickList.schema';
import { useIntl } from 'react-intl';

const validationSchema = yup.object({
  projectName: yup.string().required('Project Name is required').min(1, 'Project Name cannot be empty'),
  projectId: yup.string().required('Project ID is required').min(1, 'Project ID cannot be empty'),
  projectDeveloper: yup.string().required('Project Developer is required').min(1, 'Project Developer cannot be empty'),
  program: yup.string().nullable(),
  projectLink: yup
    .string()
    .url('Must be a valid URL')
    .required('Project Link is required')
    .min(1, 'Project Link cannot be empty'),
  sector: yup.string().required('Sector is required').min(1, 'Sector cannot be empty'),
  projectType: yup.string().required('Project Type is required').min(1, 'Project Type cannot be empty'),
  projectStatus: yup.string().required('Project Status is required').min(1, 'Project Status cannot be empty'),
  projectStatusDate: yup.date().required('Project Status Date is required'),
  coveredByNDC: yup.string().required('Covered By NDC is required').min(1, 'Covered By NDC cannot be empty'),
  ndcInformation: yup.string().nullable(), // Optional field with no empty string
  currentRegistry: yup.string().min(1, 'Current Registry cannot be empty'), // Optional field with no empty string
  registryOfOrigin: yup
    .string()
    .required('Registry of Origin is required')
    .min(1, 'Registry Of Origin cannot be empty'),
  originProjectId: yup.string().required('Origin Project ID is required').min(1, 'Origin Project ID cannot be empty'),
  unitMetric: yup.string().required('Unit Metric is required').min(1, 'Unit Metric cannot be empty'),
  methodology: yup.string().required('Methodology is required').min(1, 'Methodology cannot be empty'),
  validationBody: yup.string().nullable(),
  validationDate: yup.date().nullable(),
  projectTags: yup.string().nullable(), // Optional field with no empty string
});

interface ProjectFormProps {
  readonly?: boolean;
  data?: Project;
  picklistOptions?: PickList;
}

export interface ProjectFormRef {
  submitForm: () => Promise<any>;
}

const defaultProjectData: Project = {
  projectName: null,
  projectId: null,
  projectDeveloper: null,
  program: null,
  projectLink: null,
  sector: null,
  projectType: null,
  projectStatus: null,
  projectStatusDate: null,
  coveredByNDC: null,
  ndcInformation: null,
  currentRegistry: null,
  registryOfOrigin: null,
  originProjectId: null,
  unitMetric: null,
  methodology: null,
  validationBody: null,
  validationDate: null,
  projectTags: null,
};

const getDefaultInitialValues = (data: Partial<Project>): Project => {
  return {
    ...defaultProjectData,
    ...data,
  };
};

const ProjectForm: React.FC<ProjectFormProps> = forwardRef<ProjectFormRef, ProjectFormProps>(
  ({ readonly = false, data = {}, picklistOptions }, ref) => {
    const intl = useIntl();
    const formikRef = React.useRef<FormikProps<any>>(null);

    useImperativeHandle(ref, () => ({
      submitForm: async () => {
        if (formikRef.current) {
          const formik = formikRef.current;
          if (formik) {
            const errors = await formik.validateForm(formik.values);
            formik.setTouched(Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

            return [errors, formik.values];
          }
        }
      },
    }));

    return (
      <Formik
        innerRef={formikRef}
        initialValues={getDefaultInitialValues(data)}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        {() => (
          <Form>
            <div className="flex flex-col gap-4">
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <Field
                    name="projectName"
                    label={intl.formatMessage({ id: 'project-name' })}
                    type="text"
                    readonly={readonly}
                    required={true}
                    initialValue={data?.projectName || ''}
                  />
                  <Field
                    name="projectId"
                    label={intl.formatMessage({ id: 'external-project-id' })}
                    type="text"
                    readonly={readonly}
                    required={true}
                    initialValue={data?.projectId || ''}
                  />
                  <Field
                    name="projectDeveloper"
                    label={intl.formatMessage({ id: 'project-developer' })}
                    type="text"
                    readonly={readonly}
                    required={true}
                    initialValue={data?.projectDeveloper || ''}
                  />
                  <Field
                    name="program"
                    label={intl.formatMessage({ id: 'program' })}
                    type="text"
                    readonly={readonly}
                    initialValue={data?.program || ''}
                  />
                </div>
                <div>
                  <Field
                    name="projectLink"
                    label={intl.formatMessage({ id: 'project-link' })}
                    type="link"
                    readonly={readonly}
                    required={true}
                    initialValue={data?.projectLink || ''}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <Field
                    name="sector"
                    label={intl.formatMessage({ id: 'sector' })}
                    type="picklist"
                    freeform={true}
                    options={picklistOptions?.projectSector}
                    readonly={readonly}
                    required={true}
                    initialValue={data?.sector || ''}
                  />
                  <Field
                    name="projectType"
                    label={intl.formatMessage({ id: 'project-type' })}
                    freeform={true}
                    type="picklist"
                    options={picklistOptions?.projectType}
                    readonly={readonly}
                    required={true}
                    initialValue={data?.projectType || ''}
                  />
                  <Field
                    name="projectStatus"
                    label={intl.formatMessage({ id: 'project-status' })}
                    type="picklist"
                    options={picklistOptions?.projectStatusValues}
                    readonly={readonly}
                    required={true}
                    initialValue={data?.projectStatus || ''}
                  />
                  <Field
                    name="projectStatusDate"
                    label={intl.formatMessage({ id: 'project-status-date' })}
                    type="date"
                    readonly={readonly}
                    required={true}
                    initialValue={data?.projectStatusDate || ''}
                  />
                </div>
              </Card>
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <Field
                    name="coveredByNDC"
                    label={intl.formatMessage({ id: 'covered-by-ndc' })}
                    type="picklist"
                    options={picklistOptions?.coveredByNDC}
                    readonly={readonly}
                    required={true}
                    initialValue={data?.coveredByNDC || ''}
                  />
                  <Field
                    name="ndcInformation"
                    label={intl.formatMessage({ id: 'ndc-information' })}
                    type="text"
                    readonly={readonly}
                    initialValue={data?.ndcInformation || ''}
                  />
                  <Field
                    name="currentRegistry"
                    label={intl.formatMessage({ id: 'current-registry' })}
                    type="picklist"
                    freeform={true}
                    options={picklistOptions?.registries}
                    readonly={readonly}
                    required={true}
                    initialValue={data?.currentRegistry || ''}
                  />
                  <Field
                    name="registryOfOrigin"
                    label={intl.formatMessage({ id: 'registry-of-origin' })}
                    type="picklist"
                    freeform={true}
                    options={picklistOptions?.registries}
                    readonly={readonly}
                    required={true}
                    initialValue={data?.registryOfOrigin || ''}
                  />
                  <Field
                    name="originProjectId"
                    label={intl.formatMessage({ id: 'origin-project-id' })}
                    type="text"
                    readonly={readonly}
                    required={true}
                    initialValue={data?.originProjectId || ''}
                  />
                </div>
              </Card>
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                  <Field
                    name="unitMetric"
                    label={intl.formatMessage({ id: 'unit-metric' })}
                    type="picklist"
                    options={picklistOptions?.unitMetric}
                    readonly={readonly}
                    required={true}
                    initialValue={data?.unitMetric || ''}
                  />
                  <Field
                    name="methodology"
                    label={intl.formatMessage({ id: 'methodology' })}
                    type="picklist"
                    freeform={true}
                    options={picklistOptions?.methodology}
                    readonly={readonly}
                    required={true}
                    initialValue={data?.methodology || ''}
                  />
                  <Field
                    name="methodology2"
                    label={intl.formatMessage({ id: 'methodology' }) + ' 2'}
                    type="picklist"
                    freeform={true}
                    options={picklistOptions?.methodology}
                    readonly={readonly}
                    initialValue={data?.methodology2 || ''}
                  />
                  <Field
                    name="validationBody"
                    label={intl.formatMessage({ id: 'validation-body' })}
                    type="picklist"
                    options={picklistOptions?.validationBody}
                    readonly={readonly}
                    initialValue={data?.validationBody || ''}
                  />
                  <Field
                    name="validationDate"
                    label={intl.formatMessage({ id: 'validation-date' })}
                    type="date"
                    readonly={readonly}
                    initialValue={data?.validationDate || ''}
                  />
                </div>
              </Card>
              <Card>
                <Field
                  name="projectTags"
                  label={intl.formatMessage({ id: 'project-tags' })}
                  type="tag"
                  readonly={readonly}
                  initialValue={data?.projectTags || ''}
                />
              </Card>
            </div>
          </Form>
        )}
      </Formik>
    );
  },
);

export { ProjectForm };
