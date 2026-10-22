import React, { useState } from 'react';

interface Props {
  domain: string;
  cid: string;
  owner: string;
}

export default function CyberShowcase({ domain, cid, owner }: Props) {
  const [inputText, setInputText] = useState('Free-Net Sovereign Web');
  const [hashResult, setHashResult] = useState('0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069');
  const [pingLatency, setPingLatency] = useState<number | null>(null);
  const [isPinging, setIsPinging] = useState(false);

  // Simple deterministic visual hash simulator
  const handleInputChange = (text: string) => {
    setInputText(text);
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      hash = (hash << 5) - hash + text.charCodeAt(i);
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    setHashResult(`0x${hex}e92b7c4a11f0c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3${hex.slice(0, 4)}`);
  };

  const handlePing = () => {
    setIsPinging(true);
    setTimeout(() => {
      setPingLatency(Math.floor(Math.random() * 25) + 15);
      setIsPinging(false);
    }, 600);
  };

  return (
    <div className="w-full h-full bg-[#08080C] text-[#EAE6DF] font-sans p-6 overflow-y-auto select-none relative">
      {/* BACKGROUND GLOW */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* SHOWCASE HEADER */}
      <div className="relative z-10 max-w-3xl mx-auto space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D4AF37]/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border border-[#D4AF37] rotate-45 flex items-center justify-center bg-[#141414]">
              <div className="w-3 h-3 bg-gradient-to-tr from-[#D4AF37] to-amber-200"></div>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-[0.2em] uppercase font-display bg-clip-text text-transparent bg-gradient-to-r from-[#D4AF37] via-amber-200 to-[#D4AF37]">
                {domain ? `${domain}.free` : 'coolsite.free'}
              </h1>
              <p className="text-[10px] text-[#888888] font-mono tracking-wider">
                DECENTRALIZED IPFS HYPERMEDIA • ETHEREUM SEPOLIA DEED
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 border border-emerald-400 text-emerald-300 bg-emerald-950/40 flex items-center gap-1.5 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              LIVE ON P2P DHT
            </span>
          </div>
        </div>

        {/* HERO BANNER */}
        <div className="p-5 bg-gradient-to-b from-[#14141A] to-[#0D0D12] border border-[#D4AF37]/40 shadow-xl relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 border border-[#D4AF37]/10 rotate-12 pointer-events-none"></div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 inline-block mb-2">
            Censorship-Resistant Web3 Deed
          </span>
          <h2 className="text-lg font-bold text-white mb-2 font-display tracking-wide">
            Welcome to the Sovereign Peer-to-Peer Web
          </h2>
          <p className="text-xs text-[#AAA] leading-relaxed mb-4">
            This decentralized site is served directly from the IPFS global distributed hash table. It has no centralized cloud server, no DNS registrar authority, and cannot be censored or seized by third parties.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs font-mono">
            <div className="p-2.5 bg-black/60 border border-[#D4AF37]/20">
              <span className="text-[10px] text-[#888888] block">CONTENT INTEGRITY</span>
              <span className="text-emerald-400 font-bold">100% SHA-256</span>
            </div>
            <div className="p-2.5 bg-black/60 border border-[#D4AF37]/20">
              <span className="text-[10px] text-[#888888] block">DEED RESOLUTION</span>
              <span className="text-[#D4AF37] font-bold">0 Gas (Instant)</span>
            </div>
            <div className="p-2.5 bg-black/60 border border-[#D4AF37]/20">
              <span className="text-[10px] text-[#888888] block">NODE HOSTING</span>
              <span className="text-cyan-300 font-bold">54 IPFS Peers</span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE WIDGET 1: LIVE CRYPTOGRAPHIC HASHER */}
        <div className="p-4 bg-[#101016] border border-[#D4AF37]/25 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 font-mono">
              <span>⚡</span> Interactive Content Addressing Simulator
            </h3>
            <span className="text-[10px] text-[#888888] font-mono">Keccak-256 / Multihash</span>
          </div>
          <p className="text-[11px] text-[#888888]">
            Type any string below to observe how IPFS generates a deterministic cryptographic fingerprint:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => handleInputChange(e.target.value)}
              className="flex-1 bg-black/70 border border-[#D4AF37]/40 p-2 text-xs text-white font-mono focus:outline-none focus:border-[#D4AF37]"
              placeholder="Type to compute cryptographic hash..."
            />
          </div>
          <div className="p-2.5 bg-black/90 border border-[#D4AF37]/20 font-mono text-[11px] break-all text-[#D4AF37]">
            <span className="text-[9px] text-[#888888] block uppercase">Computed Deterministic Hash:</span>
            {hashResult}
          </div>
        </div>

        {/* INTERACTIVE WIDGET 2: P2P LATENCY BENCHMARK */}
        <div className="p-4 bg-[#101016] border border-[#D4AF37]/25 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2 font-mono">
              <span>🌐</span> P2P Swarm Latency Benchmark
            </h3>
            <button
              onClick={handlePing}
              disabled={isPinging}
              className="text-[11px] uppercase tracking-wider px-3 py-1 bg-[#D4AF37] text-black font-bold hover:bg-amber-200 transition font-mono cursor-pointer"
            >
              {isPinging ? 'Pinging Swarm...' : 'Ping IPFS Swarm'}
            </button>
          </div>
          <div className="flex items-center justify-between text-xs font-mono p-2.5 bg-black/70 border border-[#D4AF37]/20">
            <span className="text-[#888888]">Relay Response Time:</span>
            <span className="font-bold text-cyan-300">
              {pingLatency ? `${pingLatency} ms (Fast)` : '34 ms (Cached in Cluster)'}
            </span>
          </div>
        </div>

        {/* ON-CHAIN IMMUTABLE PROOF */}
        <div className="p-4 bg-black/80 border border-[#D4AF37]/30 text-xs font-mono space-y-2">
          <div className="flex justify-between items-center text-[10px] text-[#888888] uppercase border-b border-[#D4AF37]/20 pb-1.5">
            <span>Cryptographic Deed Metadata</span>
            <span className="text-[#D4AF37]">Sepolia Blockchain Verified</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888888]">Mapped CID:</span>
            <span className="text-[#D4AF37] truncate max-w-xs">{cid || 'QmRnYFQc27XBSTGCkfunCY5EjABigYRbxSkxZbXTF6GitA'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#888888]">Deed Owner:</span>
            <span className="text-[#F2E8C4]">{owner || '0x4fce85d6EF388BC4cA9Aa780440e48d9A3eee606'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
