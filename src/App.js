import React, { useState } from 'react';
import protobuf from 'protobufjs';
import './App.css';

// Define protobuf schemas
const root = new protobuf.Root();
const LoginMsg = new protobuf.Type('LoginMsg')
  .add(new protobuf.Field('user', 1, 'string'))
  .add(new protobuf.Field('pass', 2, 'string'));
const AddMsg = new protobuf.Type('AddMsg')
  .add(new protobuf.Field('sides', 1, 'string', 'repeated'))
  .add(new protobuf.Field('meta', 3, 'bytes'));
root.add(LoginMsg).add(AddMsg);

// Fixed metadata bytes from the script
const metaBytes = new Uint8Array([8, 209, 225, 228, 139, 196, 46, 16, 144, 143, 213, 238, 166, 51]);

// Headers for login
const loginHeaders = {
  'accept': '*/*',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'content-type': 'application/octet-stream',
  'origin': 'https://ankiuser.net',
  'priority': 'u=1, i',
  'referer': 'https://ankiuser.net/account/login',
  'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
};

// Headers for add
const addHeaders = {
  'accept': '*/*',
  'accept-language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
  'content-type': 'application/octet-stream',
  'origin': 'https://ankiuser.net',
  'priority': 'u=1, i',
  'referer': 'https://ankiuser.net/add',
  'sec-ch-ua': '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36'
};

async function performLogin(username, password) {
  const payload = LoginMsg.encode({ user: username, pass: password }).finish();
  const response = await fetch('/svc/account/login', {
    method: 'POST',
    headers: loginHeaders,
    body: payload,
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`Login failed: ${response.status} ${response.statusText}`);
  }
}

async function performAdd(front, back) {
  const payload = AddMsg.encode({ sides: [front, back], meta: metaBytes }).finish();
  const response = await fetch('/svc/editor/add-or-update', {
    method: 'POST',
    headers: addHeaders,
    body: payload,
    credentials: 'include'
  });
  if (!response.ok) {
    throw new Error(`Add failed: ${response.status} ${response.statusText}`);
  }
  return await response.text();
}

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');
    try {
      await performLogin(username, password);
      const result = await performAdd(front, back);
      setStatus('Card added successfully: ' + result);
    } catch (error) {
      setStatus('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Anki Card Adder</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Front Text"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Back Text"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Card'}
          </button>
        </form>
        <p>{status}</p>
      </header>
    </div>
  );
}

export default App;
