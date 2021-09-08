/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import Utility from "service/utility";
import { B2NormalTextTitle } from "../common.styles";
import { FaWindowClose } from "react-icons/fa";

interface AvatarUploaderProps {
    email: any;
    setFile: any;
    setPreview?: any;
    accept?: any;
}

const AvatarUploader: React.FC<AvatarUploaderProps> = ({
    email,
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
        if (fInputElement) fInputElement.value = '';
    };

    useEffect(() => {
        initFile();
    }, []);

    return (
        <div className="file-uploader pb-4 px-5">
            <>
                <div className="email">{email.length > 0 ? email : 'User email is not defined.'}</div>
                <div className="title pt-3">This is your PUML profile, other users will see this. </div>
                <Button
                    variant="primary"
                    className="mt-3 btn-primary"
                    onClick={() => {
                        openFileDialog();
                    }}
                >
                    <span>Choose File</span>
                </Button>
                <div className="file-type pt-3">PNG, GIF, MP4 or MP3, Max 30mb</div>
            </>
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

export default AvatarUploader;
