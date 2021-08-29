import React, { useRef } from "react";
import metamask from "assets/imgs/meta-logo.png";
import { Image, Button, Form, Container } from "react-bootstrap";
import account_data from "assets/account_data";
import Layout from "components/Layout";

interface EditProfileProps { }

const EditProfile: React.FC<EditProfileProps> = () => {
    const layoutView = useRef(null);
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
                <div className="d-flex edit-profile">
                    <div className="d-flex flex-column edit-form">
                        <Form>
                            <Form.Group className="mb-3 mt-3 pb-3 pt-3" controlId="formBasicUserName">
                                <Form.Label className="text-black">PUML Username</Form.Label>
                                <Form.Control type="text" placeholder="Enter user name" />
                            </Form.Group>

                            <Form.Group className="mb-3 pb-3 pt-3" controlId="formBasicUrl">
                                <Form.Label className="text-black">Custom URL</Form.Label>
                                <Form.Control type="text" placeholder="Enter short url" />
                            </Form.Group>
                            <Form.Group className="mb-3 pb-3 pt-3" controlId="formBasicEmail">
                                <Form.Label className="text-black">Email</Form.Label>
                                <Form.Control type="text" placeholder="Your email for marketplace notifications" />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Save Updates
                            </Button>
                        </Form>
                    </div>
                    <div className="d-flex flex-column align-items-center edit-detail">
                        <Image src={account_data.img} alt="logo"></Image>
                        <div className="mail pt-3">Daniel@gmail.com</div>
                        <div className="desc pt-3 pb-3">This is your PUML profile, other users will see this. </div>
                        <Button className="btn-primary pt-3">Upload Photo</Button>
                        <div className="filetype pt-3">PNG, GIF, MP4 or MP3, Max 30mb</div>
                    </div>
                </div>
            </Container>
        </Layout>
    );
}

export default EditProfile;