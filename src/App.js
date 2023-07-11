import logo from './logo.svg';
import './App.css';
import { downloadOne, downloadMultiple } from './download.js'

function App() {
  const oneClickHandler = () => {
    const req = {
        url: "https://example.com/1",
        headers: {
          "x-amz-server-side-encryption-customer-algorithm": "AES256",
          "x-amz-server-side-encryption-customer-key": "key1",
          "x-amz-server-side-encryption-customer-key-MD5": "keymd51"
        },
        size: 167372782,
        name: 'aaa.pptx'
      };
    downloadOne(req);
  }
  const zipClickHandler = () => {
    const reqs = [
      {
        url: "https://example.com/1",
        headers: {
          "x-amz-server-side-encryption-customer-algorithm": "AES256",
          "x-amz-server-side-encryption-customer-key": "key1",
          "x-amz-server-side-encryption-customer-key-MD5": "keymd51"
        },
        size: 1047601,
        name: 'LicenseCenter_1.8.21_20230602_arm_64.qpkg'
      },
      {
        url: "https://example.com/2",
        headers: {
          "x-amz-server-side-encryption-customer-algorithm": "AES256",
          "x-amz-server-side-encryption-customer-key": "key2",
          "x-amz-server-side-encryption-customer-key-MD5": "keymd52"
        },
        size: 1129355,
        name: 'LicenseCenter_1.8.21_20230602_arm_al.qpkg'
      }
    ];
    downloadMultiple(reqs);
  }
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <button onClick={oneClickHandler}>Download One File</button>
        <button onClick={zipClickHandler}>Download Multiple Files as ZIP</button>
      </header>
    </div>
  );
}

export default App;
