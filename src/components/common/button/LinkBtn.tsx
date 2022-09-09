import React from "react";
import {LinkBtnSpan} from "../common.styles"

interface LinkBtnProps {
  item: any;
}

const LinkBtn: React.FC<LinkBtnProps> = ({item}) => {
  return (
    <LinkBtnSpan item={item}>{item.title}({item.count})</LinkBtnSpan>
  );
};

export default LinkBtn;
