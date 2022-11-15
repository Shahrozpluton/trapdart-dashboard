import { Col, Container, Row,Form } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from 'web3modal';

import {crowdsale_addr} from "../contract/addresses"
import CrowdsaleABI from "../contract/Crowdsale.json"

import readXlsxFile from 'read-excel-file'

function Home(){

    const [addresses, setAddresses] = useState()

    const {
        connector,
        library,
        account,
        chainId,
        activate,
        deactivate,
        active,
        errorWeb3Modal,
        active: networkActive, error: networkError, activate: activateNetwork
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

  
    
   


    const handleChangeImage = e => {
        let _address = []
        if(e.target.files[0]){
            
            let temp = []
            readXlsxFile(e.target.files[0]).then((rows) => {
                rows.forEach(element => {
                    let address = ethers.utils.getAddress(element[0])
                    _address.push(address)
                });
              })
           
        }
        console.log("add",addresses)
        setAddresses(_address)

     }

     const upload = async () =>{
         try {
            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(crowdsale_addr, CrowdsaleABI, signer)
            let tx = await NFTCrowdsaleContract.addWhitelist(addresses)
            await tx.wait()
         } catch (error) {
             console.log("whitelist",error)
         }
     }

    return <>
            <Container fluid className="main-height display-flex-main">
                        <form className="custom-form">
                            <h5 class="section-title">Whitelist</h5>
                            <Form.Group className="mb-3" controlId="whitelist">
                                <Form.Label>Upload Whitelist</Form.Label>
                                <Form.Control type="file" onChange={(e)=>handleChangeImage(e)}/>
                                <Form.Text className="text-muted">
                                Note: upload .xlsx file only.
                                </Form.Text>
                            </Form.Group>
                            <div className="mt-4">
                            <button className="btn secondary-btn" type="button" onClick={upload}>
                                Submit
                            </button>
                            </div>
                        </form>
            </Container>
    </>
}
export default Home;