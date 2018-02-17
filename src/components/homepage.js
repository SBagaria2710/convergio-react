import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Redirect } from 'react-router';

var querystring = require('querystring');

class Homepage extends React.Component {
	constructor(props) {
    	super(props);
    	this.state = {
    		inputText: "",
    		pending: {},
    		output: {},
    		name: "",
    		email: "",
    		password: "",
    		type: "employee",
    		"logout": false
    	};
  	}

  	componentWillMount() {
		this.fetchOutput();
		this.fetchPendingList();
		this.approvals = new Set();
		console.log(localStorage.getItem("userType"));
	}

  	validateInput() {
    	return this.state.inputText.length > 0;
  	}

  	validateSignup() {
  		return (this.state.name.length > 0 && this.state.email.length > 0 && this.state.password.length > 0 && this.state.type.length > 0);
  	}

  	handleChange = (event) => {
    	this.setState({
      		[event.target.id]: event.target.value
    	});
  	}

  	handleInput = (event) => {
    	event.preventDefault();
    	this.input(localStorage.getItem("userID"),this.state.inputText, localStorage.getItem("userType"), localStorage.getItem("userCompany"));
  	}

  	handleSignup = (event) => {
    	event.preventDefault();
    	this.createUser(this.state.email, this.state.password, this.state.name, this.state.type, localStorage.getItem("userCompany"));
  	}

  	handleApproval = (event) => {
  		for (const approval of this.approvals) {
			this.approveText(approval)
		}
  	}

  	handleCheckbox = (event) => {
  		var id = event.target.id;
  		if (this.approvals.has(id)) {
			this.approvals.delete(id);
		} else {
			this.approvals.add(id);
		}
  	}

  	createUser(email, password, username, type, company) {
		axios.post('https://fast-lake-41497.herokuapp.com/signup', querystring.stringify({username: username, email: email, password: password, type: type, company: company}))
    	.then(res => {
			console.log(res);
			console.log(res.data);
			if(res.data.status === "success"){
				console.log("success");
			}
			else
				console.log("failed")
		});
	}

  	input(userID, inputText, type, userCompany) {
  		console.log(userID + " : " + inputText + " : " + type + " : " + userCompany)
		axios.post('https://fast-lake-41497.herokuapp.com/input', querystring.stringify({userID: userID, text: inputText, type: type, userCompany: userCompany}))
    	.then(res => {
			console.log(res);
			console.log(res.data);
			if(res.data.status === "success"){
				console.log("success")
				if(localStorage.getItem("userType") !== "employee"){
					var obj1 = this.state.output
					obj1[res.data.id] = this.state.inputText
					this.setState({output: obj1})
				}
				this.setState({inputText:""})
			}
		});
	}

	approveText = (id) => {
		axios.post('https://fast-lake-41497.herokuapp.com/updateStatus', querystring.stringify({id: id}))
    	.then(res => {
			console.log(res);
			console.log(res.data);
			if(res.data.status === "success"){
				console.log("success")
				this.approvals.delete(id);
				var obj1 = this.state.pending
				delete obj1[id]
				this.setState({pending: obj1})
			}
			else
				console.log("failed")
		});
	}

	fetchOutput() {
		const userID = localStorage.getItem("userID");
		axios.post('https://fast-lake-41497.herokuapp.com/inputList', querystring.stringify({userID: userID}))
    	.then(res => {
			console.log(res.data);
			if(res.data.status === "success") {
				if(res.data.inputs.length > 0){
					var obj1 = {};
					for(let input in res.data.inputs){
						obj1[res.data.inputs[input]['_id']] = res.data.inputs[input]['text']
					}
					this.setState({output: obj1});
					console.log(this.state.output)
				}
			}
		});
	}

	fetchPendingList() {
		const userCompany = localStorage.getItem("userCompany");
		axios.post('https://fast-lake-41497.herokuapp.com/pendingList', querystring.stringify({userCompany: userCompany}))
	    .then(res => {
    		console.log(res);
			console.log(res.data);
			if(res.data.status === "success") {
				if(res.data.inputs.length > 0){
					var obj1 = {};
					for(let input in res.data.inputs){
						obj1[res.data.inputs[input]['_id']] = res.data.inputs[input]['text']
					}
					this.setState({pending: obj1});
				}
			}
		});
	}

	logoutUser = () => {
		localStorage.setItem("userId", "")
		localStorage.setItem("userType", "");
		localStorage.setItem("userCompany", "")
		localStorage.setItem("loggedIn", false)
		var logout = this.state.logout
		this.setState({logout: !(logout)})
	}

	render(){
		if(localStorage.getItem("loggedIn") === "false")
			return <Redirect to='/' />;

		var isAdmin = false;
		if(localStorage.getItem("userType") === "admin")
			isAdmin = true
		else
			isAdmin = false

		var outputTexts = [];
		var pendingTexts = [];

		if(this.state.output !== undefined){
			outputTexts = Object.keys(this.state.output).map((key, i) => {
				return(
					<p key={key}>{this.state.output[key]}</p>
				);
			});
		}

		if(this.state.pending !== undefined){
			pendingTexts = Object.keys(this.state.pending).map((key, i) => {
				return(
					<div key={key}>
						<label><input id={key} type="checkbox" value={key} onChange={this.handleCheckbox} />{this.state.pending[key]}</label>
					</div>
				);
			});
		}

		return(
			<div>
				<div style={{marginBottom:10+"px"}}>
					<button
					type="submit"
					onClick={this.logoutUser} >
						Logout
					</button>
				</div>

				<div style={{marginBottom:10+"px"}}>
					<h4>Enter Input Text</h4>
					<form onSubmit={this.handleInput}>
						<div>
							<input
							 	id="inputText"
							 	autoFocus
				              	type="text"
				              	value={this.state.inputText}
				              	onChange={this.handleChange}
				              	placeholder="Enter Text" />
						</div>
			            <div>
			            	<button
				            	disabled={!this.validateInput()}
				            	type="submit">
				            	Submit
				          	</button>
			            </div>
			        </form>
				</div>

				<div style={{marginBottom:10+"px"}}>
				<h4>Approved Output Texts</h4>
					{outputTexts}
				</div>

				{isAdmin ? (
					<div style={{marginBottom:10+"px"}}>
				<h4>Add a fellow Colleague</h4>
					<form onSubmit={this.handleSignup}>
						<div>
							<input
							 	id="name"
							 	autoFocus
				              	type="text"
				              	value={this.state.name}
				              	onChange={this.handleChange}
				              	placeholder="Name" />
			            </div>
			            <div>
							<input
							 	id="email"
							 	autoFocus
				              	type="text"
				              	value={this.state.email}
				              	onChange={this.handleChange}
				              	placeholder="Email" />
			            </div>
			            <div>
				            <input
							 	id="password"
							 	autoFocus
				              	type="text"
				              	value={this.state.password}
				              	onChange={this.handleChange}
				              	placeholder="Password" />
			            </div>
			            <div>
			              	<select
			              		id="type"
			              		value={this.state.type}
			              		onChange={this.handleChange}>
								<option value="employee">Employee</option>
								<option value="admin">Admin</option>
							</select>
						</div>
						<div>
				            <button
				            	disabled={!this.validateSignup()}
				            	type="submit">
				            	Submit
						    </button>
					    </div>
					</form>
				</div>

				) :
				(
					<br />
				)}

				{isAdmin ? (
					<div>
				<h4>Here are all the pending inputs!</h4>
					{pendingTexts}
					<div>
						<button
			            	type="submit"
			            	onClick={this.handleApproval}>
			            	Submit
					    </button>
					</div>
				</div>
				) :
				(
					<br />
				)}

			</div>
		);
	}
}

export default Homepage;