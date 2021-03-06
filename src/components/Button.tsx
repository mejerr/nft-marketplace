import React, { FC } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface IProps {
  title?: string;
  isActive?: boolean;
  width?: string;
  height?: string;
  alignItems?: string;
  justifyContent?: string;
  arrow?: boolean;
  onClick?: () => void;
}

const Button: FC<IProps> = ({
  title,
  isActive = false,
  width = "70px",
  height = "70px",
  alignItems = "center",
  justifyContent = "center",
  arrow = false,
  onClick
}) => {
  return (
    <StyledButton
      active={isActive}
      width={width}
      height={height}
      onClick={onClick}
      alignItems={alignItems}
      justifyContent={justifyContent}
    >
      {title && <Title>{title}</Title>}
      {arrow && <ArrowIcon icon={faArrowRight}/>}
    </StyledButton>
  );
};

export default Button;

const StyledButton = styled.div<{
  active: boolean,
  width: string,
  height: string,
  alignItems?: string;
  justifyContent?: string;
}>`
  display: flex;
  position: relative;
  margin-right: 5px;
  margin-left: 5px;

  width: ${({ width }) => width};
  height: ${({ height }) => height};
  align-items: ${({ alignItems }) => alignItems && alignItems};
  justify-content: ${({ justifyContent }) => justifyContent && justifyContent};

  font-family: "Popins, sans-serif";
  font-weight: 600;
  color: ${({ active }) => active ? 'black' : 'rgba(0, 0, 0, 0.6)'};

  border-bottom: ${({ active }) => active && '3px solid blue'};
  transition-property: border-bottom;
  transition-duration: 0.3s;

  :hover {
    color: ${({ active }) => active ? 'black' : 'rgba(0, 0, 0, 0.8)'};
    cursor: pointer;
  }
`;

const Title = styled.div`
  font-size: 16px;
`;

const ArrowIcon = styled(FontAwesomeIcon)`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 20px;
`;