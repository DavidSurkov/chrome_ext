chrome.tabs.onUpdated.addListener(function(_, changeInfo, tab) {
  // Check for URL and make sure the tab is fully loaded
  if (tab?.url?.includes('meet.google.com') && changeInfo.status === 'complete') {
    console.log('Google Meet session detected:', tab.url);
    // You can potentially inject scripts here

    chrome.runtime.sendMessage({ type: 'meet' });
  }
});

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === 'START_RECORDING' && sender.tab) {
    chrome.desktopCapture.chooseDesktopMedia(['audio'], sender.tab, (streamId) => {
      if (!streamId) {
        console.error('No stream ID returned, user likely cancelled the prompt.');
        return;
      }
      // You now have a streamId which can be used to capture audio
      navigator.mediaDevices.getUserMedia({
        audio: true,
      }).then((stream) => {
        console.log('Audio stream obtained:', stream);
        // Handle the stream, such as sending it to a server or storing it locally
        const mediaRecorder = new MediaRecorder(stream);
        let chunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = function(e) {
          chunks.push(e.data);
        };

        mediaRecorder.onstop = function(_) {
          const blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' });
          chunks = [];

          console.log('Audio available at:', blob);
          // Here you can save the blob or upload it to a server
        };

        mediaRecorder.start();
        // Example: stop recording after 30 seconds
        setTimeout(() => {
          mediaRecorder.stop();
        }, 30000);
      }).catch((error) => {
        console.error('Error obtaining audio:', error);
      });
    });
  }
  return true;
});
