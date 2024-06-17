import React, { useState, useMemo } from 'react';
import './App.css';

import QrReader from 'react-qr-reader';
import { usePandaBridge } from 'pandasuite-bridge-react';
import PandaBridge from 'pandasuite-bridge';
import throttle from 'lodash/throttle';

const SCAN_DELAY = 300;

function App() {
  const [lastScannedData, setLastScannedData] = useState(null);
  const { properties, markers } = usePandaBridge({
    markers: {
      getSnapshotDataHook: () => ({ id: 'https://pandasuite.com' }),
    },
    actions: {
      reset: () => {
        setLastScannedData(null);
      },
    },
  });

  const handleScan = useMemo(
    () =>
      throttle((data) => {
        if (data && data !== lastScannedData) {
          (markers || []).forEach((m) => {
            if (m.id === data) {
              PandaBridge.send(PandaBridge.TRIGGER_MARKER, m.id);
            }
          });
          const queryable = {
            value: data,
          };
          PandaBridge.send('qrDetected', [queryable]);
          setLastScannedData(data);
        }
      }, SCAN_DELAY),
    [markers, lastScannedData]
  );

  if (!properties) {
    return null;
  }

  return (
    <div className="App">
      <QrReader
        delay={SCAN_DELAY}
        onScan={handleScan}
        style={{ width: '100%', height: '100%' }}
        className="Reader"
        showViewFinder={false}
        facingMode={properties.facingMode}
      />
    </div>
  );
}

export default App;
