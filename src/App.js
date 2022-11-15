import { useState } from 'react';
import './App.css';
import {SideBar,Header} from './components/Index';
import {Text, AddVote, Burn, Community, EditCommunity, Home, ListVote, Mintable, Release, Sale, Vesting} from './screens/Index';
import { useEagerConnect, useInactiveListener } from './hooks/useEagerConnect';
import {BrowserRouter as Router,Route,Routes} from 'react-router-dom';



function App() {
  const [errorMessage, setErrorMessage] = useState();
  useEagerConnect(setErrorMessage);
  useInactiveListener();

  return (
    <div className="App main-body">
      {/* {
        errorMessage? <div style={{color:"red"}}>{errorMessage}</div>: null
      }
      <Header setErrorMessage={setErrorMessage}/>
      <Home /> */}
      <Router>
      <SideBar />
      <div className="main-section">
        <Header setErrorMessage={setErrorMessage}/>
        <Routes>
        <Route path="/" element={<Home/>}  />
        <Route path="/sale" element={<Sale/>}  />
        {/* <Route path="/burn" element={<Burn/>}  />
        <Route path="/release" element={<Release/>}  /> */}
        <Route path="/add-vote" element={<AddVote/>}  />
        <Route path="/list-vote" element={<ListVote/>}  />
        <Route path="/list-community" element={<Community/>}  />
        <Route path="/vesting" element={<Vesting/>}  />
        <Route path="/mintable" element={<Mintable/>}  />
        <Route path="/text" element={<Text/>}  />
        <Route path="/edit-community/:id" element={<EditCommunity/>}  />

        </Routes>
      </div>
      </Router>
    </div>
  );
}

export default App;
