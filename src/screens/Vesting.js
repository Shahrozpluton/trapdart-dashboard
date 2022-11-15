import { Col, Container, Row,Form } from "react-bootstrap";


import {Vesting_dev_addr , Vesting_founder_addr , Vesting_treasury_addr} from "../contract/addresses"
import CrowdsaleABI from "../contract/Vesting_dev.json"


import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";

import Web3Modal from 'web3modal'

const Vesting = () => {

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

    const [totalVestedD,setTotalVestedD] = useState('0')
    const [totalVestedF , setTotalVestedF] = useState('0')
    const [totalVestedT , setTotalVestedT] = useState('0')

    const [totalReleasedD , setTotalReleasedD] = useState('0')
    const [totalReleasedF , setTotalReleasedF] = useState('0')
    const [totalReleasedT , setTotalReleasedT] = useState('0')

    const [totalClaimableD , setTotalClaimableD] = useState('0')
    const [totalClaimableF , setTotalClaimableF] = useState('0')
    const [totalClaimableT , setTotalClaimableT] = useState('0')

    useEffect(()=>{
        (async ()=>{
          if(library && account){
            try {
               await getDetails()
            }
            catch(error){
        
            }
            return () => {
            };
          }
        })();
      }, [library, account, chainId]);

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

    const getDetails = async () => {
        try {
            let signer = await loadProvider()
            let devContract = new ethers.Contract(Vesting_dev_addr, CrowdsaleABI, signer);
            let fonContract = new ethers.Contract(Vesting_founder_addr, CrowdsaleABI, signer);
            let treContract = new ethers.Contract(Vesting_treasury_addr, CrowdsaleABI, signer);
            let daccount = await devContract._idToAddress(1)
            let faccount = await fonContract._idToAddress(1)
            let taccount = await treContract._idToAddress(1)

            let dtotal = await devContract.totalVested()
            let ftotal = await fonContract.totalVested()
            let ttotal = await treContract.totalVested()

            console.log(dtotal.toString())

            setTotalVestedD(ethers.utils.formatEther(dtotal.toString()))
            setTotalVestedF(ethers.utils.formatEther(ftotal.toString()))
            setTotalVestedT(ethers.utils.formatEther(ttotal.toString()))


            let dreleased = await devContract.released(daccount)
            let freleased = await fonContract.released(faccount)
            let treleased = await treContract.released(taccount)

            setTotalReleasedD(ethers.utils.formatEther(dreleased.toString()))
            setTotalReleasedF(ethers.utils.formatEther(freleased.toString()))
            setTotalReleasedT(ethers.utils.formatEther(treleased.toString()))

            let dclaimable = await devContract._pending(daccount)
            let fclaimable = await fonContract._pending(faccount)
            let tclaimable = await treContract._pending(taccount)

            setTotalClaimableD(ethers.utils.formatEther(dclaimable.toString()))
            setTotalClaimableF(ethers.utils.formatEther(fclaimable.toString()))
            setTotalClaimableT(ethers.utils.formatEther(tclaimable.toString()))


            
        } catch (error) {
            console.log(error)
        }
    }

    const release_dev = async () => {
        try {

            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(Vesting_dev_addr, CrowdsaleABI, signer);
            let start = await NFTCrowdsaleContract.release(account)
            await start.wait()
            alert("released")

        } catch (e) {
            console.log("data", e)
            alert(e.error.data.message === undefined ? "Nothing to claim." :e.error.data.message)
        }
    }

    const release_Founder= async () => {
        try {

            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(Vesting_founder_addr, CrowdsaleABI, signer);

            let start = await NFTCrowdsaleContract.release(account)
            await start.wait()
            alert("released")

        } catch (e) {
            console.log("data", e)
            alert(e.error.data.message === undefined ? "Nothing to claim." :e.error.data.message)
        }
    }

    const release_treasury = async () => {
        try {

            let signer = await loadProvider()
            let NFTCrowdsaleContract = new ethers.Contract(Vesting_treasury_addr, CrowdsaleABI, signer);

            let start = await NFTCrowdsaleContract.release(account)
            await start.wait()
            alert("released")

        } catch (e) {
            alert(e.error.data.message === undefined ? "Nothing to claim." :e.error.data.message)
            console.log("data", e)
        }
    }

    return(
        <Container fluid className="main-height">
                
        <div className="sec-padding mt-5">
        <Row className="gy-5">
        <Col lg={4}>
            <div className="vesting-box">
                <div className="inner">
                    <span>
                        Total Vested
                    </span>
                    <p>
                        {totalVestedD}
                    </p>
                </div>
                <div className="inner">
                    <span>
                        Total Released
                    </span>
                    <p>
                        {totalReleasedD}
                    </p>
                </div>
                <div className="inner">
                    <span>
                        Total Claimable
                    </span>
                    <p>
                    {totalClaimableD}
                    </p>
                </div>
                <div className="text-center">
                <button className='custom-btn secondary-btn' style={{ backgroundColor: '#212529', color: '#FFF' }} onClick={release_dev}> Development</button>
                </div>
            </div>
        </Col>
        <Col lg={4}>
            <div className="vesting-box">
                <div className="inner">
                    <span>
                        Total Vested
                    </span>
                    <p>
                       {totalVestedT}
                    </p>
                </div>
                <div className="inner">
                    <span>
                        Total Released
                    </span>
                    <p>
                        {totalReleasedT}
                    </p>
                </div>
                <div className="inner">
                    <span>
                        Total Claimable
                    </span>
                    <p>
                        {totalClaimableT}
                    </p>
                </div>
                <div className="text-center">
                <button className='custom-btn secondary-btn' style={{ backgroundColor: '#212529', color: '#FFF' }} onClick={release_treasury}> Treasury </button>

                </div>
            </div>
        </Col>
        <Col lg={4}>
            <div className="vesting-box">
                <div className="inner">
                    <span>
                        Total Vested
                    </span>
                    <p>
                    {totalVestedF}
                    </p>
                </div>
                <div className="inner">
                    <span>
                        Total Released
                    </span>
                    <p>
                        {totalReleasedF}
                    </p>
                </div>
                <div className="inner">
                    <span>
                        Total Claimable
                    </span>
                    <p>
                    {totalClaimableF}
                    </p>
                </div>
                <div className="text-center">
                <button className='custom-btn secondary-btn' style={{ backgroundColor: '#212529', color: '#FFF' }} onClick={release_Founder}> Founder </button>
                </div>
            </div>
        </Col>
        {/* <div className='d-flex justify-content-center align-items-center flex-column gap-2' style={{ height: '80vh'}}>
            <button className='custom-btn secondary-btn' style={{ backgroundColor: '#212529', color: '#FFF' }} onClick={release_dev}> Development</button>
            <button className='custom-btn secondary-btn' style={{ backgroundColor: '#212529', color: '#FFF' }} onClick={release_treasury}> Treasury </button>
            <button className='custom-btn secondary-btn' style={{ backgroundColor: '#212529', color: '#FFF' }} onClick={release_Founder}> Founder </button>
        </div> */}
        </Row>
        </div>

                    
        </Container>
    )
};



export default Vesting