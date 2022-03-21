import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';

interface IProps extends RouteComponentProps {
  id: number;
  image: string;
  smallImage: string;
  name: string;
  creator: string;
  description: string;
}

const Collection: FC<IProps> = ({
  history,
  image,
  smallImage,
  name,
  creator,
  description
}) => {
  const onClick = useCallback((collectionId) => {
    history.push(`/collection/${collectionId}`);
  }, []);

  return (
    <CollectionWrapper onClick={() => onClick(1)}>
      <Image image={image}/>
      <SmallImageWrapper>
        <SmallImage smallImage={smallImage}/>
      </SmallImageWrapper>
      <Name>{name}</Name>
      <Creator>creator <span>{creator}</span></Creator>
      <Description>{description}</Description>
    </CollectionWrapper>
  )
};

export default withRouter(Collection);

const CollectionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  border: 1px solid rgb(229, 232, 235);
  border-radius: 10px;
  cursor: pointer;

  :hover {
    box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
    transition: all 0.1s ease 0s;
  }
`;

const Name = styled.div`
  width: 100%;
  text-align: center;
  font-size: 16px;
  margin-bottom: 5px;
`;

const Description = styled.div`
  text-align: center;
  margin: 15px 0 15px;
  width: 100%;
  font-size: 16px;
  color: rgb(112, 122, 131);
  max-width: 80%;
  height: 60px;
  word-break: break-all;
  overflow: hidden;
`;

const Image = styled.div<{ image: string }>`
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  height: 280px;
  width: 100%;

  background: ${({ image }) => image && `transparent url(${image}) center center no-repeat`};
  background-size: cover;
`;

const SmallImageWrapper = styled.div`
  box-shadow: rgb(14 14 14 / 60%) 0px 0px 2px 0px;
  border: 3px solid rgb(251, 253, 255);

  border-radius: 50%;
  width: 40px;
  height: 40px;
  position: relative;
  top: -20px;
`;

const SmallImage = styled.div<{ smallImage: string }>`
  width: 100%;
  height: 100%;
  border-radius: 50%;

  background: ${({ smallImage }) => smallImage && `transparent url(${smallImage}) center center no-repeat`};
  background-size: cover;`;


const Creator = styled.div`
  text-align: center;
  width: 100%;
  font-size: 14px;
  color: rgb(112, 122, 131);

  > span {
    color: rgb(32, 129, 226);
  }
`;