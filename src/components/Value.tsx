import React, { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ethereumImage } from 'assets';
import { parseEtherUSD } from 'helpers/utilities';

interface IProps {
  price?: number;
  showDollars?: boolean;
}

const Value: FC<IProps>  = ({ price = 0, showDollars = true }) => {
  const [USDPrice, setUSDPrice] = useState<string>('0');

  useEffect(() => {
    const getEtherUSD = async () => {
      const parsedEther = await parseEtherUSD(price);
      setUSDPrice(parsedEther);
    }

    if (price > 0) {
      getEtherUSD();
    }
  }, [price]);

  return (
    <ValueWrapper>
      <ValueIcon />
      <Amount>{price}</Amount>
      {showDollars && <DollarsAmount>{`($${USDPrice})`}</DollarsAmount>}
  </ValueWrapper>
  );
}

export default Value;

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  background: white;
`;

const ValueIcon = styled.div`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  background: transparent url(${ethereumImage}) center center no-repeat;
  background-size: contain;
`;

const Amount = styled.div`
  font-size: 24px;

  @media (max-width: 450px) {
    font-size: 18px;
  }
`;

const DollarsAmount = styled.div`
  font-size: 15px;
  margin: 8px 0 0 4px;
  color: rgb(112, 122, 131);

  @media (max-width: 450px) {
    font-size: 12px;
  }
`;


