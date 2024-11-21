import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  FormGroup,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../store/auth-slice/authSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const dispatch = useDispatch();
  const { error, isLoading } = useSelector((state) => state.auth);
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Evaluate password strength
  const evaluatePasswordStrength = (password) => {
    const strongPasswordPattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&]).{8,}$"
    );
    const mediumPasswordPattern = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$"
    );

    if (strongPasswordPattern.test(password)) {
      setPasswordStrength("strong");
    } else if (mediumPasswordPattern.test(password)) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("weak");
    }
  };

  // Form validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    agreeToTerms: Yup.boolean()
      .oneOf([true], "You must agree to the privacy policy")
      .required("You must agree to the privacy policy"),
    role: Yup.string().required("Role is required"),
  });

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const resultAction = await dispatch(signupUser(values));
      if (signupUser.fulfilled.match(resultAction)) {
        toast.success("Registration successful!");
        resetForm(); // Reset the form fields
      } else {
        toast.error(`Registration error: ${resultAction.error.message}`);
      }
    } catch (err) {
      toast.error(`Caught an error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Col lg="6" md="8">
      <Card className="bg-secondary shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <small>Register New Admin</small>
          </div>
          <Formik
            initialValues={{
              name: "",
              email: "",
              password: "",
              agreeToTerms: false,
              role: "admin",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, handleChange, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-settings-gear-65" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Field as="select" name="role" className="form-control" >
                     
                      <option selected value="admin" label="Admin" />
                     
                    </Field>
                  </InputGroup>
                  
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-hat-3" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Field as={Input} placeholder="Name" type="text" name="name" />
                  </InputGroup>
                  <ErrorMessage name="name" component="div" className="text-danger" />
                </FormGroup>
                <FormGroup>
                  <InputGroup className="input-group-alternative mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <i className="ni ni-email-83" />
                      </InputGroupText>
                    </InputGroupAddon>
                    <Field as={Input} placeholder="Email" type="email" name="email" autoComplete="new-email" />
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
                      autoComplete="new-password"
                      onChange={(e) => {
                        handleChange(e);
                        evaluatePasswordStrength(e.target.value);
                      }}
                    />
                    <InputGroupAddon addonType="append">
                      <Button onClick={() => setShowPassword(!showPassword)} type="button">
                        <i className={showPassword ? "ni ni-glasses-2" : "ni ni-glasses-2"} />
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  <ErrorMessage name="password" component="div" className="text-danger" />
                </FormGroup>
                <div className="text-muted font-italic">
                  <small>
                    Password strength:{" "}
                    <span
                      className={
                        passwordStrength === "strong"
                          ? "text-success font-weight-700"
                          : passwordStrength === "medium"
                          ? "text-warning font-weight-700"
                          : "text-danger font-weight-700"
                      }
                    >
                      {passwordStrength}
                    </span>
                  </small>
                </div>
                <Row className="my-4">
                  <Col xs="12">
                    <div className="custom-control custom-control-alternative custom-checkbox">
                      <Field type="checkbox" className="custom-control-input" id="customCheckRegister" name="agreeToTerms" />
                      <label className="custom-control-label" htmlFor="customCheckRegister">
                        <span className="text-muted">
                          I agree with the{" "}
                          <a href="#pablo" onClick={(e) => e.preventDefault()}>
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                    </div>
                    <ErrorMessage name="agreeToTerms" component="div" className="text-danger" />
                  </Col>
                </Row>
                {error && <div className="text-danger">Redux error: {error}</div>}
                <div className="text-center">
                  <Button className="mt-4" color="primary" type="submit" disabled={isSubmitting || isLoading}>
                    {isLoading ? 'Registering...' : 'Register'}
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </CardBody>
      </Card>
 
    </Col>
  );
};

export default Register;
