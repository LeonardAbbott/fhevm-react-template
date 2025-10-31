/**
 * Medical Example Component
 * Demonstrates confidential medical data operations using FHE
 */

'use client';

import React, { useState } from 'react';
import { useEncryption } from '@/hooks/useEncryption';
import { useFHE } from '@/hooks/useFHE';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

type VitalSign = 'heartRate' | 'bloodPressure' | 'temperature' | 'oxygenLevel';

export const MedicalExample: React.FC = () => {
  const { isInitialized } = useFHE();
  const { encryptBatch, isEncrypting, reset } = useEncryption();

  const [heartRate, setHeartRate] = useState('');
  const [bloodPressure, setBloodPressure] = useState('');
  const [temperature, setTemperature] = useState('');
  const [oxygenLevel, setOxygenLevel] = useState('');
  const [recordSaved, setRecordSaved] = useState(false);

  const handleSaveRecord = async () => {
    // Validate inputs
    const hr = parseInt(heartRate, 10);
    const bp = parseInt(bloodPressure, 10);
    const temp = parseFloat(temperature);
    const oxygen = parseInt(oxygenLevel, 10);

    if (isNaN(hr) || isNaN(bp) || isNaN(temp) || isNaN(oxygen)) {
      alert('Please fill all vital signs with valid values');
      return;
    }

    // Prepare encryption requests for all vital signs
    const vitals = [
      { type: 'uint8' as const, value: hr },
      { type: 'uint8' as const, value: bp },
      { type: 'uint8' as const, value: Math.round(temp * 10) }, // Store as temp * 10
      { type: 'uint8' as const, value: oxygen },
    ];

    const encrypted = await encryptBatch(vitals);

    if (encrypted.length === vitals.length) {
      setRecordSaved(true);
    }
  };

  const handleReset = () => {
    reset();
    setHeartRate('');
    setBloodPressure('');
    setTemperature('');
    setOxygenLevel('');
    setRecordSaved(false);
  };

  if (!isInitialized) {
    return (
      <Card title="Medical Records Example">
        <p className="text-gray-600">Initializing FHE client...</p>
      </Card>
    );
  }

  return (
    <Card
      title="Confidential Medical Records"
      subtitle="Store patient vital signs with encrypted values"
    >
      <div className="space-y-4">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Use Case:</strong> Store patient vital signs on-chain while maintaining
            privacy. Only authorized medical staff can decrypt and view the actual values.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Heart Rate (bpm)"
            type="number"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            placeholder="e.g., 72"
            disabled={isEncrypting || recordSaved}
            helperText="Normal: 60-100"
          />

          <Input
            label="Blood Pressure (mmHg)"
            type="number"
            value={bloodPressure}
            onChange={(e) => setBloodPressure(e.target.value)}
            placeholder="e.g., 120"
            disabled={isEncrypting || recordSaved}
            helperText="Systolic value"
          />

          <Input
            label="Temperature (°C)"
            type="number"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
            placeholder="e.g., 36.6"
            disabled={isEncrypting || recordSaved}
            helperText="Normal: 36.1-37.2"
          />

          <Input
            label="Oxygen Level (%)"
            type="number"
            value={oxygenLevel}
            onChange={(e) => setOxygenLevel(e.target.value)}
            placeholder="e.g., 98"
            disabled={isEncrypting || recordSaved}
            helperText="Normal: 95-100"
          />
        </div>

        <div className="flex gap-2">
          {!recordSaved ? (
            <Button
              onClick={handleSaveRecord}
              isLoading={isEncrypting}
              disabled={!heartRate || !bloodPressure || !temperature || !oxygenLevel}
            >
              Save Encrypted Record
            </Button>
          ) : (
            <>
              <Button variant="success" disabled>
                Record Saved
              </Button>
              <Button onClick={handleReset} variant="secondary">
                New Record
              </Button>
            </>
          )}
        </div>

        {recordSaved && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h4 className="font-semibold text-green-900 mb-2">✓ Medical Record Encrypted</h4>
            <div className="space-y-1 text-sm text-green-700">
              <p>• All vital signs encrypted successfully</p>
              <p>• 4 encrypted values prepared for storage</p>
              <p>• Ready to submit to medical records contract</p>
            </div>
            <p className="text-xs text-green-600 mt-3">
              Note: In production, this would store to a HIPAA-compliant smart contract
            </p>
          </div>
        )}

        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Privacy & Compliance</h4>
          <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
            <li>Patient data encrypted on-chain (HIPAA-friendly)</li>
            <li>Only authorized doctors can decrypt records</li>
            <li>Audit trails maintained without exposing data</li>
            <li>Analytics possible on encrypted data</li>
            <li>Patient consent managed via smart contracts</li>
          </ul>
        </div>
      </div>
    </Card>
  );
};
