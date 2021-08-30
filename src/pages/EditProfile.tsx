import React, { useRef } from "react";
import metamask from "assets/imgs/meta-logo.png";
import { Image, Button, Form, Container } from "react-bootstrap";
import account_data from "assets/account_data";
import Layout from "components/Layout";

interface EditProfileProps { }

const EditProfile: React.FC<EditProfileProps> = () => {
    const layoutView = useRef(null);
    const prefix = "nft.puml.io"
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
                                <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="Enter user name" />
                            </div>
                            <div className="pb-2">
                                <div className="text-black pb-1">Custom Url</div>
                                <div className="d-flex flex-row align-items-center">
                                    <div className="input-group-prepend">
                                        <span className="input-group-text" id="basic-addon3">nft.puml.io</span>
                                    </div>
                                    <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="Enter short url" />
                                </div>
                            </div>

                            <div className="pb-2">
                                <div className="mb-3 pb-3 pt-3">
                                    <div className="text-black pb-1">Email</div>
                                    <input type="text" className="form-control" id="basic-url" aria-describedby="basic-addon3" placeholder="Your email for marketplace notifications" />
                                </div>
                                <Button variant="primary" type="submit">
                                    Save Updates
                                </Button>
                            </div>
                        </div>
                        <div className="col-12 col-md-6">
                            <div className="d-flex flex-column align-items-center edit-detail">
                                <Image src={account_data.img} alt="logo"></Image>
                                <div className="mail pt-3">Daniel@gmail.com</div>
                                <div className="desc pt-3 pb-3">This is your PUML profile, other users will see this. </div>
                                <Button className="btn-primary pt-3">Upload Photo</Button>
                                <div className="filetype pt-3">PNG, GIF, MP4 or MP3, Max 30mb</div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default EditProfile;