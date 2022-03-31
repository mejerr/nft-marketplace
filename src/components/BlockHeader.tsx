import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, IconDefinition } from '@fortawesome/free-solid-svg-icons';
interface IProps {
  image: string;
  name: string,
  creator: string,
  joinedDate: string,
  description?: string,
  showCreator?: boolean
}

const BlockHeader: FC<IProps> = ({
  image,
  name,
  creator,
  joinedDate,
  description = "",
  showCreator = true
}) => {
  const [height, setHeight] = useState<string>("120px");
  const [openDescription, setOpenDescription] = useState<boolean>(false);
  const descriptionNode = useRef<HTMLHeadingElement>(null);

  const onOpenDescription = useCallback(() => {
    setOpenDescription(!openDescription);
  }, [openDescription]);

  useEffect(() => {
    if (descriptionNode.current) {
      setHeight(openDescription ? `${descriptionNode.current.scrollHeight - 40}px` : "120px");
    }
  }, [openDescription]);

  return (
    <BlockWrapper>
      <BlockImage image={image}/>
      <BlockName>{name}</BlockName>
      <BlockCreator>
        {showCreator && <div>Created by</div>}
        <span>{creator}</span>
        {joinedDate && <JoinedDate>Joined {joinedDate}</JoinedDate>}
      </BlockCreator>
      {description && (<>
        <BlockDescriptionWrapper
          ref={descriptionNode}
          style={{ height }}
          isOpen={openDescription}
          onClick={onOpenDescription}
        >
          <BlockDescription >
            {description}
          </BlockDescription>
        </BlockDescriptionWrapper>
        <ArrowIcon icon={openDescription? faAngleUp : faAngleDown} onClick={onOpenDescription} />
      </>)}
    </BlockWrapper>
  );
};

export default BlockHeader;

const BlockWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
`;

const BlockImage = styled.div<{ image: string }>`
  height: 220px;
  width: 100%;
  background: ${({ image }) => `transparent url(${image}) center center no-repeat`};
  background-size: cover;
`;

const BlockName = styled.div`
  font-size: 40px;
  width: 100%;
  text-align: center;
  margin: 20px 0;
`;

const BlockCreator = styled.div`
  font-size: 16px;
  width: 100%;
  text-align: center;
  color: rgb(112, 122, 131);

  > span {
    color: rgb(32, 129, 226);
  }
`;

const JoinedDate = styled.div`
  font-size: 16px;
  margin: 10px 0 30px;
`;

const BlockDescriptionWrapper = styled.div<{ isOpen: boolean }>`
  margin: 20px 0;
  padding: 20px;
  width: 100%;
  max-width: 700px;
  overflow: hidden;
  position: relative;
  cursor: pointer;

  height: ${({ isOpen }) => isOpen ? "300px" : "120px"};
  transition: all 0.3s ease-out;
  mask: ${({ isOpen }) => isOpen ? "initial": "linear-gradient(rgb(255, 255, 255) 45%, transparent)"};
`;

const BlockDescription = styled.div`
  font-size: 16px;
  text-align: center;
  word-break: break-all;
  line-height: 22px;
  color: rgb(112, 122, 131);
`;

const ArrowIcon = styled(FontAwesomeIcon)<{ icon: IconDefinition }>`
  width: 12px;
  height: 12px;
  position: relative;
  cursor: pointer;
  top: ${({ icon }) => icon === faAngleUp ? "-22px" : "-35px"};
`;