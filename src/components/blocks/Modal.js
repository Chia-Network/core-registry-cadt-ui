import React from 'react';
import styled, { css, withTheme } from 'styled-components';
import {
  SuccessIcon,
  InfoIcon,
  ErrorIcon,
  WarningIcon,
  Body,
  PrimaryButton,
  CloseIcon,
  Divider,
} from '..';

const Container = styled('div')`
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContainer = styled('div')`
  height: ${props => (props.basic ? '12.625rem' : '11.75rem')};
  width: ${props => (props.basic ? '32.5rem' : '25rem')};
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0rem 0.5625rem 1.75rem 0.5rem rgba(0, 0, 0, 0.05),
    0rem 0.375rem 1rem rgba(0, 0, 0, 0.08),
    0rem 0.1875rem 0.375rem -0.25rem rgba(0, 0, 0, 0.12);
`;

const ButtonContainer = styled('div')`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  ${props =>
    props.basic &&
    css`
      height: 3.25rem;
      width: 29.5rem;
      align-self: center;
      align-items: center;
    `};
`;

const IconContainer = styled('div')`
  align-self: center;
  height: 8.25rem;
  margin-right: 1.0938rem;
`;

const MessageContainer = styled('div')`
  display: flex;
  flex-direction: column;
  height: ${props => (props.basic ? '100%' : '8.25rem')};
  width: ${props => (props.basic ? '100%' : '18.5rem')};
  justify-content: space-evenly;
  align-items: ${props => (props.basic ? 'unset' : 'center')};
`;

const BodyContainer = styled('div')`
  margin-bottom: 1.5rem;
  ${props =>
    props.basic &&
    css`
      display: flex;
      align-items: center;
      height: 2.75rem;
      width: 29.5rem;
      flex-grow: 0.5;
      align-self: center;
      margin-bottom: 0%;
    `};
`;

const TitleContainer = styled('div')`
  align-self: flex-start;
  ${props =>
    props.basic &&
    css`
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 29.5rem;
      height: 1.5rem;
      align-self: center;
      flex-grow: 0.25;
    `};
`;

const OkContainer = styled('div')`
  margin-left: 0.5rem;
`;
const Modal = withTheme(
  ({ title, body, showButtons, onClose, onOk, type, confirmation, basic }) => {
    return (
      <>
        <Container>
          <ModalContainer basic={basic}>
            {type === 'info' && !basic && (
              <IconContainer>
                <InfoIcon height="21" width="21" />
              </IconContainer>
            )}
            {type === 'error' && !basic && (
              <IconContainer>
                <ErrorIcon height="21" width="21" />
              </IconContainer>
            )}
            {type === 'success' && !basic && (
              <IconContainer>
                <SuccessIcon height="21" width="21" />
              </IconContainer>
            )}
            {(type === 'warning' || confirmation) && !basic && (
              <IconContainer>
                <WarningIcon height="21" width="21" />
              </IconContainer>
            )}
            <MessageContainer basic={basic}>
              <TitleContainer basic={basic}>
                <Body size="Bold">{title}</Body>
                {basic && <CloseIcon height="8.91" width="8.66" />}
              </TitleContainer>
              {basic && <Divider height="1" width="520" />}
              <BodyContainer basic={basic}>
                <Body size="Small">{body}</Body>
              </BodyContainer>

              {basic && <Divider height="1" width="520" />}
              {showButtons && (
                <ButtonContainer basic={basic}>
                  {(confirmation || basic) && (
                    <PrimaryButton
                      size="large"
                      label="Cancel"
                      onClose={onClose}
                    />
                  )}
                  <OkContainer>
                    <PrimaryButton size="large" label="Ok" onClick={onOk} />
                  </OkContainer>
                </ButtonContainer>
              )}
            </MessageContainer>
          </ModalContainer>
        </Container>
      </>
    );
  },
);

export { Modal };