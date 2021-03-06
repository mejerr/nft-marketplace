import React, { FC, useCallback, useContext } from 'react';
import styled, { keyframes } from 'styled-components';
import { useHistory } from 'react-router-dom';
import { Button } from "components";
import { nftImage } from 'assets';
import { AppStateContext, IConnectData } from '../AppContextWrapper';

const Homepage: FC = () => {
  const { state, onConnect } = useContext(AppStateContext);
  const { connected }: IConnectData = state;

  const history = useHistory();

  const onClick = useCallback((pathname) => {
    if (!connected) {
      onConnect({ onSuccess: () => history.push(pathname) });
      return;
     }

     history.push(pathname);
  }, [connected, onConnect, history]);

  return (
    <HomepageWrapper >
      <HomepageContent>
        <LeftPanel>
          <Title>{"Discover, collect, and sell \n extraordinary NFTs"}</Title>
          <Subtitle>{"LimeBlock is one of the world's first and largest NFT marketplace"}</Subtitle>
          <ButtonsWrapper>
            <MarketplaceButtonWrapper>
              <Button
                title={'Marketplace'}
                width={"100%"}
                height={"50px"}
                onClick={() => onClick("/marketplace")}
              />
            </MarketplaceButtonWrapper>
            <CreateButtonWrapper>
              <Button
                title={'Create'}
                width={"100%"}
                height={"50px"}
                onClick={() => onClick("/create")}
              />
            </CreateButtonWrapper>
          </ButtonsWrapper>
        </LeftPanel>

        <RightPanel>
          <ImageWrapper onClick={() => onClick("/marketplace")}>
            <NFTImage />
          </ImageWrapper>
        </RightPanel>
      </HomepageContent>
    </HomepageWrapper>
  );
};

export default Homepage;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const HomepageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-out;
  padding-bottom: 20px;
`;

const HomepageContent = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: min(1280px, 100% - 40px);

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const LeftPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 50%;
  padding: 70px 20px 0;

  @media (max-width: 800px) {
    width: 100%;
    padding: 40px 20px 0;
    align-items: center;
  }
`;

const Title = styled.div`
  font-size: 45px;
  max-width: 100%;

  @media (max-width: 800px) {
    text-align: center;
  }
`;

const Subtitle = styled.div`
  font-size: 24px;
  margin: 20px 0 40px;
  max-width: 400px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
`;

const CreateButtonWrapper = styled.div`
  width: 150px;
  height: 50px;
  margin: 0 10px;
  border-radius: 10px;
  border: 1px solid #024bb0;

  > div {
    color: #024bb0;
    margin: 0;
    border-radius: 10px;
    :hover {
      box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
      transition: all 0.2s ease 0s;
      color: #024bb0;
    }
  }
`;

const MarketplaceButtonWrapper = styled(CreateButtonWrapper as any)`
  background-color: #024bb0;

  :hover {
    background-color: rgba(2, 75, 176, 0.9);
  }

  > div {
    color: white;
    :hover {
      box-shadow: rgb(4 17 29 / 25%) 0px 0px 8px 0px;
      color: #fff;
    }
  }
`;

const RightPanel = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 50%;
  padding-top: 50px;

  @media (max-width: 800px) {
    width: 100%;
    align-items: center;
  }
`;

const ImageWrapper = styled.div`
  width: 550px;
  height: 550px;
  cursor: pointer;

  @media (max-width: 1300px) {
    max-width: 550px;
    max-height: 440px;
  }

  @media (max-width: 1100px) {
    max-width: 460px;
    max-height: 400px;
    margin-top: 30px;
  }

  @media (max-width: 1000px) {
    max-width: 360px;
    max-height: 370px;
    margin-top: 30px;
  }

  @media (max-width: 420px) {
    max-width: 280px;
    max-height: 280px;
    margin-top: 20px;
  }
`;

const NFTImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  max-width: 100%;
  max-height: 100%;
  background: transparent url(${nftImage}) center center no-repeat;
  background-size: cover;
  object-fit: cover;
  flex-shrink: 0;
`;
