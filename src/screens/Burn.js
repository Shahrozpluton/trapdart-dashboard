import { Col, Container, Row,Form } from "react-bootstrap";

function Burn(){
    return <>
            <Container fluid className="main-height display-flex-main">
                        <form className="custom-form">
                            <h5 class="section-title">Burn</h5>
                            <Form.Group className="mb-3" controlId="token">
                                <Form.Label>Token ID</Form.Label>
                                <Form.Control type="text" placeholder="Token ID"/>
                            </Form.Group>
                            <div className="mt-4">
                            <button className="btn secondary-btn" type="button">
                                Burn
                            </button>
                            </div>
                        </form>
            </Container>
    </>
}
export default Burn;