import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Stepper, Step, StepLabel } from '@mui/material';
import {
  Modal,
  TabPanel,
  Message,
  EstimationsRepeater,
  RatingsRepeater,
  modalTypeEnum,
  StyledFormContainer,
} from '..';
import LabelsRepeater from './LabelsRepeater';
import IssuanceRepeater from './IssuanceRepeater';
import CoBenefitsRepeater from './CoBenefitsRepeater';
import LocationsRepeater from './LocationsRepeater';
import RelatedProjectsRepeater from './RelatedProjectsRepeater';
import { updateProjectRecord } from '../../store/actions/climateWarehouseActions';
import { useIntl } from 'react-intl';
import { ProjectDetailsForm } from '.';

import {
  labelsSchema,
  issuancesSchema,
  coBenefitsSchema,
  relatedProjectsSchema,
  locationsSchema,
  estimationsSchema,
  ratingsSchema,
  projectSchema,
} from '../../store/validations';

const EditProjectsForm = ({
  onClose,
  record,
  modalSizeAndPosition = { modalSizeAndPosition },
}) => {
  const projectToBeEdited = useSelector(
    state =>
      state.climateWarehouse.projects.filter(
        project => project.warehouseProjectId === record.warehouseProjectId,
      )[0],
  );
  const [labels, setLabelsRepeaterValues] = useState([]);
  const [issuance, setIssuance] = useState([]);
  const [locations, setLocations] = useState([]);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [estimationsState, setEstimationsState] = useState([]);
  const [ratingsState, setRatingsState] = useState([]);
  const [coBenefits, setCoBenefits] = useState([]);
  const [project, setProject] = useState({});
  const [tabValue, setTabValue] = useState(0);
  const dispatch = useDispatch();
  const intl = useIntl();
  const { notification } = useSelector(state => state.app);

  useEffect(() => {
    const formatProjectData = unformattedProject => {
      const result = {};
      const unformattedProjectKeys = Object.keys(unformattedProject);
      unformattedProjectKeys.forEach(key => {
        if (typeof unformattedProject[key] === 'object') {
          result[key] = _.cloneDeep(unformattedProject[key]);
        } else if (
          ['ratingRangeHighest', 'ratingRangeLowest', 'rating'].includes(key)
        ) {
          result[key] = unformattedProject[key]?.toString() ?? '';
        } else if (unformattedProject[key] === null) {
          result[key] = '';
        } else {
          result[key] = unformattedProject[key];
        }
      });
      return result;
    };
    const formattedProject = formatProjectData(projectToBeEdited);
    setIssuance(formattedProject.issuances);
    delete formattedProject.issuances;
    setLocations(formattedProject.projectLocations);
    delete formattedProject.projectLocations;
    setCoBenefits(formattedProject.coBenefits);
    delete formattedProject.coBenefits;
    setLabelsRepeaterValues(formattedProject.labels);
    delete formattedProject.labels;
    setRelatedProjects(formattedProject.relatedProjects);
    delete formattedProject.relatedProjects;
    setEstimationsState(formattedProject.estimations);
    delete formattedProject.estimations;
    setRatingsState(formattedProject.projectRatings);
    delete formattedProject.projectRatings;
    setProject(formattedProject);
  }, [projectToBeEdited]);

  const stepperStepsTranslationIds = [
    'project',
    'labels',
    'issuances',
    'co-benefits',
    'project-locations',
    'related-projects',
    'estimations',
    'ratings',
  ];

  const switchToNextTabIfDataIsValid = async (data, schema) => {
    const isValid = await schema.isValid(data);
    if (isValid) {
      if (stepperStepsTranslationIds[tabValue] === 'ratings') {
        handleSubmitProject();
      } else {
        setTabValue(tabValue + 1);
      }
    }
  };

  const onNextButtonPress = async () => {
    switch (stepperStepsTranslationIds[tabValue]) {
      case 'project':
        switchToNextTabIfDataIsValid(project, projectSchema);
        break;
      case 'labels':
        switchToNextTabIfDataIsValid(labels, labelsSchema);
        break;
      case 'issuances':
        switchToNextTabIfDataIsValid(issuance, issuancesSchema);
        break;
      case 'co-benefits':
        switchToNextTabIfDataIsValid(coBenefits, coBenefitsSchema);
        break;
      case 'project-locations':
        switchToNextTabIfDataIsValid(locations, locationsSchema);
        break;
      case 'related-projects':
        switchToNextTabIfDataIsValid(relatedProjects, relatedProjectsSchema);
        break;
      case 'estimations':
        switchToNextTabIfDataIsValid(estimationsState, estimationsSchema);
        break;
      case 'ratings':
        switchToNextTabIfDataIsValid(ratingsState, ratingsSchema);
        break;
    }
  };

  const handleSubmitProject = async () => {
    const dataToSend = _.cloneDeep(project);

    Object.keys(dataToSend).forEach(el => {
      if (!dataToSend[el]) {
        delete dataToSend[el];
      }
    });

    if (!_.isEmpty(issuance)) {
      dataToSend.issuances = issuance;
    }

    if (!_.isEmpty(labels)) {
      dataToSend.labels = labels;
    }

    if (!_.isEmpty(coBenefits)) {
      dataToSend.coBenefits = coBenefits;
    }

    if (!_.isEmpty(locations)) {
      dataToSend.projectLocations = locations;
    }

    if (!_.isEmpty(relatedProjects)) {
      dataToSend.relatedProjects = relatedProjects;
    }

    if (!_.isEmpty(estimationsState)) {
      dataToSend.estimations = estimationsState;
    }

    if (!_.isEmpty(ratingsState)) {
      dataToSend.projectRatings = ratingsState;
    }

    const projectIsValid = await projectSchema.isValid(dataToSend);

    if (projectIsValid) {
      dispatch(updateProjectRecord(dataToSend));
    }
  };

  const projectWasSuccessfullyEdited =
    notification?.id === 'project-successfully-edited';
  useEffect(() => {
    if (projectWasSuccessfullyEdited) {
      onClose();
    }
  }, [notification]);

  return (
    <>
      {notification && !projectWasSuccessfullyEdited && (
        <Message id={notification.id} type={notification.type} />
      )}
      <Modal
        modalSizeAndPosition={modalSizeAndPosition}
        onOk={onNextButtonPress}
        onClose={onClose}
        modalType={modalTypeEnum.basic}
        title={intl.formatMessage({
          id: 'edit-project',
        })}
        label={intl.formatMessage({
          id: tabValue < 7 ? 'next' : 'update-project',
        })}
        extraButtonLabel={
          tabValue > 0
            ? intl.formatMessage({
                id: 'back',
              })
            : undefined
        }
        extraButtonOnClick={() =>
          setTabValue(prev => (prev > 0 ? prev - 1 : prev))
        }
        body={
          <StyledFormContainer>
            <Stepper activeStep={tabValue} alternativeLabel>
              {stepperStepsTranslationIds &&
                stepperStepsTranslationIds.map((stepTranslationId, index) => (
                  <Step
                    key={index}
                    onClick={() => setTabValue(index)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <StepLabel>
                      {intl.formatMessage({
                        id: stepTranslationId,
                      })}
                    </StepLabel>
                  </Step>
                ))}
            </Stepper>
            <div>
              <TabPanel
                style={{ paddingTop: '1.25rem' }}
                value={tabValue}
                index={0}
              >
                <ProjectDetailsForm
                  projectDetails={project}
                  setProjectDetails={setProject}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <LabelsRepeater
                  labelsState={labels}
                  newLabelsState={setLabelsRepeaterValues}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={2}>
                <IssuanceRepeater
                  issuanceState={issuance}
                  newIssuanceState={setIssuance}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={3}>
                <CoBenefitsRepeater
                  coBenefitsState={coBenefits}
                  setNewCoBenefitsState={setCoBenefits}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={4}>
                <LocationsRepeater
                  locationsState={locations}
                  setLocationsState={setLocations}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={5}>
                <RelatedProjectsRepeater
                  relatedProjectsState={relatedProjects}
                  setRelatedProjectsState={setRelatedProjects}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={6}>
                <EstimationsRepeater
                  estimationsState={estimationsState}
                  setEstimationsState={setEstimationsState}
                />
              </TabPanel>
              <TabPanel value={tabValue} index={7}>
                <RatingsRepeater
                  ratingsState={ratingsState}
                  setRatingsState={setRatingsState}
                />
              </TabPanel>
            </div>
          </StyledFormContainer>
        }
      />
    </>
  );
};

export { EditProjectsForm };
