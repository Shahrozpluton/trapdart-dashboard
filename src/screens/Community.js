import {useEffect, useState} from "react";
import {Col, Container, Row, Table} from "react-bootstrap";
import {Link} from "react-router-dom";
import CommunityModal from "../components/CommunityModal";
import apis from "../services";

import { ethers } from "ethers";
import Web3Modal from "web3modal";

const RECORDS = [
    {id: 1, title: 'Stroke 1', description: 'Voting Open until 13:00 UTC 8th Jan 2023'},
    {id: 2, title: 'Stroke 2', description: 'Voting Open until 13:00 UTC 8th Jan 2023'},
    {id: 3, title: 'Stroke 3', description: 'Voting Open until 13:00 UTC 8th Jan 2023'},
]

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

function Community() {
    const [show, setShow] = useState(false);
    const [strokes, setStrokes] = useState([]);
    const [update , setUpdate] = useState(0)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        (async () => {
            try {
                const response = await apis.getAllStrokes()
                console.log(response)
                if (response.status !== 200) return console.log('invalid response');
                const {data} = response;
                console.log(data);
                setStrokes(data);
            } catch (e) {
                console.error(e.message)
            }
        })()
    }, [update]);

    const sig = async () => {
        let signer = await loadProvider();
        let message = "Adding Stroke";
        let s = await signer.signMessage(message);
        return s;
      };

    const add = async ()=>{
        try {

           let signature = await sig();
           const response = await apis.createStroke({
            signature:signature
           })
           console.log(response)
           setUpdate(update+1)
           alert("stroke created")
        } catch (error) {
            const message = error?.response?.data?.error || error?.message;
            alert(message);
            // alert("stroke creation error")
            console.log(error)
        }
    }


    return <>
        <Container fluid className="main-height">
            <section className="page-margin-top ">
                <div className="how-it-work">
                    <h5 className="section-title">Community</h5>
                    {/*<button className="custom-btn secondary-btn" onClick={handleShow}>Add New</button>*/}
                </div>
                <button onClick={add}>Add</button>
                <Row className="mt-4">
                    <Col lg={12}>
                        <Table striped>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {strokes.map(({id} , i) => (<tr key={id}>
                                <td>{i+1}</td>
                                <td> Stroke {id}</td>
                                <td>
                                    <Link to={`/edit-community/${id}`}
                                          className="custom-btn secondary-btn text-dark">View</Link>
                                </td>
                            </tr>))}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </section>
            <CommunityModal show={show} handleClose={handleClose}/>
        </Container>
    </>
}

export default Community;
