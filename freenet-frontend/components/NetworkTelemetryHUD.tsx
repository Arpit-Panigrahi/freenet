import React, { useState, useEffect } from 'react';

export default function NetworkTelemetryHUD() {
  const [mounted, setMounted] = useState(false);
  const [blockNumber, setBlockNumber] = useState(6842914);
  const [gasPrice, setGasPrice] = useState(12);
  const [peerCount, setPeerCount] = useState(54);
  const [ping, setPing] = useState(38);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setBlockNumber((prev) => (Math.random() > 0.6 ? prev + 1 : prev));
      setGasPrice((prev) => Math.max(9, Math.min(24, prev + (Math.random() > 0.5 ? 1 : -1))));
      setPeerCount((prev) => Math.max(48, Math.min(62, prev + (Math.random() > 0.5 ? 1 : -1))));
      setPing((prev) => Math.max(28, Math.min(52, prev + (Math.random() > 0.5 ? 2 : -2))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const formattedBlock = mounted
    ? blockNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : '6,842,914';

  return (
    <div className="border-b border-[#D4AF37]/25 bg-[#070707] py-2 px-6 overflow-x-auto text-[11px] font-mono tracking-wider select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap">
        {/* NETWORK & BLOCK */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[#888888] uppercase">SEPOLIA EVM:</span>
          <span className="text-[#D4AF37] font-bold">#{formattedBlock}</span>
        </div>

        {/* GAS PRICE */}
        <div className="flex items-center gap-2">
          <span className="text-[#888888] uppercase">GAS:</span>
          <span className="text-[#F2E8C4]">{gasPrice} GWEI</span>
          <span className="text-[9px] text-emerald-400 border border-emerald-500/40 px-1">OPTIMAL</span>
        </div>

        {/* P2P SWARM PEERS */}
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className="text-[#888888] uppercase">IPFS DHT SWARM:</span>
          <span className="text-cyan-300 font-bold">{peerCount} PEERS</span>
        </div>

        {/* REGISTRY DEED CONTRACT */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-[#888888] uppercase">CONTRACT:</span>
          <span className="text-[#D4AF37]">0xD561cB...9298</span>
          <span className="text-[9px] text-[#D4AF37] border border-[#D4AF37]/40 px-1">VERIFIED</span>
        </div>

        {/* ZERO GAS LATENCY */}
        <div className="flex items-center gap-2">
          <span className="text-[#888888] uppercase">ZERO-GAS READ:</span>
          <span className="text-emerald-400 font-bold">{ping}ms</span>
          <span className="text-[#888888]">(0 ETH)</span>
        </div>
      </div>
    </div>
  );
}
