/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

interface ReadMoreProps {
  text: String;
  maxChars: number;
}

const ReadMore: React.FC<ReadMoreProps> = ({text, maxChars}) => {
  const [isReadMore, setIsReadMore] = useState(false);
  const formattedString = () => {
    var val_container = text;
    if(!isReadMore && text && text.length > maxChars){
      val_container = val_container.substring(0, maxChars) + '...';
    }
    return(val_container);
  }

  const triggerReadMore = (b: boolean) => {
    setIsReadMore(b);
  }

  useEffect(() => {
    if (isReadMore) {
      formattedString();
    }
  }, [isReadMore]);

  return (
    <div className="mt-4">
      <p>
        {formattedString()}
        {
          text && text.length > maxChars && (
            <span className="primary-color pointer-cursor ml-2">
              {
                isReadMore ? (
                  <span onClick={() => triggerReadMore(false)}>View Less</span>
                ) : (
                  <span onClick={() => triggerReadMore(true)}>Read More</span>
                )
              }
            </span>
          )
        }
      </p>
    </div>
  );
};

export default ReadMore;