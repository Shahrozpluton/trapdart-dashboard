import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function CommunityModal(props) {
    const [title , setTitle] = useState()
    const [description , setDescription] = useState()

    return (
        <>
            <Modal show={props.show} onHide={props.handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Community</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="tilte">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="token">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={4} type="text" placeholder="Description" onChange={(e) => setDescription(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mt-4" >
                            <button className='custom-btn secondary-btn' onClick={props.handleClose}>Submit</button>
                        </Form.Group>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default CommunityModal