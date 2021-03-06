import React, { FC, Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCopy,
  faEdit,
  faCancel,
  faCheck,
  faImage,
  faUpload
} from '@fortawesome/free-solid-svg-icons';
import { ethereumImage } from 'assets';
import { ImageBlock, Button } from 'components';
import { AppStateContext, IConnectData } from 'AppContextWrapper';
import { uploadPicture } from 'helpers/utilities';

interface IProps {
  image: string;
  name: string,
  creator?: string,
  userBalance?: number,
  description?: string,
  showCreator?: boolean
}

const BlockHeader: FC<IProps> = ({
  image,
  name,
  creator,
  userBalance = 0,
  description = '',
  showCreator = true
}) => {
  const { state, setIsLoading } = useContext(AppStateContext);
  const { connected, contractsSDK, userAddress }: IConnectData = state;

  const [creatorName, setCreatorName] = useState<string>('');
  const [creatorImage, setCreatorImage] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);
  const [listingFee, setListingFee] = useState<number>(0);
  const [marketOwner, setMarketOwner] = useState<string>('');
  const [updateState, setUpdateState] = useState<boolean>(false);
  const creatorNode = useRef<HTMLHeadingElement>(null);

  const history = useHistory();

  const isCollection = history.location.pathname.startsWith("/collection");

  const onAddressClick = useCallback(() => {
    if (!showCreator) {
      copyToClipboard();
      return;
    }
    history.push(`/my-collection/${creator}`);
  }, [creator, showCreator, history]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(creatorNode.current?.innerText ||'');
    alert("Copied the text: " + creatorNode.current?.innerText ||'');
  }, [creatorNode]);

  const onOpenInput = useCallback(() => {
    setShowInput(!showInput);
  }, [showInput]);

  const onNameInputChange = useCallback((e) => {
    setCreatorName(e.target.value);
  }, []);

  const onChangeNameClick = useCallback(async () => {
    if (connected && contractsSDK && creatorName.length) {
      setIsLoading(true);
      await contractsSDK.onChangeCreatorName(creatorName, setUpdateState);
      setShowInput(false);
      setIsLoading(false);
    }
  }, [connected, contractsSDK, creatorName]);

  const onUploadPicture = useCallback(async (e) => {
    const file = e.target.files[0];
    const url = await uploadPicture(file);
    setCreatorImage(url);
  }, []);

  const onAcceptPicture = useCallback(async () => {
    if (connected && contractsSDK) {
      setIsLoading(true);
      await contractsSDK.onChangeCreatorImage(creatorImage, setUpdateState);
      setIsLoading(false);
    }
  }, [connected, contractsSDK, creator, creatorImage]);

  const onTransferClick = useCallback(async () => {
    if (connected && contractsSDK) {
      setIsLoading(true);
      await contractsSDK.onTransferListingFee(setUpdateState);
      setIsLoading(false);
    }
  }, [connected, contractsSDK]);

  useEffect(() => {
    const initListingFee = async () => {
      setIsLoading(true);
      const result = await contractsSDK.onGetListingFee();
      setListingFee(result);
      setMarketOwner(await contractsSDK?.marketPlace.owner());
      setIsLoading(false);
    }

    if (connected && contractsSDK) {
      initListingFee();
    }
  }, [connected, contractsSDK, updateState]);

  return (
    <BlockHeaderWrapper>
      <ImageWrapper>
        {creatorImage ? <Image src={creatorImage}/> : !image && <EmptyIcon icon={faImage} />}
        {image && !creatorImage && <ImageBlock image={image} width={'100%'} height={'100%'}/>}
      </ImageWrapper>

      <BlockName>
        {showInput ?
          <Fragment>
            <NameInput placeholder={"Name"} onChange={onNameInputChange}/>
            <Icon icon={faCheck} onClick={onChangeNameClick}/>
            <Icon icon={faCancel} onClick={onOpenInput}/>
          </Fragment> :
          <Fragment>
            {name || 'unnamed'}
            {userAddress === creator && !isCollection && <Icon icon={faEdit} onClick={onOpenInput}/>}
          </Fragment>
        }
        {userAddress === creator && !isCollection &&
          <UploadImageWrapper>
            {creatorImage ?
              <UploadImageButton onClick={onAcceptPicture}>Upload image</UploadImageButton> :
              <Fragment>
                <Icon icon={faUpload}/>
                <ImageInput
                  type="file"
                  name="Asset"
                  onChange={onUploadPicture}
                />
              </Fragment>
            }
          </UploadImageWrapper>
        }
      </BlockName>

      {creator === marketOwner && !isCollection &&
        <BlockListingFee>
          <ListingFee>Collected Listing fees: {listingFee}</ListingFee>
          <TransferButton>
            <Button
              title={"Transfer"}
              width={"100%"}
              height={"100%"}
              onClick={onTransferClick}
            />
          </TransferButton>
        </BlockListingFee>
      }

      <BlockCreator >
        {showCreator && <div>Created by</div>}
        <span onClick={onAddressClick} ref={creatorNode}>{creator}</span>
        <Icon icon={faCopy} onClick={copyToClipboard}/>
      </BlockCreator>
      {!!userBalance &&
        <BalanceWrapper>
          <ValueIcon/>
          Balance: {userBalance.toString().substring(0, 10)}
        </BalanceWrapper>
      }
      {description && (
        <BlockDescriptionWrapper>
          <BlockDescription>
            {description}
          </BlockDescription>
        </BlockDescriptionWrapper>
      )}
    </BlockHeaderWrapper>
  );
};

export default BlockHeader;

const BlockHeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  position: relative;
`;

const ImageWrapper = styled.div`
  position: relative;
  height: 220px;
  width: 100%;
  display: flex;
  justify-content: center;

  & img {
    border-radius: 0;
  }

  :hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const BlockName = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  width: 100%;
  text-align: center;
  margin: 20px 0;
  word-break: break-all;
`;

const NameInput = styled.input`
  width: 250px;
  font-size: 30px;
  height: 45px;
  padding: 5px;
  background: #fff;
  border-radius: 4px;
`;

const BlockCreator = styled.div`
  font-size: 16px;
  width: 100%;
  text-align: center;
  color: rgb(112, 122, 131);
  padding: 0 10px;

  > span {
    color: rgb(32, 129, 226);
    word-break: break-all;
    cursor: pointer;
    :hover {
      color: rgba(32, 129, 226, 0.7);
    }
  }
`;

const ImageInput = styled.input`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
`;

const BlockListingFee = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  @media (max-width: 700px) {
    flex-direction: column;
  }
`;

const ListingFee = styled.div`
  font-size: 16px;
`;

const TransferButton = styled.div`
  height: 30px;
  font-size: 16px;
  background-color: #024bb0;
  border-radius: 10px;
  margin-left: 10px;
  padding: 10px;
  color: #fff;
  cursor: pointer;

  :hover {
    background-color: rgba(2, 75, 176, 0.9);
  }

  & div {
    margin: 0;
    color: #fff;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 220px;
  border-radius: 10px;
  flex-shrink: 0;
  object-fit: cover;
`;

const EmptyIcon = styled(FontAwesomeIcon)`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
`;

const Icon = styled(FontAwesomeIcon)`
  width: 20px;
  height: 20px;
  margin-left: 10px;
  cursor: pointer;
`;

const UploadImageWrapper = styled.div`
  position: relative;
  display: flex;
`;

const UploadImageButton = styled.div`
  font-size: 16px;
  background-color: #024bb0;
  border-radius: 10px;
  margin-left: 10px;
  padding: 10px;
  color: #fff;
  cursor: pointer;

  :hover {
    background-color: rgba(2, 75, 176, 0.9);
  }
`;

const BlockDescriptionWrapper = styled.div`
  margin: 20px 0;
  padding: 20px;
  width: 100%;
  max-width: 700px;
  overflow: hidden;
  position: relative;
  max-height: 120px;
  overflow-y: auto;
`;

const BlockDescription = styled.div`
  font-size: 16px;
  text-align: center;
  word-break: break-all;
  line-height: 22px;
  color: rgb(112, 122, 131);
`;

const BalanceWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 0 5px;
`;

const ValueIcon = styled.div`
  display: flex;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: transparent url(${ethereumImage}) center center no-repeat;
  background-size: contain;
`;