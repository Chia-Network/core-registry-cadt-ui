import _ from 'lodash';
import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useIntl, FormattedMessage } from 'react-intl';

import {
  StandardInput,
  InputSizeEnum,
  InputStateEnum,
  InputVariantEnum,
  Divider,
  ModalFormContainerStyle,
  FormContainerStyle,
  BodyContainer,
  Body,
  DescriptionIcon,
  ToolTipContainer,
  DateSelect,
  LabelContainer,
  SelectSizeEnum,
  SelectTypeEnum,
  SelectStateEnum,
  Select,
} from '..';
import { labelSchema } from './LabelsValidation';

const StyledLabelContainer = styled('div')`
  margin-bottom: 0.5rem;
`;

const StyledFieldContainer = styled('div')`
  padding-bottom: 1.25rem;
`;

const InputContainer = styled('div')`
  width: 20rem;
`;

const CreateLabelsForm = ({ value, onChange }) => {
  const [errorLabelMessage, setErrorLabelMessage] = useState({});
  const intl = useIntl();
  const { pickLists } = useSelector(store => store.climateWarehouse);

  const selectLabelTypeOptions = useMemo(
    () =>
      pickLists.labelType.map(labelTypeItem => ({
        value: labelTypeItem,
        label: labelTypeItem,
      })),
    [pickLists],
  );

  useEffect(() => {
    const errors = async () => {
      await labelSchema
        .validate(value, { abortEarly: false })
        .catch(({ errors }) => {
          setErrorLabelMessage(errors);
        });
    };
    errors();
  }, [value]);

  const labelErrorMessage = name => {
    if (!_.isEmpty(errorLabelMessage)) {
      for (let message of errorLabelMessage) {
        if (message.includes(name)) {
          return (
            <Body size="Small" color="red">
              {message}
            </Body>
          );
        }
      }
    }
  };

  return (
    <ModalFormContainerStyle>
      <FormContainerStyle>
        <BodyContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="label" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-label-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                variant={labelErrorMessage('Label') && InputVariantEnum.error}
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'label',
                })}
                state={InputStateEnum.default}
                value={value.label}
                onChange={event => {
                  onChange({ ...value, label: event });
                }}
              />
            </InputContainer>
            {labelErrorMessage('Label')}
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="label-type" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-label-type-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <Select
                size={SelectSizeEnum.large}
                type={SelectTypeEnum.basic}
                options={selectLabelTypeOptions}
                state={SelectStateEnum.default}
                placeholder={intl.formatMessage({
                  id: 'label-type',
                })}
                selected={
                  value.labelType
                    ? [{ value: value.labelType, label: value.labelType }]
                    : undefined
                }
                onChange={selectedOptions =>
                  onChange({ ...value, labelType: selectedOptions[0].value })
                }
              />
            </InputContainer>
            {labelErrorMessage('labelType')}
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="crediting-period-start-date" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-crediting-period-start-date-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <DateSelect
                size="large"
                dateValue={value.creditingPeriodStartDate}
                setDateValue={event =>
                  onChange({ ...value, creditingPeriodStartDate: event })
                }
              />
            </InputContainer>
            {labelErrorMessage('creditingPeriodStartDate')}
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="crediting-period-end-date" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-crediting-period-end-date-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <DateSelect
                size="large"
                dateValue={value.creditingPeriodEndDate}
                setDateValue={event =>
                  onChange({ ...value, creditingPeriodEndDate: event })
                }
              />
            </InputContainer>
            {labelErrorMessage('creditingPeriodEndDate')}
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="validity-period-start-date" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-validity-period-start-date-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <DateSelect
                size="large"
                dateValue={value.validityPeriodStartDate}
                setDateValue={event =>
                  onChange({ ...value, validityPeriodStartDate: event })
                }
              />
            </InputContainer>
            {labelErrorMessage('validityPeriodStartDate')}
          </StyledFieldContainer>
        </BodyContainer>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="validity-period-end-date" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-validity-period-end-date-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <DateSelect
                size="large"
                dateValue={value.validityPeriodEndDate}
                setDateValue={event =>
                  onChange({ ...value, validityPeriodEndDate: event })
                }
              />
            </InputContainer>
            {labelErrorMessage('validityPeriodEndDate')}
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="unit-quantity" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-unit-quantity-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                variant={
                  labelErrorMessage('unitQuantity') && InputVariantEnum.error
                }
                type="number"
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'unit-quantity',
                })}
                state={InputStateEnum.default}
                value={value.unitQuantity}
                onChange={event => {
                  onChange({ ...value, unitQuantity: event });
                }}
              />
            </InputContainer>
            {labelErrorMessage('unitQuantity')}
          </StyledFieldContainer>
          <StyledFieldContainer>
            <StyledLabelContainer>
              <Body>
                <LabelContainer>
                  <FormattedMessage id="label-link" />
                </LabelContainer>
                <ToolTipContainer
                  tooltip={intl.formatMessage({
                    id: 'labels-label-link-description',
                  })}
                >
                  <DescriptionIcon height="14" width="14" />
                </ToolTipContainer>
              </Body>
            </StyledLabelContainer>
            <InputContainer>
              <StandardInput
                variant={
                  labelErrorMessage('labelLink') && InputVariantEnum.error
                }
                size={InputSizeEnum.large}
                placeholderText={intl.formatMessage({
                  id: 'label-link',
                })}
                state={InputStateEnum.default}
                value={value.labelLink}
                onChange={event => {
                  onChange({ ...value, labelLink: event });
                }}
              />
            </InputContainer>
            {labelErrorMessage('labelLink')}
          </StyledFieldContainer>
        </div>
      </FormContainerStyle>
      <Divider />
    </ModalFormContainerStyle>
  );
};

export { CreateLabelsForm };