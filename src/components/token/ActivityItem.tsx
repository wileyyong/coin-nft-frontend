import React from "react";
import { Image, Nav } from 'react-bootstrap';
import moment from 'moment';
import { Link, useHistory } from 'react-router-dom';
import {
  B1NormalTextTitle,
  SmallTextTitle
} from "../common/common.styles";
import configs from "configs";
import { FaTag, FaHeart, FaCheck } from "react-icons/fa";
import { BsLightningFill } from 'react-icons/bs';
import { BiTransfer } from 'react-icons/bi';
import { RiAuctionFill } from 'react-icons/ri';
import { ImDiamonds } from 'react-icons/im';
import imgAvatar from "assets/imgs/avatar.png";

interface ActivityItemProps {
  item: any
}

const ActivityItem: React.FC<ActivityItemProps> = ({item}) => {
  const history = useHistory();
  const getTokenThumbnail = () => {
    if (item.offer && item.offer.token && item.offer.token._id) {
      let media = item.offer.token.thumbnail ? item.offer.token.thumbnail.toLowerCase() : item.offer.token.media.toLowerCase();
      if (
        media.includes("mp3") ||
        media.includes("mp4") ||
        media.includes("webm")
      ) {
        return `${configs.DEPLOY_URL}/content/collection/puml.png`;
      }
      return `${configs.DEPLOY_URL}${item.offer.token.thumbnail || item.offer.token.media}`;
    } else if (item.token) {
      let media = item.token.thumbnail ? item.token.thumbnail.toLowerCase() : item.token.media.toLowerCase();
      if (
        media.includes("mp3") ||
        media.includes("mp4") ||
        media.includes("webm")
      ) {
        return `${configs.DEPLOY_URL}/content/collection/puml.png`;
      }
      return `${configs.DEPLOY_URL}${item.token.thumbnail || item.token.media}`;
    } else if (item.to_user) {
      return `${configs.DEPLOY_URL}${item.to_user.thumbnail || item.to_user.avatar}`;
    }
    return `${configs.DEPLOY_URL}/content/collection/puml.png`;
  };

  const getUserAvatar = (activity: any) => {
    if (activity.user && activity.user.avatar) {
      return `${configs.DEPLOY_URL}${activity.user.avatar}`;
    }
    return imgAvatar;
  }

  const getLink = () => {
    if (item.token && item.user && item.user.wallet) {
      return `/tokens/${item.token._id}`; 
    } else if (item.offer && item.offer.token && item.offer.token._id) {
      return `/tokens/${item.offer.token._id}`;
    } else if (item.to_user && item.to_user.wallet) {
      return `/users/${item.to_user.wallet}`
    }
    return '';
  }

  const getName = () => {
    if (item.token) {
      return item.token.name;
    } else if (item.offer && item.offer.token) {
      return item.offer.token.name;
    } else if (item.to_user) {
      return item.to_user.name;
    }
    return '';
  }

  const getDetailsOfActivity = (activity: any) => {
    switch(activity.type) {
      case 'following':
        return <div className="detail-info"><span>started following</span>{
          <div className="small-featured">
            <Image className="mr-2" src={getUserAvatar(activity)} />
            <SmallTextTitle onClick={() => history.push(`/users/${activity.user.wallet}`)}>{activity.user.name}</SmallTextTitle>
          </div>
        }</div>;
      case 'liked':
        return <div className="detail-info"><span>liked by</span>{
          <div className="small-featured">
            <Image className="mr-2" src={getUserAvatar(activity)} />
            <SmallTextTitle onClick={() => history.push(`/users/${activity.user.wallet}`)}>{activity.user.name}</SmallTextTitle>
          </div>
        }</div>;
      case 'listed':
        return <div className="detail-info"><span>listed by</span>{
          <div className="small-featured">
            <Image className="mr-2" src={getUserAvatar(activity)} />
            <SmallTextTitle onClick={() => history.push(`/users/${activity.user.wallet}`)}>{activity.user.name}</SmallTextTitle>
          </div>
        }</div>;
      case 'purchased':
        return <div className="detail-info"><span>purchased by</span>{
          <div className="small-featured">
            <Image className="mr-2" src={getUserAvatar(activity)} />
            <SmallTextTitle onClick={() => history.push(`/users/${activity.user.wallet}`)}>{activity.user.name}</SmallTextTitle>
          </div>
        }</div>;
      case 'minted':
        return <div className="detail-info"><span>accepted bid</span>{
          <div className="small-featured">
            <Image className="mr-2" src={getUserAvatar(activity)} />
            <SmallTextTitle onClick={() => history.push(`/users/${activity.user.wallet}`)}>{activity.user.name}</SmallTextTitle>
          </div>
        }</div>;
      case 'transfered':
        return <div className="detail-info"><span>transfered from</span>{
          <div className="small-featured">
            <Image className="mr-2" src={getUserAvatar(activity)} />
            <SmallTextTitle onClick={() => history.push(`/users/${activity.user.wallet}`)}>{activity.user.name}</SmallTextTitle>
          </div>
        }</div>;
      case 'offered':
        return <div className="detail-info"><span>offered</span>{
          <div className="small-featured">
            <Image className="mr-2" src={getUserAvatar(activity)} />
            <SmallTextTitle onClick={() => history.push(`/users/${activity.user.wallet}`)}>{activity.user.name}</SmallTextTitle>
          </div>
        }</div>;
      default:
        break;
    }
  }

  const getBadgeByType = (activity: any) => {
    switch(activity.type) {
      case 'following':
        return <div className="badge" style={{ backgroundColor: 'rgb(109, 188, 0)'}}><FaCheck /></div>;
      case 'liked':
        return <div className="badge" style={{ backgroundColor: 'rgb(255, 158, 18)' }}><FaHeart /></div>;
      case 'listed':
        return <div className="badge" style={{ backgroundColor: 'rgb(0, 147, 255)' }}><FaTag /></div>;
      case 'purchased':
        return <div className="badge" style={{ backgroundColor: 'rgb(255, 199, 90)' }}><ImDiamonds /></div>;
      case 'minted':
        return <div className="badge" style={{ backgroundColor: 'rgb(235, 88, 73)' }}><BsLightningFill /></div>;
      case 'transfered':
        return <div className="badge" style={{ backgroundColor: 'rgb(177, 89, 220)' }}><BiTransfer /></div>;
      case 'offered':
        return <div className="badge" style={{ backgroundColor: 'rgb(247, 109, 192)' }}><RiAuctionFill /></div>;
      default:
        break;
    }
  };

  return (
    <div className="activity-item mb-3">
      <div className="featured-image">
        <Image
          style={{ borderRadius: item.type === 'following' ? 68 : 3 }}
          src={getTokenThumbnail()}
        />
        {getBadgeByType(item)}
      </div>
      <div className="content">
        <B1NormalTextTitle
          className="title font-matrice mb-2"
          style={{ fontWeight: 'bolder' }}
        >
          <Nav.Link
            as={Link}
            to={getLink()}
          >
            {getName()}
          </Nav.Link>
        </B1NormalTextTitle>
        <div className="details mb-2">
          {getDetailsOfActivity(item)}
        </div>
        <div className="date">
          { moment(`${item.date}`).format('M/D/YYYY, H:mm A') }
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
