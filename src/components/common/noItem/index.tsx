import React from "react";
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import {
  MidTextTitle,
  NormalTextTitle,
} from '../common.styles';

interface NoItemProps {
  title: String;
  description: String;
  btnLink: String;
  btnLabel: String;
}

const NoItem: React.FC<NoItemProps> = ({title, description, btnLink, btnLabel}) => {
  return (
    <div className="no-data">
      <div className="no-item d-flex flex-column align-items-center">
        <MidTextTitle>{title}</MidTextTitle>
        <NormalTextTitle className="mb-2" style={{ color: 'rgb(128, 128, 128)' }}>{description}</NormalTextTitle>
        <Link to={`${btnLink}`}>
          <Button className="default-btn-size outline-btn"><span>{btnLabel}</span></Button>
        </Link>
      </div>
    </div>
  );
};

export default NoItem;