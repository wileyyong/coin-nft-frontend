import React, { useState } from "react";
import { NotificationManager } from "react-notifications";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import { B1NormalTextTitle, BigTitle } from "../common/common.styles";
import FileUploader from "../common/uploader/FileUploader";
import configs from "configs";

interface CreateCollectionModalProps {
  handleClose?: any;
  show: boolean;
  createCollection: any;
}

const CreateCollectionModal: React.FC<CreateCollectionModalProps> = ({
  show,
  handleClose,
  createCollection
}) => {
  const [validated, setValidated] = useState(false);
  const [collection, setCollection] = useState({
    image: null,
    short: "",
    description: "",
    symbol: "",
    name: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity() !== false) {
      if(!collection.image) {
        NotificationManager.error("No Image File!", "Error");
        return;
      }
      createCollection(collection);
    }
    setValidated(true);
  };

  const handleChange = (e: any) => {
    let fieldName = e.target.name;
    let fleldVal = e.target.value;
    setCollection({...collection, [fieldName]: fleldVal});
  }

  return (
    <Modal show={show} onHide={handleClose} className="create-collection-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <BigTitle>Collection</BigTitle>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
              <FileUploader
                title="We recommend an image of at least 400x400. Max 30MB. Gifs work too."
                accept={configs.IMG_FILE_ACCEPT}
                setFile={(e: any) => {
                  setCollection({ ...collection, image: e });
                }}
              ></FileUploader>
              <Form.Row className="mt-4">
                <Form.Group as={Col} md="12">
                  <Form.Label>
                    <BigTitle>
                      Display Name{" "}
                      <span className="text-gray">(Required)</span>
                    </BigTitle>
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter collection name"
                    name="name"
                    onChange={(e)=>handleChange(e)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please input valid name
                  </Form.Control.Feedback>
                  <B1NormalTextTitle className="mt-2 text-gray">
                    Collection name cannot be changed in future
                  </B1NormalTextTitle>
                </Form.Group>
              </Form.Row>
              <Form.Row className="mt-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>
                    <BigTitle>
                      Symbol{" "}
                      <span className="text-gray">(Required)</span>
                    </BigTitle>
                  </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter collection symbol"
                    name="symbol"
                    onChange={(e)=>handleChange(e)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please input valid symbol
                  </Form.Control.Feedback>
                </Form.Group>
              </Form.Row>
              <Form.Row className="mt-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>
                    <BigTitle>
                      Description{" "}
                      <span className="text-gray">(Optional)</span>
                    </BigTitle>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Spread some words about your collection"
                    name="description"
                    onChange={(e)=>handleChange(e)}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Row className="mt-3">
                <Form.Group as={Col} md="12">
                  <Form.Label>
                    <BigTitle>Short url</BigTitle>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter short url"
                    name="short"
                    onChange={(e)=>handleChange(e)}
                  />
                  <B1NormalTextTitle className="mt-2 text-gray">
                    Will be used as public URL
                  </B1NormalTextTitle>
                </Form.Group>
              </Form.Row>
              <Button
                type="submit"
                variant="primary"
                className="full-width mt-4 outline-btn"
              >
                <span>Create collection</span>
              </Button>
            </Form>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCollectionModal;
