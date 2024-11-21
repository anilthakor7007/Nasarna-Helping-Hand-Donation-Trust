import React from 'react';
import { Row, Col, FormGroup, Input } from 'reactstrap';

const UserprofileData = ({ props }) => {
    console.log("props from the profile data comp", props);
    const city = props.city;
    localStorage.setItem("city",city);  
    return (
        <>
            <div className="pl-lg-4">
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-phone">
                                Phone
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-phone"
                                placeholder="Phone Number"
                                type="text"
                                value={props?.phone || ''}  // Use optional chaining with a default value
                                readOnly
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-address">
                                Address
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-address"
                                placeholder="Home Address"
                                type="text"
                                value={props?.address || ''}  // Default value if undefined
                                readOnly
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col lg="4">
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-city">
                                City
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-city"
                                placeholder="City"
                                type="text"
                                value={props?.city || ''}  // Default value if undefined
                                readOnly
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="4">
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-pincode">
                                Pincode
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-pincode"
                                placeholder="Pincode"
                                type="text"
                                value={props?.pincode || ''}  // Default value if undefined
                                readOnly
                            />
                        </FormGroup>
                    </Col>
                    <Col lg="4">
                        <FormGroup>
                            <label className="form-control-label" htmlFor="input-country">
                                Country
                            </label>
                            <Input
                                className="form-control-alternative"
                                id="input-country"
                                placeholder="Country"
                                type="text"
                                value="India"  // Static value "India"
                                readOnly
                            />
                        </FormGroup>
                    </Col>
                </Row>
            </div>
        </>
    );
};

export default UserprofileData;
