import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Login from './login';
import Homepage from './homepage';

const App = () => (
	<div>
		<main>
			<Switch>
				<Route exact path='/' component={Login}/>
				<Route exact path='/homepage' component={Homepage}/>
			</Switch>
	  	</main>
	</div>
);

export default App;