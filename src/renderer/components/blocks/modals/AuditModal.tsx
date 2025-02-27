import React, { useCallback } from 'react';
import {
  CoBenefitsForm,
  EstimationsForm,
  Field,
  IssuancesForm,
  LabelsForm,
  Modal,
  ProjectForm,
  ProjectLocationsForm,
  RatingsForm,
  RelatedProjectsForm,
  Spacer,
  UnitForm,
} from '@/components';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form, Formik } from 'formik';

interface AuditModalProps {
  auditData: any;
  onClose: () => void;
}

const AuditModal: React.FC<AuditModalProps> = ({ auditData, onClose }: AuditModalProps) => {
  const intl = useIntl();
  const changeForm = useCallback(() => {
    const change = JSON.parse(auditData.change);
    switch (auditData.table) {
      case 'project':
        return <ProjectForm readonly={true} data={change} />;
      case 'labels':
        return <LabelsForm readonly={true} data={Array.isArray(change) ? change : [change]} />;
      case 'issuances':
        return <IssuancesForm readonly={true} data={Array.isArray(change) ? change : [change]} />;
      case 'projectLocations':
        return <ProjectLocationsForm readonly={true} data={Array.isArray(change) ? change : [change]} />;
      case 'unit':
        return <UnitForm readonly={true} data={change} />;
      case 'ratings':
        return <RatingsForm readonly={true} data={Array.isArray(change) ? change : [change]} />;
      case 'relatedProjects':
        return <RelatedProjectsForm readonly={true} data={Array.isArray(change) ? change : [change]} />;
      case 'coBenefits':
        return <CoBenefitsForm readonly={true} data={Array.isArray(change) ? change : [change]} />;
      case 'estimations':
        return <EstimationsForm readonly={true} data={Array.isArray(change) ? change : [change]} />;
      default:
        return <div>No Data To Show</div>;
    }
  }, [auditData]);

  if (!auditData) return null;

  return (
    <Modal onClose={onClose} show={true} size={'8xl'} position="top-center">
      <Modal.Header>
        <FormattedMessage id={'detailed-audit-view'} />
      </Modal.Header>
      <Modal.Body>
        <div className="h-screen">
          <Formik initialValues={{}} validationSchema={null} onSubmit={() => {}}>
            <Form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                <Field
                  label={intl.formatMessage({ id: 'table' })}
                  name="table"
                  type="text"
                  initialValue={auditData.table}
                  readonly={true}
                />
                <Field
                  label={intl.formatMessage({ id: 'timestamp' })}
                  name="updatedAt"
                  type="date"
                  initialValue={auditData.updatedAt}
                  readonly={true}
                />
                <Field
                  label={intl.formatMessage({ id: 'type' })}
                  name="type"
                  type="text"
                  initialValue={auditData.type}
                  readonly={true}
                />
                <Field
                  label={intl.formatMessage({ id: 'root-hash' })}
                  name="rootHash"
                  type="text"
                  initialValue={auditData.rootHash}
                  readonly={true}
                />
                <Field
                  label={intl.formatMessage({ id: 'author' })}
                  name="author"
                  type="text"
                  initialValue={auditData.author}
                  readonly={true}
                />
                <Field
                  label={intl.formatMessage({ id: 'comment' })}
                  name="comment"
                  type="text"
                  initialValue={auditData.comment}
                  readonly={true}
                />
              </div>
              <Spacer size={15} />
              {changeForm()}
            </Form>
          </Formik>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export { AuditModal };
