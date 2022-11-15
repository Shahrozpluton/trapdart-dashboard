import { Col, Container, Row,Form } from "react-bootstrap";


import {crowdsale_addr} from "../contract/addresses"
import CrowdsaleABI from "../contract/Crowdsale.json"


import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import Web3Modal from 'web3modal'


function Sale(){


    const {
        connector,
        library,
        account,
        chainId,
        activate,
        deactivate,
        active,
        errorWeb3Modal
    } = useWeb3React();
    
    //_currentRound
    const [currentRound , setCurrentRound] = useState("")


    const loadProvider = async () => {
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.providers.Web3Provider(connection);
            return provider.getSigner();
        }
        catch (e) {
            console.log("loadProvider: ", e)
            
        }
    }

    const startNextRound = async () => {
        try {

            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(crowdsale_addr, CrowdsaleABI, signer);
            let start = await NFTCrowdsaleContract.startNextRound()

        } catch (e) {
            console.log("data", e)
        }
    }

    const _currentRound = async () => {
        try {

            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(crowdsale_addr, CrowdsaleABI, signer);
            let start = await NFTCrowdsaleContract._currentRound()
            setCurrentRound(start.toString())

        } catch (e) {
            setCurrentRound('0')
            console.log("data", e)
        }
    }


    useEffect(()=>{
        (async ()=>{
          if(library && account){
            try {
               await _currentRound()
            }
            catch(error){
        
            }
            return () => {
            };
          }
        })();
      }, [library, account, chainId]);

    return <>
            <Container fluid className="main-height display-flex-main">
                <h3>Current Round</h3>
                <h3>{currentRound}</h3>
                        <form className="custom-form">
                            <h5 class="section-title">Sale</h5>
                            <Form.Group className="mb-3" controlId="whitelist">
                                <label for="sale_type">Sale Type</label>
                                <select className="form-control" id="sale_type">
                                    <option value="">Token</option>
                                    {/* <option value="">NFT</option> */}
                                    {/* <option value="">Art Gallery</option> */}
                                </select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="whitelist">
                                <label for="type">Type</label>
                                <select className="form-control" id="type">
                                    <option value="">Start</option>
                                    {/* <option value="">Stop</option> */}
                                </select>
                            </Form.Group>
                            <div className="mt-4">
                            <button className="btn secondary-btn" type="button" onClick={startNextRound}> 
                                Submit
                            </button>
                            </div>
                        </form>
            </Container>
    </>
}
export default Sale;