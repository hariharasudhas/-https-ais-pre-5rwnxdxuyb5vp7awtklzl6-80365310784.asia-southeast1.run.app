import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { getCurrentFirebaseConfig, updateCustomFirebaseConfig } from '../services/firebaseConfig';
import { FirebaseConfig } from '../types';
import { X, Database, Check, Copy, ExternalLink, Save, Code } from 'lucide-react';

export const FirebaseConfigModal: React.FC = () => {
  const { isFirebaseConfigOpen, setIsFirebaseConfigOpen } = useStore();
  const currentConfig = getCurrentFirebaseConfig();

  const [apiKey, setApiKey] = useState(currentConfig.apiKey || '');
  const [authDomain, setAuthDomain] = useState(currentConfig.authDomain || '');
  const [projectId, setProjectId] = useState(currentConfig.projectId || '');
  const [storageBucket, setStorageBucket] = useState(currentConfig.storageBucket || '');
  const [messagingSenderId, setMessagingSenderId] = useState(currentConfig.messagingSenderId || '');
  const [appId, setAppId] = useState(currentConfig.appId || '');

  const [copiedCode, setCopiedCode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isFirebaseConfigOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: FirebaseConfig = {
      apiKey: apiKey.trim(),
      authDomain: authDomain.trim(),
      projectId: projectId.trim(),
      storageBucket: storageBucket.trim(),
      messagingSenderId: messagingSenderId.trim(),
      appId: appId.trim()
    };
    updateCustomFirebaseConfig(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const envSampleCode = `# Add the following to your .env or .env.local file:
VITE_FIREBASE_API_KEY="${apiKey || 'AIzaSyYourApiKeyHere'}"
VITE_FIREBASE_AUTH_DOMAIN="${authDomain || 'your-project.firebaseapp.com'}"
VITE_FIREBASE_PROJECT_ID="${projectId || 'your-project-id'}"
VITE_FIREBASE_STORAGE_BUCKET="${storageBucket || 'your-project.appspot.com'}"
VITE_FIREBASE_MESSAGING_SENDER_ID="${messagingSenderId || '123456789'}"
VITE_FIREBASE_APP_ID="${appId || '1:123456789:web:abcdef'}"`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envSampleCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl my-auto p-6 md:p-8 rounded-3xl bg-white border border-neutral-200 shadow-2xl text-neutral-900">
        <button
          onClick={() => setIsFirebaseConfigOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <Database className="w-5 h-5 text-[#b8860b]" />
          <span className="text-xs uppercase tracking-widest text-[#b8860b] font-bold">
            Database & Cloud Integration
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-neutral-900 mb-2">
          Firebase Configuration
        </h2>
        <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
          MR.Premium features schema collections (<code className="text-neutral-900 font-bold">users</code>, <code className="text-neutral-900 font-bold">products</code>, <code className="text-neutral-900 font-bold">categories</code>, <code className="text-neutral-900 font-bold">cart</code>, <code className="text-neutral-900 font-bold">orders</code>). Configure your live project credentials below or set them in your environment variables.
        </p>

        {savedSuccess && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Firebase configuration saved successfully.</span>
          </div>
        )}

        {/* Developer Instruction Box */}
        <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-[#b8860b]" />
              <span>Where to add Firebase configuration:</span>
            </span>
            <button
              onClick={copyToClipboard}
              className="text-xs font-bold text-[#b8860b] hover:text-black flex items-center gap-1 cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy .env variables'}</span>
            </button>
          </div>
          <p className="text-[11px] text-neutral-600 mb-2">
            1. Create a Firebase project in the <a href="https://console.firebase.google.com" target="_blank" rel="noreferrer" className="text-[#b8860b] font-bold underline inline-flex items-center gap-0.5">Firebase Console <ExternalLink className="w-2.5 h-2.5" /></a>.
            <br />
            2. Add a Web App to get your configuration object.
            <br />
            3. Paste the values into the fields below or place them in <code className="text-neutral-900 bg-neutral-200 px-1 py-0.5 rounded">.env</code>.
          </p>
          <pre className="p-3 rounded-xl bg-neutral-900 text-white text-[11px] font-mono overflow-x-auto">
            {envSampleCode}
          </pre>
        </div>

        {/* Form to update keys live */}
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                API Key
              </label>
              <input
                type="text"
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Project ID
              </label>
              <input
                type="text"
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                placeholder="mr-premium-marketplace"
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Auth Domain
              </label>
              <input
                type="text"
                value={authDomain}
                onChange={e => setAuthDomain(e.target.value)}
                placeholder="mr-premium-marketplace.firebaseapp.com"
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Storage Bucket
              </label>
              <input
                type="text"
                value={storageBucket}
                onChange={e => setStorageBucket(e.target.value)}
                placeholder="mr-premium-marketplace.appspot.com"
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                Messaging Sender ID
              </label>
              <input
                type="text"
                value={messagingSenderId}
                onChange={e => setMessagingSenderId(e.target.value)}
                placeholder="80365310784"
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1">
                App ID
              </label>
              <input
                type="text"
                value={appId}
                onChange={e => setAppId(e.target.value)}
                placeholder="1:80365310784:web:..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-neutral-900 text-xs focus:outline-none focus:border-[#d4af37]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <span className="text-[11px] text-neutral-500">
              Active engine: Persistent Local Storage + Cloud Firestore Sync Ready
            </span>

            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-neutral-900 hover:bg-[#b8860b] flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save & Connect</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
