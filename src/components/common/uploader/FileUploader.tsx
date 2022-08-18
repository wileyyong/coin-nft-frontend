/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Utility from "service/utility";
import { B2NormalTextTitle } from "../common.styles";
import { FaWindowClose } from "react-icons/fa";
import { NotificationManager } from "react-notifications";
import { toast } from "react-toastify";
import axios from "axios";
import configs from "configs";

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
  accept
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [filePreview, setFilePreview] = useState<any>(null);
  const [fileAccept] = useState(accept || "audio/*,video/*,image/*");
  const [isImage, setIsImage] = useState(true);

  const fileChanged = (e: any) => {
    const file = e.target.files[0];

    var reader = new FileReader();
    const image = new Image();
    reader.addEventListener(
      "load",
      () => {
        if (typeof reader.result === "string") {
          image.src = reader.result;
        }
      },
      false
    );

    let data = new FormData();
    data.append("file", file);

    image.onload = async function () {
      const width = image.width;
      const height = image.height;
      const ratio = width / height;

      if (width >= 320 && width <= 1080 && ratio >= 0.8 && ratio <= 1.91) {
        axios
          .post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
            headers: {
              "Content-Type": `multipart/form-data`,
              pinata_api_key: configs.PINATA_API_KEY,
              pinata_secret_api_key: configs.PINATA_SECRET_API_KEY
            }
          })
          .then(function (response) {
            if (response && response.data && response.data.IpfsHash) {
              const imgURL =
                configs.PINATA_GATEWAY + "/ipfs/" + response.data.IpfsHash;
              setFilePreview(imgURL);
              if (setPreview) {
                setPreview(imgURL);
              }
              setFile(imgURL);
            }
          })
          .catch(function (error) {
            console.log("err", error);
          });
      } else {
        NotificationManager.error("Please upload proper image", "Error");
        toast.warning("Please upload proper image");
      }
    };

    let isImg = Utility.isFileImage(file);
    setIsImage(isImg);

    if (isImg) {
      reader.readAsDataURL(file);
    } else {
      axios
        .post("https://api.pinata.cloud/pinning/pinFileToIPFS", data, {
          headers: {
            "Content-Type": `multipart/form-data`,
            pinata_api_key: configs.PINATA_API_KEY,
            pinata_secret_api_key: configs.PINATA_SECRET_API_KEY
          }
        })
        .then(function (response) {
          if (response && response.data && response.data.IpfsHash) {
            const mediaURL =
              configs.PINATA_GATEWAY + "/ipfs/" + response.data.IpfsHash;

            setFile(mediaURL);
          }
        })
        .catch(function (error) {
          console.log("err", error);
        });
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
    if (fInputElement) fInputElement.value = "";
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
            <video
              width="340"
              src={filePreview}
              autoPlay
              loop
              controls
              ref={videoRef}
            >
              <source type="video/mp4"></source>
              <source type="video/webm"></source>
              <source type="video/ogg"></source>
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
