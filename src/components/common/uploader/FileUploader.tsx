/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Utility from "service/utility";
import { B2NormalTextTitle } from "../common.styles";
import { FaWindowClose } from "react-icons/fa";

interface FileUploaderProps {
  title: any;
  setFile: any;
  setPreview?: any;
  accept?: any;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  title,
  setFile,
  setPreview,
  accept,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [filePreview, setFilePreview] = useState<any>(null);
  const [fileAccept] = useState(
    accept || "audio/*,video/*,image/*"
  );
  const [isImage, setIsImage] = useState(true);

  const fileChanged = (e: any) => {
    const file = e.target.files[0];
    setFile(file);

    var reader = new FileReader();
    reader.addEventListener(
      "load",
      () => {
        if (setPreview) setPreview(reader.result || "");
        setFilePreview(reader.result || "");
      },
      false
    );
    
    let isImg = Utility.isFileImage(file);
    setIsImage(isImg);

    if (isImg) {
      reader.readAsDataURL(file);
    } else {
      setFilePreview(URL.createObjectURL(file));
      videoRef?.current?.load();
    }
  };

  const openFileDialog = () => {
    fileInputRef?.current?.click();
  };

  const initFile = () => {
    setFile(null);
    setFilePreview(null);
    setIsImage(true);
    if (setPreview) setPreview("");
    let fInputElement = fileInputRef?.current;
    if(fInputElement) fInputElement.value = '';
  };

  useEffect(() => {
    initFile();
  }, []);

  return (
    <div className="file-uploader py-4 px-5">
      {!filePreview ? (
        <>
          <B2NormalTextTitle>{title}</B2NormalTextTitle>
          <Button
            variant="primary"
            className="mt-3 btn-primary"
            onClick={() => {
              openFileDialog();
            }}
          >
            <span>Choose File</span>
          </Button>
        </>
      ) : (
        <div className="preview">
          {isImage ? (
            <img src={filePreview} alt="previewImage" />
          ) : ( 
            <video width="340" src={filePreview} autoPlay loop controls  ref={videoRef}>
              <source  type="video/mp4"></source>
              <source  type="video/webm"></source>
              <source  type="video/ogg"></source>
              Your browser does not support HTML5 video.
            </video>
          )}
          <div className="close-btn" onClick={() => initFile()}>
            <FaWindowClose></FaWindowClose>
          </div>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        hidden
        accept={fileAccept}
        onChange={fileChanged}
      />
    </div>
  );
};

export default FileUploader;
