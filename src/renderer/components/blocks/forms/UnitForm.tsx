import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import * as yup from 'yup';
import { Card, ComponentCenteredSpinner, Field, Label, Select, SelectOption } from '@/components';
import { Unit } from '@/schemas/Unit.schema';
import { useGetHomeOrgQuery, useGetProjectQuery } from '@/api';
import { PickList } from '@/schemas/PickList.schema';
import { useGetProjectOptionsList } from '@/hooks';
import { useIntl } from 'react-intl';

function removeNullFields(obj) {
  // Check if the input is an object and not null
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Create a new object to avoid mutating the original object
  const result = Array.isArray(obj) ? [] : {};

  // Iterate over each key in the object
  for (const key in obj) {
    // eslint-disable-next-line no-prototype-builtins
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];

      // Recursively clean nested objects or arrays
      if (typeof value === 'object' && value !== null) {
        const cleanedValue = removeNullFields(value);
        if (
          cleanedValue !== null &&
          (Array.isArray(cleanedValue) ? cleanedValue.length > 0 : Object.keys(cleanedValue).length > 0)
        ) {
          result[key] = cleanedValue;
        }
      } else if (value !== null) {
        result[key] = value;
      }
    }
  }

  return result;
}

const validationSchema = yup.object({
  unitOwner: yup.string(),
  unitCount: yup.number().required('Unit Count is required').positive('Unit Count must be positive'),
  countryJurisdictionOfOwner: yup.string().required('Country Jurisdiction Of Owner is required'),
  inCountryJurisdictionOfOwner: yup.string().required('In-Country Jurisdiction Of Owner is required'),
  unitType: yup.string().required('Unit Type is required'),
  unitStatus: yup.string().required('Unit Status is required'),
  unitStatusReason: yup.string().nullable(),
  vintageYear: yup
    .number()
    .required('Vintage Year is required')
    .min(1901, 'Vintage Year must be after 1900')
    .max(2155, 'Vintage Year must be before 2156'),
  unitRegistryLink: yup.string().url('Must be a valid URL').required(),
  marketplace: yup.string(),
  marketplaceIdentifier: yup.string(),
  marketplaceLink: yup.string().url('Must be a valid URL'),
  correspondingAdjustmentStatus: yup.string().required('Corresponding Adjustment Status is required'),
  correspondingAdjustmentDeclaration: yup.string().required('Corresponding Adjustment Declaration is required'),
  unitTags: yup.string(),
});

interface UnitFormProps {
  readonly?: boolean;
  data?: Unit;
  picklistOptions?: PickList | undefined;
}

export interface UnitFormRef {
  submitForm: () => Promise<any>;
}

const UnitForm = forwardRef<UnitFormRef, UnitFormProps>(({ readonly = false, data: unit, picklistOptions }, ref) => {
  const intl = useIntl();
  const formikRef = useRef<FormikProps<any>>(null);
  const { data: homeOrg, isLoading: isHomeOrgLoading } = useGetHomeOrgQuery();
  const [error, setError] = useState<string | null>(null);
  const { projects: projectOptions, isLoading: isProjectOptionsLoading } = useGetProjectOptionsList(homeOrg?.orgUid);
  const [selectedWarehouseProjectId, setSelectedWarehouseProjectId] = useState<string | undefined>(
    unit?.warehouseProjectId?.toString(),
  );

  const {
    data: projectData,
    isLoading: isProjectLoading,
    isFetching: isProjectFetching,
  } = useGetProjectQuery(
    {
      // @ts-ignore
      warehouseProjectId: selectedWarehouseProjectId,
    },
    { skip: !selectedWarehouseProjectId },
  );

  const projectLocationOptions: SelectOption[] = useMemo(() => {
    if (isProjectLoading || !projectData?.projectLocations) {
      return [];
    }

    return projectData.projectLocations.map(
      (location): SelectOption => ({
        label: `${location.country} - ${location.inCountryRegion}`,
        value: location.id || '',
      }),
    );
  }, [projectData, isProjectLoading]);

  useImperativeHandle(ref, () => ({
    submitForm: async () => {
      if (formikRef.current) {
        const formik = formikRef.current;
        if (formik) {
          const errors = await formik.validateForm(formik.values);
          formik.setTouched(Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

          if (selectedWarehouseProjectId) {
            formik.values.warehouseProjectId = selectedWarehouseProjectId;
          } else {
            const error = { warehouseProjectId: 'A valid project must be selected' };
            setError(error.warehouseProjectId);
            return [{ ...errors, ...error }, formik.values];
          }

          return [errors, formik.values];
        }
      }
    },
  }));

  const handleSetWarehouseProjectId = (value) => {
    setError(null);
    setSelectedWarehouseProjectId(value);
  };

  useEffect(() => {
    if (!unit?.warehouseProjectId && unit?.issuance?.warehouseProjectId) {
      setSelectedWarehouseProjectId(unit.issuance.warehouseProjectId.toString());
    }
  }, [unit, selectedWarehouseProjectId]);

  if ((isHomeOrgLoading || isProjectOptionsLoading) && !readonly) {
    return <ComponentCenteredSpinner label="Loading Selected Project Data" />;
  }

  if ((isProjectLoading || isProjectFetching) && !readonly) {
    return <ComponentCenteredSpinner label="Loading Selected Project Data" />;
  }

  return (
    <Formik
      innerRef={formikRef}
      initialValues={removeNullFields(unit || {})}
      validationSchema={validationSchema}
      onSubmit={() => {}}
    >
      {() => (
        <Form>
          <div className="flex flex-col gap-4">
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                {!readonly && (
                  <>
                    <div>
                      <div className="flex">
                        {!readonly && <p className="text-red-600 mr-1">*</p>}
                        <Label htmlFor="select-project">Select Project</Label>
                      </div>
                      <Select
                        id="select-project"
                        name="select-project"
                        onChange={handleSetWarehouseProjectId}
                        options={projectOptions}
                        initialValue={selectedWarehouseProjectId || ''}
                      />
                      {error && <p className="text-red-500 text-s italic">{error}</p>}
                    </div>
                  </>
                )}

                <Field
                  name="projectLocationId"
                  label={intl.formatMessage({ id: 'project-location-id' })}
                  disabled={!selectedWarehouseProjectId}
                  type="picklist"
                  options={projectLocationOptions}
                  readonly={readonly}
                  initialValue={unit?.projectLocationId || ''}
                />
                <Field
                  name="unitOwner"
                  label={intl.formatMessage({ id: 'unit-owner' })}
                  type="text"
                  readonly={readonly}
                  initialValue={unit?.unitOwner || ''}
                />
                <Field
                  name="unitCount"
                  label={intl.formatMessage({ id: 'unit-count' })}
                  type="number"
                  readonly={readonly}
                  required={true}
                  initialValue={unit?.unitCount || ''}
                />

                <Field
                  name="countryJurisdictionOfOwner"
                  label={intl.formatMessage({ id: 'country-jurisdiction-of-owner' })}
                  type="picklist"
                  options={picklistOptions?.countries}
                  readonly={readonly}
                  required={true}
                  initialValue={unit?.countryJurisdictionOfOwner || ''}
                />

                <Field
                  name="inCountryJurisdictionOfOwner"
                  label={intl.formatMessage({ id: 'in-country-jurisdiction-of-owner' })}
                  type="text"
                  readonly={readonly}
                  required={true}
                  initialValue={unit?.inCountryJurisdictionOfOwner || ''}
                />

                <Field
                  name="unitType"
                  label={intl.formatMessage({ id: 'unit-type' })}
                  type="picklist"
                  options={picklistOptions?.unitType}
                  readonly={readonly}
                  required={true}
                  initialValue={unit?.unitType || ''}
                />

                <Field
                  name="unitStatus"
                  label={intl.formatMessage({ id: 'unit-status' })}
                  type="picklist"
                  options={picklistOptions?.unitStatus}
                  readonly={readonly}
                  required={true}
                  initialValue={unit?.unitStatus || ''}
                />

                <Field
                  name="unitStatusReason"
                  label={intl.formatMessage({ id: 'unit-status-reason' })}
                  type="text"
                  readonly={readonly}
                  initialValue={unit?.unitStatusReason || ''}
                />

                <Field
                  name="vintageYear"
                  label={intl.formatMessage({ id: 'vintage-year' })}
                  type="number"
                  readonly={readonly}
                  required={true}
                  initialValue={unit?.vintageYear || ''}
                />
              </div>
              <div>
                <Field
                  name="unitRegistryLink"
                  label={intl.formatMessage({ id: 'unit-registry-link' })}
                  type="link"
                  readonly={readonly}
                  initialValue={unit?.unitRegistryLink || ''}
                  required={true}
                />
              </div>
            </Card>
            <Card>
              <Field
                name="marketplaceIdentifier"
                label={intl.formatMessage({ id: 'marketplace-identifier' })}
                type="text"
                readonly={readonly}
                initialValue={unit?.marketplaceIdentifier || ''}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Field
                  name="marketplace"
                  label={intl.formatMessage({ id: 'marketplace' })}
                  type="text"
                  readonly={readonly}
                  initialValue={unit?.marketplace || ''}
                />

                <Field
                  name="marketplaceLink"
                  label={intl.formatMessage({ id: 'marketplace-link' })}
                  type="text"
                  readonly={readonly}
                  initialValue={unit?.marketplaceLink || ''}
                />

                <Field
                  name="correspondingAdjustmentStatus"
                  label={intl.formatMessage({ id: 'corresponding-adjustment-status' })}
                  type="picklist"
                  options={picklistOptions?.correspondingAdjustmentStatus}
                  readonly={readonly}
                  required={true}
                  initialValue={unit?.correspondingAdjustmentStatus || ''}
                />

                <Field
                  name="correspondingAdjustmentDeclaration"
                  label={intl.formatMessage({ id: 'corresponding-adjustment-declaration' })}
                  type="picklist"
                  options={picklistOptions?.correspondingAdjustmentDeclaration}
                  readonly={readonly}
                  required={true}
                  initialValue={unit?.correspondingAdjustmentDeclaration || ''}
                />
              </div>
            </Card>
            <Card>
              <Field
                name="unitTags"
                label={intl.formatMessage({ id: 'unit-tags' })}
                type="tag"
                readonly={readonly}
                initialValue={unit?.unitTags || ''}
              />
            </Card>
          </div>
        </Form>
      )}
    </Formik>
  );
});

export { UnitForm };
