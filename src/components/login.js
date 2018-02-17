import React from 'react';
import { FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Redirect } from 'react-router';
import "./login.css"

var querystring = require('querystring');

class Login extends React.Component {
	constructor(props) {
  	super(props);

  	this.state = {
	    email: "",
      name: "",
	    password: "",
      error: "",
      company: "",
      type: "admin"
  	};
	}

 	validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  validateSignup() {
  return (this.state.company.length > 0 && this.state.name.length > 0 && this.state.email.length > 0 && this.state.password.length > 0 && this.state.type.length > 0);
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleLogin = event => {
    event.preventDefault();
    this.login(this.state.email, this.state.password);
  }

  handleSignup = event => {
  event.preventDefault();
  this.createUser(this.state.email, this.state.password, this.state.name, this.state.type, this.state.company);
  }

  guestLogin = () => {
    console.log("Here!")
    console.log(localStorage.getItem("loggedIn"))
    axios.post('http://localhost:5000/guest')
    .then(res => {
      console.log(res.data);
      if(res.data.status === "success"){
        console.log("success");
        // console.log(res.data.userID);
        localStorage.setItem("userID", res.data.id);
        localStorage.setItem("userType", res.data.type);
        localStorage.setItem("userCompany", res.data.company);
        localStorage.setItem("loggedIn", true);
        this.setState({error: ""});
      }
      else
        this.setState({error: "Something wrong. Time to debug!"});
    });
  }

  login(email, password) {
  axios.post('http://localhost:5000/login', querystring.stringify({email: email, password: password}))
	.then(res => {
	console.log(res.data);
	if(res.data.status === "success"){
		console.log("success");
		localStorage.setItem("userID", res.data.id);
		localStorage.setItem("userType", res.data.type);
		localStorage.setItem("userCompany", res.data.company);
		localStorage.setItem("loggedIn", true);
		this.setState({error: ""});
	}
	else
		this.setState({error: "Something wrong. Time to debug!"});
		});
	}
  createUser(email, password, username, type, company) {
  axios.post('http://localhost:5000/signup', querystring.stringify({username: username, email: email, password: password, type: type, company: company}))
    .then(res => {
    console.log(res.data);
    if(res.data.status === "success"){
      console.log("success");
    }
    else
      console.log("failed")
    });
  }

	selectSection = function(e){
    console.log(e);
  }

	render(){
		if(localStorage.getItem("loggedIn") === "true")
			return <Redirect to='/homepage' />;

		return(
      <div>
  			 <div className="Login">
         <h3>LOGIN</h3>
          <form onSubmit={this.handleLogin}>
            <FormGroup controlId="email" bsSize="large">
              <ControlLabel>Email</ControlLabel><br />
              <FormControl
                autoFocus
                type="email"
                value={this.state.email}
                onChange={this.handleChange}
              />
            </FormGroup>
            <FormGroup controlId="password" bsSize="large">
              <ControlLabel>Password</ControlLabel><br />
              <FormControl
                value={this.state.password}
                onChange={this.handleChange}
                type="password"/>
            </FormGroup>
            <div>
            <div>
            <button
            	onClick={this.selectSection}
              disabled={!this.validateForm()}
              type="submit">
              Login
            </button>
            </div>
            </div>
          </form>
          <div className="guest">
            <button onClick={this.guestLogin}>
              Login as Guest!
            </button>
            </div>
        </div>
        <div className="Login">
          <h3>SIGNUP AS ADMIN</h3>
            <form onSubmit={this.handleSignup}>
              <div>
                <ControlLabel>Username</ControlLabel><br />
                <input
                  id="name"
                  autoFocus
                  type="text"
                  value={this.state.name}
                  onChange={this.handleChange}
                  placeholder="Username" />
              </div>
              <div>
                <ControlLabel>Company</ControlLabel><br />
                <input
                  id="company"
                  autoFocus
                  type="text"
                  value={this.state.company}
                  onChange={this.handleChange}
                  placeholder="Company" />
              </div>
              <div>
                <ControlLabel>Email</ControlLabel><br />
                <input
                  id="email"
                  autoFocus
                  type="text"
                  value={this.state.email}
                  onChange={this.handleChange}
                  placeholder="Email" />
              </div>
              <div>
                <ControlLabel>Password</ControlLabel><br />
                <input
                  id="password"
                  autoFocus
                  type="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  placeholder="Password" />
              </div>
              <div>
                <button
                  disabled={!this.validateSignup()}
                  type="submit">
                  SignUp
                </button>
              </div>
            </form>
        </div>
      </div>  
		);
	}
}

export default Login;