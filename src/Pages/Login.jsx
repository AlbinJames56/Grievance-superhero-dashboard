import React, { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Flip , toast } from "react-toastify";
import { AdminLoginAPI } from "../services/AllAPI";
import { TokenAuthContext } from "../ContextAPI/AuthContext";
function Login() {
  const navigate = useNavigate();
  const { isAuthorized, setIsAuthorized } = useContext(TokenAuthContext);
  const [userData, setUserData] = useState({
    username: "",
    password: "",
  });

  // login
  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = userData;
    if (!username || !password) {
      toast.info("Please fill all fields!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
        transition: Flip,
      });
    } else {
      try {
        const result = await AdminLoginAPI({ username, password });
        if (result.status === 200) { 
          sessionStorage.setItem("SuperHeroToken", result.data.token);
          setIsAuthorized(true) 
          navigate("/");
          setUserData({ email: "", password: "" });
        } else {
          console.log(result.message);
          toast.warning("Invalid Email or password");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="p-5">
      <div
        className="d-flex justify-content-center align-items-center p-md-5"
        style={{ height: "70vh" }}
      >
        <div className=" container col-md-6 col-sm-12 ">

          <div className=" super-hero-page align-items-center border p-5 rounded shadow">
            <h1 className="fw-bolder text-center">
              Grievance Superhero
              Dashboard
            </h1>
            <h5 className="  my-4 text-center">Sign In to your Account</h5>
            <Form className="w-100 ">
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlUsername"
              >
                <Form.Control
                  type="text"
                  placeholder="Enter Your Username"
                  onChange={(e) =>
                    setUserData({ ...userData, username: e.target.value })
                  }
                  value={userData.username}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="exampleForm.ControlPswd">
                <Form.Control
                  type="Password"
                  placeholder="Enter Your Password"
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  value={userData.password}
                />
              </Form.Group>
            </Form>
            <div className="d-flex justify-content-center">
              <button
                className="btn  btn-warning w-50  text-light my-2"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
