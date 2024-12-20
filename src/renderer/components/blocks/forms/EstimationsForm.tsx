import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Form, Formik, FormikProps } from 'formik';
import { Field, Repeater } from '@/components';
import { Estimation } from '@/schemas/Estimation.schema';
import * as yup from 'yup';
import { deepOmit, validateAndSubmitFieldArrayForm } from '@/utils/formik-utils';
import { useIntl } from 'react-intl';

const validationSchema = yup.object({
  estimations: yup.array().of(
    yup.object({
      creditingPeriodStart: yup.date().required('Crediting period start is required'),
      creditingPeriodEnd: yup
        .date()
        .required('Crediting period end is required')
        .min(yup.ref('creditingPeriodStart'), 'Crediting period end date must be after the start date'),
      unitCount: yup.number().required('Unit count is required').positive('Unit count must be positive'),
    }),
  ),
});

interface EstimationsFormProps {
  readonly?: boolean;
  data?: Estimation[];
}

export interface EstimationsFormRef {
  submitForm: () => Promise<any>;
}

const EstimationsForm = forwardRef<EstimationsFormRef, EstimationsFormProps>(({ readonly = false, data }, ref) => {
  const intl = useIntl();
  const formikRef = useRef<FormikProps<any>>(null);

  useImperativeHandle(ref, () => ({
    submitForm: async () =>
      deepOmit(await validateAndSubmitFieldArrayForm(formikRef, 'estimations'), [
        'orgUid',
        'warehouseProjectId',
        'timeStaged',
      ]),
  }));

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{ estimations: data || [] }}
      validationSchema={validationSchema}
      onSubmit={() => {}}
      enableReinitialize={true}
    >
      {() => (
        <Form>
          <Repeater<Estimation>
            name="estimations"
            maxNumber={10}
            minNumber={0}
            readonly={readonly}
            initialValue={data || []}
            itemTemplate={{
              creditingPeriodStart: null,
              creditingPeriodEnd: null,
              unitCount: 0,
            }}
          >
            {(estimation, index, name) => (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Field
                  name={`${name}[${index}].creditingPeriodStart`}
                  label={intl.formatMessage({ id: 'crediting-period-start' })}
                  type="date"
                  readonly={readonly}
                  required={true}
                  initialValue={estimation.creditingPeriodStart}
                />
                <Field
                  name={`${name}[${index}].creditingPeriodEnd`}
                  label={intl.formatMessage({ id: 'crediting-period-end' })}
                  type="date"
                  readonly={readonly}
                  required={true}
                  initialValue={estimation.creditingPeriodEnd}
                />
                <Field
                  name={`${name}[${index}].unitCount`}
                  label={intl.formatMessage({ id: 'unit-count' })}
                  type="number"
                  readonly={readonly}
                  required={true}
                  initialValue={estimation.unitCount}
                />
              </div>
            )}
          </Repeater>
        </Form>
      )}
    </Formik>
  );
});

export { EstimationsForm };
