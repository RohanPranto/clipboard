import React, { useEffect, useState } from "react";
import { customAlphabet } from "nanoid";
import { QRCodeCanvas } from "qrcode.react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import "./App.css"
import {
  useParams,
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

// Generate short IDs (5 chars: letters + numbers)
const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz0123456789", 5);

function Clipboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [showQR, setShowQR] = useState(false);

  // Generate a new clipboard if no ID in URL
  useEffect(() => {
    if (!id) {
      const newId = nanoid();
      navigate(`/${newId}`);
    }
  }, [id, navigate]);

  // Subscribe to Firestore changes
  useEffect(() => {
    if (!id) return;
    const docRef = doc(db, "clipboards", id);

    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setText(snap.data().text || "");
      }
    });

    return () => unsub();
  }, [id]);

  // Update Firestore live on typing
  const handleChange = async (e) => {
    setText(e.target.value);
    await setDoc(doc(db, "clipboards", id), { text: e.target.value }, { merge: true });
  };

  // Copy to clipboard
  const handleCopy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
  };

  // Paste from system clipboard
  const handlePaste = async () => {
    if (navigator.clipboard) {
      const clip = await navigator.clipboard.readText();
      setText(clip);
      await setDoc(doc(db, "clipboards", id), { text: clip }, { merge: true });
    }
  };

  // Clear textarea
  const handleClear = async () => {
    setText("");
    await setDoc(doc(db, "clipboards", id), { text: "" }, { merge: true });
  };

  return (
    <div className="p-4 d-flex justify-content-center align-items-center vh-100 bg-dark">
      <div
        className="card shadow-lg w-100"
        style={{ maxWidth: "900px", backgroundColor: "#1e1e1e", color: "white" }}
      >
        <div className="p-3">
          <h3 className="text-center mb-2 text-light fw-bold">📋</h3>
          <p className="text-center text-secondary mt-2 small">{id}</p>

          <textarea
            value={text}
            onChange={handleChange}
            className="form-control mb-3 bg-dark border-dark"
            rows="12"
            placeholder="Type something..."
          />

          {/* Buttons */}
          <div className="d-flex justify-content-center gap-2 mb-3">
            <button className="btn btn-dark text-secondary" onClick={handleCopy}>
              Copy
            </button>
            <button className="btn btn-dark text-secondary" onClick={handlePaste}>
              Paste
            </button>
            <button className="btn btn-dark text-secondary" onClick={handleClear}>
              Clear
            </button>
             <button
              className="btn btn-dark text-secondary"
              onClick={() => setShowQR((prev) => !prev)}
            >
              {showQR ? "Hide QR" : "QR"}
            </button>
          </div>

          {/* QR Code Toggle */}
          <div className="text-center">
           

            {showQR && (
              <div>
                <QRCodeCanvas value={window.location.href} size={80} bgColor="#1e1e1e" fgColor="#ffffff" />
                <p className="text-secondary mt-2 small">
                  Scan this QR to open on another device
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/:id" element={<Clipboard />} />
        <Route path="*" element={<Clipboard />} />
      </Routes>
    </Router>
  );
}
