import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../store/auth-slice/authSlice';
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Col,
} from 'reactstrap';

import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from "react-toastify";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const dispatch = useDispatch();
  const { isLoading, error } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [role, setRole] = useState('');

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required')
      .matches(/[a-z]/, 'Password must contain a lowercase letter')
      .matches(/[A-Z]/, 'Password must contain an uppercase letter')
      .matches(/[0-9]/, 'Password must contain a number')
      .matches(/[@$!%*?&]/, 'Password must contain a special character'),
  });

 
  const handleSubmit = (values, { setSubmitting }) => {
    dispatch(loginUser(values))
      .unwrap()
      .then((response) => {
      
        navigate("/admin/index"); 
      })
      .catch((error) => {
        // Show toast with error message if login fails
    
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <Col lg="5" md="7">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <small>Sign in with credentials</small>
          </div>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleSubmit }) => (
              <Form onSubmit={handleSubmit}>
                <FormGroup className="mb-3">
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Field
                      as={Input}
                      placeholder="Email"
                      type="email"
                      name="email"
                      autoComplete="off"
                    />
                  </InputGroup>
                  <ErrorMessage name="email" component="div" className="text-danger" />
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-lock-circle-open" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Field
                      as={Input}
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="off"
                    />
                    <InputGroupAddon addonType="append">
                      <Button onClick={() => setShowPassword(!showPassword)} type="button">
                        <i className={showPassword ? "ni ni-glasses-2" : "ni ni-glasses-2"} />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </FormGroup>
                {error && (
                  <div className="text-danger">
                    {typeof error === 'string' ? error : error.message || JSON.stringify(error) || 'An error occurred'}
                  </div>
                )}
                <div className="text-center">
                <Button
                    className="my-4"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm mr-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing In
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </CardBody>
      </Card>
    </Col>
  );
};

export default Login;
