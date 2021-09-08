/* eslint-disable react-hooks/exhaustive-deps */
import CollectionController from "controller/CollectionController";
import React, { useEffect, useState } from "react";
import {
  FlexSlideContainer,
} from "../common/common.styles";
import CollectionItem from "./CollectionItem";
import { HiOutlineChevronDoubleLeft, HiOutlineChevronDoubleRight } from 'react-icons/hi';
import NoItem from "components/common/noItem";

interface CollectionsProps {
  type: string;
}

const _pageNumber = {
  hot: 1,
  featured: 1,
  sponsored: 1
};

const _pages = {
  hot: 1,
  featured: 1,
  sponsored: 1
};

const Collections: React.FC<CollectionsProps> = ({ type }) => {
  const [collectionList, setCollections] = useState<any[]>([]);
  const [pageNum, setPageNumber] = useState(_pageNumber);
  const [pages, setPages] = useState(_pages);
  const [showItems, setShowItems] = useState(5);
  const [increaseVal, setIncreaseVal] = useState(3);
  const [showArrows, setShowArrows] = useState(false);
  useEffect(() => {
    let pageNumber = 1;
    if (type === 'hot') {
      pageNumber = pageNum.hot;
    }
    if (type === 'featured') {
      pageNumber = pageNum.featured;
    }
    if (type === 'sponsored') {
      pageNumber = pageNum.sponsored;
    }

    const loadCollections = async () => {
      let data = await CollectionController.getList(type, pageNumber);
      if (data.collections.length >= showItems) {
        setShowArrows(true);
      } else {
        setShowArrows(false);
      }
      if (type === 'hot' && data.pages) {
        if (pageNum.hot === 1) {
          pages.hot = data.pages;
        }
        setCollections(pageNum.hot === 1 ? data.collections : collectionList.concat(data.collections));
      }
      if (type === 'featured' && data.pages) {
        if (pageNum.featured === 1) {
          pages.featured = data.pages;
        }
        setCollections(pageNum.featured === 1 ? data.collections : collectionList.concat(data.collections));
      }
      if (type === 'sponsored' && data.pages) {
        if (pageNum.sponsored === 1) {
          pages.sponsored = data.pages;
        }
        setCollections(pageNum.sponsored === 1 ? data.collections : collectionList.concat(data.collections));
      }
      setPages(pages);
      setIncreaseVal(3);
    }

    loadCollections();
  }, [type, pageNum]);

  const onNextCollections = () => {
    let slideElement = document.getElementById(`slider_${type}`);
    if (slideElement && slideElement.scrollWidth > slideElement.offsetWidth) {
      slideElement.scrollTo({ left: slideElement.scrollWidth, behavior: 'smooth' });
      if (showItems < collectionList.length) {
        setShowItems(showItems + increaseVal);
      } else {
        if (type === 'hot' && pages.hot > pageNum.hot) {
          pageNum.hot += 1;
        }
        if (type === 'featured' && pages.featured > pageNum.featured) {
          pageNum.featured += 1;
        }
        if (type === 'sponsored' && pages.sponsored > pageNum.sponsored) {
          pageNum.sponsored += 1;
        }
        setPageNumber(pageNum);
      }
    }
  }

  const onPrevCollections = () => {
    let slideElement = document.getElementById(`slider_${type}`);
    if (slideElement && slideElement.scrollWidth > slideElement.offsetWidth) {
      slideElement.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }

  return (
    <FlexSlideContainer className="slide-container justify-content-center" id={`slider_${type}`}>
      {
        collectionList.length === 0 && (
          <NoItem
            title="No items found"
            description="Come back soon! Or try to browse something for you on our marketplace"
            btnLink="/"
            btnLabel="Browse marketplace"
          />
        )
      }
      {
        showArrows && (
          <div className="arrow-btn left pointer-cursor" onClick={() => onPrevCollections()}><HiOutlineChevronDoubleLeft /></div>
        )
      }
      {collectionList.map((collection, index) => (
        index < showItems && (
          <CollectionItem item={collection} key={index} />
        )
      ))}
      {
        showArrows && (
          <div className="arrow-btn right pointer-cursor" onClick={() => onNextCollections()}><HiOutlineChevronDoubleRight /></div>
        )
      }
    </FlexSlideContainer>
  );
};

export default Collections;
