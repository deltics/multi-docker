//import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Fib from './Fib';
import OtherPage from './OtherPage';


function App() {
  return (
    <Router>
      <div className="App">
        <header>
          {/* <img src={logo} className="App-logo" alt="logo" />  */}
          <h1 className="App-title">Fibonnaci App</h1>
          <Link to="/">Home</Link> |
          <Link to="/other">Other Page</Link>
        </header>
        <hr/>
        <div>
          <Route exact path="/" component={Fib} />
          <Route path="/other" component={OtherPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
