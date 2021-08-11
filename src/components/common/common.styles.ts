import styled from "styled-components";

interface NftAvatarProps {
  imagePath?: string;
}

export const TinyMatriceTitle = styled.div`
  font-size: 11px !important;
  font-family: "Matrice" !important;
`;

export const SmallTextTitle = styled.div`
  font-family: Roboto;
  font-weight: 700;
  font-size: 12px;
`;

export const SmallTextTitleGrey = styled.div`
  font-family: Roboto;
  font-weight: 700;
  font-size: 12px;
  color: grey;
`;

export const NormalTextTitle = styled.div`
  font-family: Roboto;
  font-weight: 700;
  font-size: 14px;
`;

export const B1NormalTextTitle = styled.div`
  font-family: Roboto;
  font-weight: 700;
  font-size: 16px;
  line-height: 22px;
`;

export const B1NormalTextTitleGrey = styled.div`
  font-family: Roboto;
  font-weight: 700;
  font-size: 16px;
  opacity: 60%;
`;

export const B2NormalTextTitle = styled.div`
  font-family: Roboto;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
`;

export const B2NormalTextTitleGrey = styled.div`
  font-family: Roboto;
  font-weight: 500;
  font-size: 18px;
  line-height: 21px;
  opacity: 60%;
`;

export const B3NormalTextTitle = styled.div`
  font-family: Roboto;
  font-weight: 700;
  font-size: 20px;
  line-height: 28px;
`;

export const MidTextTitle = styled.h4`
  font-family: Roboto;
  font-weight: bold;
  font-size: 24px;
  line-height: 30px;
`;

export const BigTitle = styled.h2`
  font-family: Roboto;
  font-weight: bold;
  font-size: 30px;
  line-height: 30px;
`;

export const BigTitleWithBottomLine = styled.h3`
  font-family: Roboto;
  font-weight: bold;
  font-size: 30px;
  line-height: 30px;
  padding-bottom: 12px;
  border-bottom: 1px solid #cdcaca;
`;

export const MBigTitle = styled.h3`
  font-family: "Matrice";
  font-weight: 700;
  font-size: 42px;
  line-height: 42px;
`;

export const LargeTextTitle = styled.h1`
  font-family: "Matrice";
  font-weight: 500;
  font-size: 62px;
`;

export const SuperLargeTextTitle = styled.h1`
  font-family: "Matrice";
  font-weight: 500;
  font-size: 74px;
`;

export const SubDescription = styled.div`
  font-family: Roboto;
  font-weight: normal;
  font-size: 12px;
  line-height: 19px;
`;

export const DivideLine = styled.div`
  opacity: 0.1;
  height: 1px;
  background-color: #000;
`;

export const SocialIcon = styled.div`
  background: rgb(210, 210, 210, 1);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  line-height: 32px;
  text-align: center;
  svg {
    font-size: 18px;
  }
`;

export const FilterIcon = styled.div`
  width: 12px;
  height: 12px;
  line-height: 12px;
  svg {
    font-size: 12px;
  }
`;

export const NftAvatar = styled.div<NftAvatarProps>`
  width: 60px;
  height: 60px;
  background: linear-gradient(rgb(196, 196, 196) 0%, rgb(254, 254, 254) 100%);
  background-image: url(${(props) => props.imagePath});
  background-size: 100% 100%;
  background-repeat: no-repeat;
  border: 1px solid #adadad;
  box-sizing: border-box;
  border-radius: 50%;
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

export const AuctionItemCircle = styled.div`
  width: 22px;
  height: 22px;
  background: #c4c4c4;
  border: 1px solid #515151;
  border-radius: 100%;
`;

export const FlexSlideContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  direction: row;
  justify-content: flex-start;
  margin: 25px 0;
  overflow-x: auto;
  flex-wrap: nowrap;
`;

export const FlexColumnContainer = styled.div`
  display: flex;
  align-items: center;
  direction: row;
  justify-content: flex-start;
  margin: 25px 0;
  flex-wrap: wrap;
`;

export const FlexDiv = styled.div`
  display: flex;
`;

export const FlexAlignCenterDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const FlexJustifyBetweenDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
`;

interface LinkBtnProps {
  item: any;
}

export const LinkBtnSpan = styled.span<LinkBtnProps>`
  font-size: 1.25em;
  opacity: ${(p) => (p.item.active === true ? "100%" : "50%")};
  margin-right: 24px;
  font-weight: 600;
  cursor: pointer;
`;
