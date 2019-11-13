import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'
import './App.scss';
import RedditList from './components/RedditList/RedditList';
import RedditDetails from './components/RedditDetails/RedditDetails';

function App() {
  return (
    <div className="App">
      <div className="App__container">
        <BrowserRouter>
          <Switch>
            <Redirect exact from="/" to="/posts" />
            <Route exact path="/posts" component={RedditList} /> 
            <Route exact path="/posts/:id" component={RedditDetails} /> 
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
