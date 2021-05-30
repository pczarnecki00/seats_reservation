import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Summary from './features/components/Summary';
import SeatsView from './features/components/SeatsView';
import  ReservationPage  from './features/components/ReservationPage';
import Error from './features/components/Error'


function App() {
  return (
    <Router>
      <div className="App">

        <Switch>

          <Route path="/" exact component={ReservationPage} />
          <Route path="/seats-view" component={SeatsView}/>
          <Route path="/summary" component={Summary}/>
          <Route path="/error" component={Error}/>

        </Switch>

      </div>
    </Router>

  );
}

export default App;
