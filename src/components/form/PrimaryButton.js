import React from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@mui/material';
import { ButtonText } from '../typography';

const getHeightPadding = size => {
  switch (size) {
    case 'large':
      return 'height: 40px !important; padding: 15px !important;';
    case 'small':
      return 'height: 28px !important; padding: 3px !important;';
    default:
      return '';
  }
};

const Button = styled('button')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  max-width: 100%;
  background-color: ${({ danger, theme }) =>
    danger ? '#FF4D4F' : theme.colors.default.secondaryDark};
  border: none;
  border-radius: 5px;
  padding: 10px;
  height: 32px;
  cursor: pointer;
  ${({ size }) => getHeightPadding(size)}

  &:hover {
    background-color: ${({ danger, theme }) =>
      danger ? '#FF7875' : theme.colors.default.secondaryDark};
  }

  &:active {
    background-color: ${({ danger, theme }) =>
      danger ? '#F5222D' : theme.colors.default.secondaryDark};
  }

  ${({ loading, danger, theme }) =>
    loading &&
    `
    background-color: ${
      danger ? '#FF7875' : theme.colors.default.secondaryDark
    };
    opacity: 0.65;
  `}

  &:disabled {
    background-color: #f5f5f5;
    border: 1px solid #d9d9d9;
    cursor: default;
  }

  ${({ type, theme, loading }) =>
    type === 'default' &&
    `
    background-color: white;
    border: 1px solid #e5e5e5;

    &:hover, &:active {
      background-color: white;
    }

    h4 {
      color: ${loading ? '#BFBFBF' : theme.colors.default.secondary};

      &:hover {
        color: ${theme.colors.default.secondaryDark};
      }

      &:active {
        color: ${theme.colors.default.secondary};
      }
    }
  `}
`;

const PrimaryButton = ({
  label,
  loading,
  icon,
  size,
  danger,
  disabled,
  onClick,
  type = 'primary',
}) => {
  return (
    <Button
      loading={loading}
      disabled={disabled}
      size={size}
      danger={danger}
      type={type}
      onClick={onClick}
    >
      {loading && (
        <>
          <CircularProgress size={15} thickness={5} />
          <span style={{ width: size === 'small' ? 2 : 5 }}></span>
        </>
      )}
      {icon && (
        <>
          {icon}
          <span style={{ width: size === 'small' ? 2 : 5 }}></span>
        </>
      )}
      <ButtonText color={disabled ? '#BFBFBF' : 'white'}>{label}</ButtonText>
    </Button>
  );
};

export { PrimaryButton };
