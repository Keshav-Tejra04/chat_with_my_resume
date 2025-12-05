import { useState, useEffect } from 'react'
import { uploadResume, sendChatMessage, checkBackendHealth } from './api'
import './App.css' // Standard Vite CSS or your own

function App() {
  const [messages, setMessages] = useState([
    { text: "Hello! I am ready to answer questions about the resume.", isBot: true }
  ]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [backendStatus, setBackendStatus] = useState("Checking...");

  // Check if backend is alive on load
  useEffect(() => {
    checkBackendHealth()
      .then(() => setBackendStatus("Online 🟢"))
      .catch(() => setBackendStatus("Offline 🔴"));
  }, []);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploadStatus("Uploading & Analyzing...");
    try {
      await uploadResume(file);
      setUploadStatus("Resume Ready! ✅");
      // Reset chat for new context
      setMessages([{ text: "New resume uploaded. Ask me anything about it!", isBot: true }]);
    } catch (error) {
      setUploadStatus("Upload Failed ❌");
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    
    // Add User Message to UI
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);

    try {
      const data = await sendChatMessage(userMsg);
      // Add Bot Response to UI
      setMessages(prev => [...prev, { text: data.response, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Error: Could not get response.", isBot: true }]);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Chat with Resume 📄</h1>
      <p>Backend Status: {backendStatus}</p>

      {/* Upload Section */}
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>1. Upload Resume (PDF)</h3>
        <p><i>(Or we can load a default permanent one later)</i></p>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
        <button onClick={handleUpload} style={{ marginLeft: '10px' }}>Upload</button>
        <p><strong>{uploadStatus}</strong></p>
      </div>

      {/* Chat Section */}
      <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>2. Chat</h3>
        <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #eee', padding: '10px', marginBottom: '10px' }}>
          {messages.map((msg, index) => (
            <div key={index} style={{ textAlign: msg.isBot ? 'left' : 'right', margin: '5px 0' }}>
              <span style={{ 
                background: msg.isBot ? '#f0f0f0' : '#007bff', 
                color: msg.isBot ? 'black' : 'white',
                padding: '8px 12px', 
                borderRadius: '15px',
                display: 'inline-block'
              }}>
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex' }}>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about experience, skills..." 
            style={{ flex: 1, padding: '10px' }}
          />
          <button onClick={handleSend} style={{ padding: '10px 20px' }}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;