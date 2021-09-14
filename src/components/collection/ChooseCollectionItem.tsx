/* eslint-disable jsx-a11y/alt-text */
import React from "react";
import { B2NormalTextTitle, B3NormalTextTitle } from "../common/common.styles";
import configs from 'configs'

interface ChooseCollectionItemProps {
  item: any;
  onSelected: any;
  isSelected: boolean;
}

const ChooseCollectionItem: React.FC<ChooseCollectionItemProps> = ({ item, onSelected, isSelected }) => {
  const getClassName= () => {
    let className = "choose-collection-item dark-collection-item p-4 mr-4 text-center";
    if(isSelected) className += ' selected'; 
    return className;
  }
  return (
    <div className={getClassName()} onClick={onSelected}>
        <div className="c-nft-avatar">
          {
            item.name==='PUML' ? (<img src={configs.DEPLOY_URL + '/content/collection/puml.jpg'} />): (item.image && <img src={configs.DEPLOY_URL + item.image} alt="avatar" />)
          }
        </div>
        <B3NormalTextTitle className="mt-3 faint-color">{item.name}</B3NormalTextTitle>
        <B2NormalTextTitle className="mt-3">{item.protocol}</B2NormalTextTitle>
    </div>
  );
};

export default ChooseCollectionItem;
