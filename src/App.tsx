import './App.css';
import {useState} from 'react';

function App() {
  const [isDisabled, setDisabled] = useState(true);

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'meet') {
      console.log(sender);
      setDisabled(false);
      sendResponse();

    }
    return true;
  })


  const startRecording = () => {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const currentTab = tabs[0];
      if (currentTab.url?.includes("meet.google.com")) {
        console.log('Google Meet is active on this tab:', currentTab);
        chrome.runtime.sendMessage({type: 'START_RECORDING'});
      } else {
        console.log('No Google Meet session on this tab.');
      }
    });
  };

  return (
    <>
      <div className="card">
        <button onClick={startRecording} disabled={isDisabled}>
          Start recording
        </button>
      </div>
    </>
  );
}

export default App;
