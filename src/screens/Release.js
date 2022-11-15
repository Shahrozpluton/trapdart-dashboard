import { Col, Container, Row,Form } from "react-bootstrap";
import { react , useState , useEffect} from 'react'

function Release(){
    return <>
            <Container fluid className="main-height display-flex-main">
                        <form className="custom-form">
                            <h5 class="section-title">Release NFT</h5>
                            <Form.Group className="mb-3" controlId="percent">
                                <Form.Label>Percent</Form.Label>
                                <Form.Control type="text" placeholder="Percent"/>
                            </Form.Group>
                            
                            <Form.Group className="mb-3" controlId="whitelist">
                                <label for="sale_type">Sale Type</label>
                                <select className="form-control" id="sale_type">
                                    <option value="0">Private Sale</option>
                                    <option value="1">Public Sale</option>
                                </select>
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="whitelist">
                                <label for="round">Round</label>
                                <select className="form-control" id="round">
                                    <option value="">One</option>
                                    <option value="">Two</option>
                                    <option value="">Three</option>
                                </select>
                            </Form.Group>
                            <div className="mt-4">
                            <button className="btn secondary-btn" type="button">
                                Submit
                            </button>
                            </div>
                        </form>
            </Container>
    </>
}
export default Release;