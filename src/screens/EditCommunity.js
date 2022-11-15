import {useCallback, useEffect, useRef, useState} from "react";
import {Col, Container, Form, Row, Table} from "react-bootstrap";
import {create as ipfsHttpClient} from 'ipfs-http-client';
import apis from "../services";
import {useParams} from "react-router-dom";
import {uploadFile} from '../services/IPFS'

import { ethers } from "ethers";
import Web3Modal from "web3modal";

const INITIAL_FORM_STATE = {
    title: '',
    description: '',
    vote_type: 'NFT',
    closing_date: '',
    options: {yes: 0, no: 0}
}

function EditCommunity() {
    const {id} = useParams()
    const inputFileRef = useRef(null);
    const [images, setImages] = useState([]);
    const [imagesURL, setImagesURL] = useState([]);

    const [proposals, setProposals] = useState([]);
    const [update , setUpdate] = useState(0)
    const [formData, setFormData] = useState(INITIAL_FORM_STATE);
    const [isUploading, setUploading] = useState(false);
    const [_date, setDate] = useState("");

    const onChangeHandler = (e) => {
        const {id, value} = e.target;
        setFormData(prevState => ({...prevState, [id]: value}))
    }

    const loadProvider = async () => {
        try {
          const web3Modal = new Web3Modal();
          const connection = await web3Modal.connect();
          const provider = new ethers.providers.Web3Provider(connection);
          return provider.getSigner();
        } catch (e) {
          console.log("loadProvider default: ", e);
        }
      };

    const sig = async () => {
        let signer = await loadProvider();
        let message = "Updating Stroke";
        let s = await signer.signMessage(message);
        return s;
      };

      const sigV1 = async () => {
        let signer = await loadProvider();
        let message = "Add the proposal";
        let s = await signer.signMessage(message);
        return s;
      };

    // const projectId = '1qmt...XXX';   // <---------- your Infura Project ID

    // const projectSecret = 'c920...XXX';  // <---------- your Infura Secret
    // // (for security concerns, consider saving these values in .env files)

    // const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

    // const client = ipfsClient.create({
    //     host: 'ipfs.infura.io',
    //     port: 5001,
    //     protocol: 'https',
    //     headers: {
    //         authorization: auth,
    //     },
    // });

    const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0');


    const fetchAllProposals = useCallback(
        async () => {
            try {
                const response = await apis.getProposalsByStroke(id)
                console.log('&&&&&',response);
                if (response.statusText === 'OK') {
                    console.log(response.data);
                    setProposals(response.data)
                }
            } catch (e) {
                console.error(e.message)
            }
        },
        [],
    );


    useEffect(() => {
        (async () => {
            await fetchAllProposals()
        })()
    }, []);


    const handleUploadImage = async (e) => {
        e.preventDefault();
        if (images.length >= 24) {
            alert('the Maximum limit for upload images is 24')
        } else if (images.length % 3 === 0) {
            setUploading(true);
            for (const image of images) {
                const path = await uploadFile(image);

                setImagesURL(prevState => {
                    if (prevState.length === 0) {
                        return [path];
                    } else {
                        return [...prevState, path]
                    }
                })
            }
            setUploading(false);
            setImages([]);
            inputFileRef.current.value = '';
        } else {
            alert('Please upload files multiple of 3')
        }
    }


    const handleImage = (e) => {
        const {files} = e.target;

        setImages(prevState => {
            let updatedImages;
            if (prevState.length === 0) {
                updatedImages = [...Object.values(files)];
            } else {
                updatedImages = [...prevState, ...Object.values(files)];
            }
            return updatedImages;
        });
    };

    const handleRemoveImage = (name) => {
        const filteredImages = images.filter(image => image.name !== name);
        setImages(filteredImages);
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        let proposal_ids = []
        if (imagesURL.length > 0 && imagesURL.length % 3 === 0) {
            let signature = await sigV1();
            for (const imageURL of imagesURL) {
                const record = {...formData, image: imageURL , signature};
                //const record = {...formData, image: imageURL , signature , closing_date: };
                record.closing_date = record.closing_date + 'T13:00:00+00:00'
                try {
                    let resposnse = await apis.addProposal(record);
                    console.log("resposnses", resposnse.data)
                    proposal_ids.push(resposnse.data.id)
                }catch (e) {
                    console.log('ERROR',e);
                }
            }
            let _signature = await sig();
            try {
                await apis.updateStroke(id, {proposal_ids: Object.assign([], proposal_ids),signature : _signature})
                await fetchAllProposals();
                setFormData(INITIAL_FORM_STATE);
                setImagesURL([]);
            }catch (e) {
                const message = e?.response?.data?.error || e?.message;
                alert(message);
                console.log(e.response);
            }
        } else {
            alert('Please upload images first')
        }


    }

    return <>
        <Container fluid className="main-height">
            <section className="page-margin-top ">
                <Row>
                    <Col lg={6}>
                        <Form className="community-form" onSubmit={submitHandler}>
                            <h5 className="section-title">Edit Community</h5>
                            <Form.Group className="mb-3 mt-3">
                                <Form.Label>Title</Form.Label>
                                <Form.Control id='title' type="text" placeholder="Title"
                                              onChange={onChangeHandler} value={formData.title}
                                              required/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control as="textarea" rows={4} type="text"
                                              id="description"
                                              value={formData.description}
                                              placeholder="Description"
                                              onChange={onChangeHandler} required/>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Closing Date</Form.Label>
                                <Form.Control type="date"
                                              id="closing_date"
                                              value={formData.closing_date}
                                              placeholder="Closing Date"
                                              onChange={onChangeHandler} required/>
                            </Form.Group>
                            <Form.Group className="mt-4">
                                <button className='custom-btn secondary-btn' type='submit'>Update</button>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col lg={6}>
                        <Form className="community-form">
                            <h5 className="section-title">Images</h5>
                            <Form.Group className="mb-3 mt-3" controlId="whitelist" required>
                                <Form.Label>Upload Images</Form.Label>
                                <Form.Control type="file" multiple onChange={handleImage} ref={inputFileRef} required/>
                                {/*<Form.Text className="text-muted">*/}
                                {/*Note: upload picture.*/}
                                {/*</Form.Text>*/}
                                <Form.Text className="text-muted">
                                    {images.map(({name}, idx) => {
                                        return <p key={idx}>{name} <span
                                            onClick={() => handleRemoveImage(name)}>X</span>
                                        </p>
                                    })}
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className="mt-4">
                                <button className='custom-btn secondary-btn' disabled={isUploading}
                                        onClick={handleUploadImage}> {isUploading ? 'Uploading' : 'Upload'} </button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <Row className="mt-4">
                    <h5 className="section-title">List Rounds</h5>
                    <Col lg={12}>
                        <Table striped>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Closing Date</th>
                                <th>Images</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                proposals.map((record, idx) => (<tr key={idx}>
                                    <td>{idx + 1}</td>
                                    <td>{record?.title}</td>
                                    <td>{record?.description}</td>
                                    <td>{new Date(record?.closing_date).toLocaleDateString("en-US")}</td>
                                    <td>
                                        {record?.images?.length && record?.images.map((image) => <span>{image},</span>)}
                                    </td>
                                </tr>))
                            }
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </section>
        </Container>
    </>
}

export default EditCommunity;
