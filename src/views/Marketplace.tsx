import React, { FC, useContext, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Collections } from 'components';
import { ICollection } from 'SDK/ContractsSDK';
import { AppStateContext, IConnectData } from '../AppContextWrapper';

const Marketplace: FC = () => {
  const { state, setIsLoading } = useContext(AppStateContext);
  const { connected, contractsSDK }: IConnectData = state;
  const [collections, setCollections] = useState<ICollection[]>([]);

  useEffect(() => {
    const renderCollections = async () => {
      setIsLoading(true);
      const result: ICollection[] = await contractsSDK.onGetCollections();
      setCollections(result);
      setIsLoading(false);
    }

    if (connected && contractsSDK) {
      renderCollections();
    }
  }, [connected, contractsSDK]);

  return (
    <MarketplaceWrapper>
      <MarketplaceTitle>{"Explore collections"}</MarketplaceTitle>
      <Collections collections={collections}/>
    </MarketplaceWrapper>
  );
};

export default Marketplace;

const fadeIn = keyframes`
  0% { opacity: 0; }
  100% { opacity: 1; }
`;

const MarketplaceWrapper = styled.div`
  display: flex;
  margin: 0 auto;
  width: 100%;
  max-width: min(1880px, 100% - 40px);
  justify-content: center;
  flex-direction: column;
  animation: ${fadeIn} 0.5s ease-out;
`;

const MarketplaceTitle = styled.div`
  width: 100%;
  text-align: center;
  color: black;
  font-size: 24px;
  padding: 60px 20px 60px;
  border-bottom: 1px solid grey;

  @media (max-width: 670px) {
    font-size: 20px;
    padding: 40px 20px;
  }
`;