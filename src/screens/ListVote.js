import { Col, Container, Row,Form } from "react-bootstrap";
import axios from 'axios'
import apis from '../services/index'
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import Web3Modal from 'web3modal';
import moment from 'moment'


function ListVote(){

    const {
        connector,
        library,
        account,
        chainId,
        activate,
        deactivate,
        active,
        error
      } = useWeb3React();

      const [proposalOBJ , setProposalOBJ] = useState([]);
      const [updateproposalOBJ , setupdateProposalOBJ] = useState(0)

      
      const getProposals = async ()=>{
        try {
          const data = await apis.getTypeProposals('NORMAL')
          let temp = []
          console.log("data",data)
         
          data.data.map((arr) => {
            //let arr = 
            let arrr = []
            arr.options && Object.keys(arr.options).forEach(key => arrr.push({name: key, value: arr.options[key]}))
             console.log(arrr)
            //console.log(arr.options.split(','))
            let obj = {
                description: arr.description,
                image: arr.image,
                proposal_id: arr.id,
                title: arr.title,
                options:arrr,
                total_passed: arr.total_passed,
                total_votes: arr.total_votes,
                closing_date: arr.closing_date,
                created_at : arr.created_at,
            }
            temp.push(obj)
            console.log("DATA :" , obj)
    
          })
          setProposalOBJ(temp.length && temp.reverse())
          setupdateProposalOBJ(proposalOBJ + 1)
        } catch (error) {
            console.log("getProposals :: ListVote screen :" , error)
        }
      }
    
      useEffect(()=>{
        (async ()=>{
          if(library && account){
            try {
                getProposals()
            }
            catch(error){
              console.log("Error ",error.message);
            }
            return () => {
    
            };
          }
        })();
      }, [library, account, chainId , updateproposalOBJ ]);

    return <>
            <Container fluid className="main-height">
                
            <div className="sec-padding mt-5">
            <Row className="gy-5">
       
                {proposalOBJ.length > 0 && proposalOBJ.map((_,key)=>{
                  return(
                    <Col lg={6}>
                    <div className="box">
                    <p>
                      Title<br />{_.title} <br /> Description<br /> {_.description}<br /> Voting closes on {moment(_.closing_date).format('MMMM Do YYYY, h:mm:ss a')}
                    </p>
                    <div className="box-inner-btn d-flex flex-wrap justify-content-center ">
                
                    </div>
                    <div className="box-inner-calc percent-flex">
                    {
                      _.options.map((i,k)=>{
                        return(
                          <div className="d-flex flex-column">
                          <p>{i.name}: {i.value}</p>
                        </div>
                              )
                            })
                          }
                    </div>
                  </div>
              </Col>
                  )
                })}
               
              
            </Row>
          </div>

                        
            </Container>
    </>
}
export default ListVote;