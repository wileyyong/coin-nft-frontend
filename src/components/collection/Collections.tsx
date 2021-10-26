/* eslint-disable react-hooks/exhaustive-deps */
import CollectionController from "controller/CollectionController";
import React, { useEffect, useState } from "react";
import {
  FlexSlideContainer,
} from "../common/common.styles";
import CollectionItem from "./CollectionItem";
import NoItem from "components/common/noItem";
import LoadingBar from "components/common/LoadingBar";
import Carousel from 'react-bootstrap/Carousel';

interface CollectionsProps {
  type: string;
}

const _pageNumber = {
  hot: 1
};

const _pages = {
  hot: 1
};

const Collections: React.FC<CollectionsProps> = ({ type }) => {
  const [collectionList, setCollections] = useState<any[]>([]);
  const [pageNum] = useState(_pageNumber);
  const [pages, setPages] = useState(_pages);
  const [loading, setLoading] = useState(false);
  const [shows, setShows] = useState(5);

  const getWidth = () => window.innerWidth 
  || document.documentElement.clientWidth 
  || document.body.clientWidth;

  let [width, setWidth] = useState(getWidth());

  useEffect(() => {
    let timeoutId: any = null;
    const resizeListener = () => {
      // prevent execution of previous setTimeout
      clearTimeout(timeoutId);
      // change width from the state object after 150 milliseconds
      timeoutId = setTimeout(() => setWidth(getWidth()), 150);
    };
    // set resize listener
    window.addEventListener('resize', resizeListener);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

  useEffect(() => {
    if (width < 1600) {
      setShows(4);
    }
    if (width < 1400) {
      setShows(3);
    }
    if (width < 1064) {
      setShows(2);
    }
    if (width < 670) {
      setShows(1);
    }
  }, [width]);

  useEffect(() => {
    let pageNumber = 1;
    if (type === 'hot') {
      pageNumber = pageNum.hot;
    }

    const loadCollections = async () => {
      setLoading(true);
      let data = await CollectionController.getList(type, pageNumber);
      if (data.pages) {
        if (pageNum.hot === 1) {
          pages.hot = data.pages;
        }
        setCollections(pageNum.hot === 1 ? data.collections : collectionList.concat(data.collections));
      }
      setPages(pages);
      setLoading(false);
    }

    loadCollections();
  }, [type, pageNum]);

  const getGroup = () => {
    if (collectionList && collectionList.length > 0) {
      let groups = [];
      var i = 0;
      while (i < collectionList.length) {
        groups.push(collectionList.slice(i, i += shows));
      }
      return groups;
    }
    return [];
  }

  return (
    <FlexSlideContainer className="slide-container" id={`slider_${type}`}>
      {loading ? (
        <div className="d-flex my-4 justify-content-center w-100">
          <LoadingBar />
        </div>
        ) : (
          <>
            {
              collectionList.length === 0 ? (
                <NoItem
                  title="No Collections found"
                  description="Come back soon! Or try to browse something for you on our marketplace"
                  btnLink="/"
                  btnLabel="Browse marketplace"
                />
              ) : (
                <Carousel className="w-100">
                  {
                    getGroup() && getGroup().length > 0 && getGroup().map((group, idx) => (
                      <Carousel.Item key={idx}>
                        <div className="w-100 d-flex flex-nowrap">
                          {group.map((collection, index) => (
                            <CollectionItem item={collection} key={index} />
                          ))}
                        </div>
                      </Carousel.Item>
                    ))
                  }
                </Carousel>
              )
            }
          </>
        )
      }
    </FlexSlideContainer>
  );
};

export default Collections;