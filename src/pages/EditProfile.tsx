import React, { useRef, useState, useEffect } from "react";
import metamask from "assets/imgs/meta-logo.png";
import { Image, Button, Container, Form } from "react-bootstrap";
import account_data from "assets/account_data";
import Layout from "components/Layout";
import UserController from "controller/UserController";
import imageAvatar from "assets/imgs/avatar.png";

import configs from "configs";
import { NotificationManager } from "react-notifications";
import { useAppSelector, useAppDispatch } from "store/hooks";
import { getMyInfo } from "store/User/user.slice";
import Utility from "service/utility";
import { getWalletAddress } from "store/User/user.selector";
import AvatarUploader from "components/common/uploader/AvatarUploader";

interface EditProfileProps { }

const EditProfile: React.FC<EditProfileProps> = () => {
    const layoutView = useRef(null);

    const dispatch = useAppDispatch();
    const walletAddress = useAppSelector(getWalletAddress);
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [link, setLink] = useState('');
    const [verified, setVerified] = useState(false);
    const [avatarImage, setAvatar] = useState<any>(null);
    const [uploadImage, setUploadImage] = useState<any>(null);

    useEffect(() => {
        const loadActivities = async () => {
            let data = await UserController.getSettings();
            if (data.name) {
                setDisplayName(data.name);
            }
            if (data.email) {
                setEmail(data.email);
            }
            if (data.avatar) {
                setUploadImage(`${configs.DEPLOY_URL}${data.avatar}`);
            }
            if (data.link) {
                setLink(data.link);
            }
            if (data.verified) {
                setVerified(data.verified);
            }
        }
        loadActivities();
    }, []);

    const setAvatarFile = (file: any) => {
        if (file) {
            setAvatar(file);
        }
    }

    const setPreviewFile = (image: any) => {
        if (image) {
            setUploadImage(image);
        }
    }

    const onSaveSettings = async () => {
        let setting = {
            name: displayName,
            email,
            avatar: avatarImage,
            link,
            verified
        };

        if (!displayName) {
            NotificationManager.error(
                "Display name is required!",
                "Error"
            );
            return;
        }

        var emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailPattern.test(email)) {
            NotificationManager.error(
                'Considered as not valid email',
                'Error'
            );
            return;
        }

        let formdata = setting.avatar ? Utility.getFormDataFromObject(setting) : setting;
        await UserController.userSettings(formdata).then((res) => {
            if (res && res.status === 200) {
                NotificationManager.success(
                    'Profile Successfully updated!',
                    "Success"
                )
                dispatch(getMyInfo(walletAddress))
            }
        }).catch((err) => {
            if (err.response && err.response.data && err.response.data.error) {
                NotificationManager.error(
                    err.response.data.error,
                    'Error'
                );
            }
        });
    }

    const onVerify = async () => {
        let res = await UserController.getVerify();
        if (res && res.status === 200) {
            NotificationManager.success(
                'Successfully verified!',
                'Success'
            );
            setVerified(true);
        }
    }

    return (
        <Layout ref={layoutView}>
            <Container className="editprofile-container">
                <div className="d-flex flex-row align-items-center justify-content-between">
                    <div className="header">Edit Profile</div>
                    <div className="d-flex flex-row align-items-center connect-wallet">
                        <div className="text-secondary pr-2">Connected to Meta Mask</div>
                        <Image src={metamask} alt="Meta Mask"></Image>
                    </div>
                </div>
                <div className="description pt-4">Custom-made characters that will transition to the assets expanded ecosystem (media, content, and games)</div>
                <div className="edit-profile">
                    <div className="row">
                        <div className="col-12 col-md-6">
                            <div className="mb-3 mt-3 pb-2 pt-3">
                                <div className="text-black pb-1">PUML Username</div>
                                <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="Enter user name" value={displayName} onChange={e => setDisplayName(e.target.value)} />
                            </div>
                            <div className="pb-2">
                                <div className="text-black pb-1">Custom Url</div>
                                <div className="d-flex flex-row align-items-center">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon3">nft.puml.io</span>
                                    </div>
                                    <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="Enter short url" value={link} onChange={e => setLink(e.target.value)} />
                                </div>
                            </div>

                            <div className="pb-2">
                                <div className="mb-3 pb-3 pt-3">
                                    <div className="text-black pb-1">Email</div>
                                    <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="Your email for marketplace notifications" value={email} onChange={e => setEmail(e.target.value)} />
                                </div>
                                <Button variant="primary" type="submit" onClick={() => onSaveSettings()}>
                                    Save Updates
                                </Button>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="avatar-uploader">
                                <div className="avatar-preview">
                                    <Image src={uploadImage || imageAvatar} alt="avatar-preview" />
                                </div>
                                <AvatarUploader
                                    email={email}
                                    accept={configs.IMG_FILE_ACCEPT}
                                    setFile={(e: any) => setAvatarFile(e)}
                                    setPreview={(e: any) => setPreviewFile(e)}
                                />
                            </div>

                            {/* <div className="d-flex flex-column align-items-center edit-detail">
                                <Image src={account_data.img} alt="logo"></Image>
                                <div className="mail pt-3">Daniel@gmail.com</div>
                                <div className="desc pt-3 pb-3">This is your PUML profile, other users will see this. </div>
                                <Button className="btn-primary pt-3">Upload Photo</Button>
                                <div className="filetype pt-3">PNG, GIF, MP4 or MP3, Max 30mb</div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default EditProfile;