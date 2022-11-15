import { Col, Container, Row, Form } from "react-bootstrap";
import apis from "../services/index";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useWeb3React } from "@web3-react/core";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import moment from "moment";
import {uploadFile} from '../services/IPFS'

function AddVote() {
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

  //  title , ipfs , description , proposer
//cf-ipfs.com
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
  const [isPercent, setIsPercent] = useState(true);
  const [proposer, setProposer] = useState();
  const client = ipfsHttpClient("https://cf-ipfs.com/ipfs");
  const [optionCount, setOptioncount] = useState(2);
  const [options, setOptions] = useState([]);
  const [_date, setDate] = useState("");

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


  const handleChange = async (e) => {
    try {
      let [file] = e.target.files;
      console.log("file", file);

      //const added = await client.add(e.target.files[0]);
      const added = await uploadFile(e.target.files[0]);
      //let URL = `https://opensea.mypinata.cloud/ipfs/${added.path}`;
      console.log(added);
    } catch (error) {
      console.log("handleChange :: screen addVote : ", error);
    }
  };

  const sig = async () => {
    let signer = await loadProvider();
    let message = "Add the proposal";
    let s = await signer.signMessage(message);
    return s;
  };

  const _addProposal = async (e) => {
    e.preventDefault()
    try {
      let opt = null;
      if (isPercent) {

        let options_ = options.slice(0, optionCount);
        const obj = {};

        console.log("TIME", moment().format());

        options_.forEach((element) => {
          obj[element] = 0;
        });

        opt = JSON.stringify(obj);

      } else {
        const obj = { Yes: 0, No: 0 };
        opt = JSON.stringify(obj);
      }
      console.log('options',opt)
      console.log('options',moment(_date+'T13:00:00+00:00').format())
      console.log('options',_date+'T13:00:00+00:00')
      if (title && description && _date && opt !== null && opt !== '' && opt !== undefined && opt !=={}) {
        let signature = await sig();

        let add = await apis.addProposal({
          title: title,
          description: description,
          signature: signature,
          options: opt,
          closing_date: _date+'T13:00:00+00:00',
          vote_type: "NORMAL",
          image : ""
        });
        console.log("resposnse", add);
        alert("Proposal Added")
      }
    } catch (error) {
      console.log("addProposal :: screen addVote :", error);
      const message = error.response.data.error || error.message;
      alert(message)
    }
  };

  const changeOption = (index, value) => {

    setOptions((prevState) => {
      prevState[index] = value.toString();
      return prevState;
    });

  };

  return (
    <>
      <Container fluid className="main-height display-flex-main">
        <form className="custom-form" onSubmit={_addProposal}>
          <h5 class="section-title">Add Vote</h5>

          <Form.Group className="mb-3" controlId="tilte">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="title"
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="token">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              type="text"
              placeholder="Description"
              required
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="tilte">
            <Form.Label>Closing Date</Form.Label>
            <Form.Control
              type="date"
              placeholder="Token ID"
              required
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="switch"
              id="custom-switch"
              label="Yes and No"
              onChange={() => setIsPercent(!isPercent)}
            />
          </Form.Group>
          {isPercent ? (
            <>
              <Form.Group className="mb-3 input-flex-group" controlId="percent">
                {Array(optionCount)
                  .fill(0)
                  .map((_, key) => {
                    return (
                      <Form.Control
                        type="text"
                        placeholder="Enter Option"
                        required
                        maxLength={10}
                        onChange={(e) => changeOption(key, e.target.value)}
                      />
                    );
                  })}
              </Form.Group>

              <div className="mt-4">
                <button
                  className="btn secondary-btn"
                  type="button"
                  onClick={() =>
                    setOptioncount(optionCount + 1 > 8 ? 8 : optionCount + 1)
                  }
                >
                  Add Option
                </button>
                <button
                  className="btn secondary-btn"
                  type="button"
                  onClick={() =>
                    setOptioncount(optionCount - 1 < 2 ? 2 : optionCount - 1)
                  }
                >
                  Remove Option
                </button>
              </div>
            </>
          ) : (
            ""
          )}

          <div className="mt-4">
            <button
              className="btn secondary-btn"
              type="submit"

            >
              Publish
            </button>
          </div>
        </form>
      </Container>
    </>
  );
}
export default AddVote;
