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
	    password: ""
  	};
	}

 	validateForm() {
    return this.state.email.length > 0 && this.state.password.length > 0;
  }

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = event => {
    event.preventDefault();
    this.login(this.state.email, this.state.password);
  }

  	login(email, password) {
		axios.post('https://fast-lake-41497.herokuapp.com/login', querystring.stringify({email: email, password: password}))
	    	.then(res => {
				console.log(res);
				console.log(res.data);
				if(res.data.status === "success"){
					console.log("success");
					localStorage.setItem("userID", res.data.id);
					localStorage.setItem("userType", res.data.type);
					localStorage.setItem("userCompany", res.data.company)
					localStorage.setItem("loggedIn", true);
					this.setState({loginError: ""});
				}
				else
					this.setState({loginError: res.data.message});
		});
	}

	selectSection = function(e){
    console.log(e);
  }

	render(){
		if(localStorage.getItem("loggedIn") === "true")
			return <Redirect to='/homepage' />;

		return(
			 <div className="Login">
        <form onSubmit={this.handleSubmit}>
          <FormGroup controlId="email" bsSize="large">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              autoFocus
              type="email"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </FormGroup>
          <FormGroup controlId="password" bsSize="large">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              value={this.state.password}
              onChange={this.handleChange}
              type="password"
            />
          </FormGroup>
          <button
          	onClick={this.selectSection}
            disabled={!this.validateForm()}
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
		);
	}
}

export default Login;