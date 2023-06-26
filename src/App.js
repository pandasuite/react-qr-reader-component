import React from 'react';
import './App.css';

import QrReader from 'react-qr-reader';
import { usePandaBridge } from 'pandasuite-bridge-react';
import PandaBridge from 'pandasuite-bridge';

function App() {
  const {
    properties,
    markers,
  } = usePandaBridge(
    {
      markers: {
        getSnapshotDataHook: () => ({ id: 'https://pandasuite.com' }),
      },
    },
  );

  if (!properties) {
    return null;
  }

  const handleScan = (data) => {
    if (data) {
      (markers || []).forEach((m) => {
        if (m.id === data) {
          PandaBridge.send(PandaBridge.TRIGGER_MARKER, m.id);
        }
      });
      const queryable = {
        value: data,
      };
      PandaBridge.send('qrDetected', [queryable]);
    }
  };

  return (
    <div className="App">
      <QrReader
        delay={300}
        onScan={handleScan}
        style={{ width: '100%', heigth: '100%' }}
        className="Reader"
        showViewFinder={false}
        facingMode={properties.facingMode}
      />
    </div>
  );
}

export default App;
