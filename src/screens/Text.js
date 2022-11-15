import { Col, Container, Row,Form } from "react-bootstrap";
import apis from '../services/index'
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from 'web3modal';
import {uploadFile} from '../services/IPFS'

function Text(){

    const [imageURL, setImageURL] = useState()
    const [tilte, setTilte] = useState('')

    const {
        connector,
        library,
        account,
        chainId,
        activate,
        deactivate,
        active,
        error,
      } = useWeb3React();

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
        let message = "Adding Text";
        let s = await signer.signMessage(message);
        return s;
      };


      const update = async ()=>{
        try {
            let signature = await sig();
            const response = await apis.updateText(1,{tilte: tilte , signature})
            alert("uploaded")
        } catch (error) {
            const message = error?.response?.data?.error || error?.message;
            alert(message);
            console.log(error)
        }
      }



    return <>
            <Container fluid className="main-height display-flex-main">
                        <form className="custom-form">
                            <h5 class="section-title">Text</h5>
                            <Form.Group className="mb-3" controlId="img">
                                <Form.Label>Enter Start Date</Form.Label>
                                <Form.Control type="text" required onChange={(e)=>setTilte(e.target.value)} />
                            </Form.Group>
                            <div className="mt-4">
                            <button className="btn secondary-btn" type="button" onClick={update}>
                                Submit
                            </button>
                            </div>
                        </form>
            </Container>
    </>
}
export default Text;
