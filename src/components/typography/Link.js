import React from 'react';
import styled from 'styled-components';

import { Body } from '../../components';

const StyledLink = styled('div')`
  color: ${props => props.color || props.theme.colors.default.secondary};
  :hover {
    color: ${props => props.theme.colors.default.secondaryDark};
  }
`;

const Link = ({ children, color = '#6e7d7f' }) => {
  return (
    <Body>
      <StyledLink color={color}>{children}</StyledLink>
    </Body>
  );
};

export { Link };
