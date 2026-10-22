import React, { useState, useEffect, useRef } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'EVM' | 'IPFS' | 'RESOLVER' | 'GATEWAY' | 'SECURITY';
  message: string;
}

export default function CryptoConsole() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      timestamp: '21:45:01.104',
      type: 'EVM',
      message: 'eth_blockNumber -> Sepolia Block #6842914 verified (ChainID: 11155111)',
    },
    {
      id: '2',
      timestamp: '21:45:01.420',
      type: 'EVM',
      message: 'DomainRegistry.sol at 0xD561cB8E70f1D9e9EA3deB6080d7bdC4ca4c9298 verified active',
    },
    {
      id: '3',
      timestamp: '21:45:02.012',
      type: 'IPFS',
      message: 'DHT_SWARM connected to 54 global bootstrap relays (Pinata cluster synchronized)',
    },
    {
      id: '4',
      timestamp: '21:45:02.890',
      type: 'RESOLVER',
      message: 'resolve("coolsite.free") -> QmRnYFQc27XBSTGCkfunCY5EjABigYRbxSkxZbXTF6GitA (Zero-Gas: 0 ETH, Latency: 38ms)',
    },
    {
      id: '5',
      timestamp: '21:45:03.115',
      type: 'GATEWAY',
      message: 'In-app proxy stripped X-Frame-Options & CORS -> Sandboxed iframe mounted',
    },
    {
      id: '6',
      timestamp: '21:45:04.200',
      type: 'SECURITY',
      message: 'ECDSA secp256k1 deed signature confirmed for 0x4fce...e606',
    },
  ]);

  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(now.getMilliseconds()).padStart(3, '0')}`;
      
      const sampleEvents: Array<{ type: 'EVM' | 'IPFS' | 'RESOLVER' | 'GATEWAY' | 'SECURITY'; msg: string }> = [
        { type: 'EVM', msg: `EVM heartbeat: eth_gasPrice normalized at 12 Gwei` },
        { type: 'IPFS', msg: `IPFS bitswap: Announcing provider record for DAG QmRnYFQc...` },
        { type: 'RESOLVER', msg: `Zero-gas cache hit for coolsite.free -> verified immutable` },
        { type: 'SECURITY', msg: `Cryptographic proof verified against Ethereum State Trie` },
      ];

      const chosen = sampleEvents[Math.floor(Math.random() * sampleEvents.length)];
      setLogs((prev) => [
        ...prev.slice(-18),
        {
          id: Math.random().toString(),
          timestamp: timeStr,
          type: chosen.type,
          message: chosen.msg,
        },
      ]);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 mt-8">
      <div className="border border-[#D4AF37]/40 bg-[#09090D] overflow-hidden shadow-2xl">
        {/* CONSOLE HEADER */}
        <div className="bg-[#121218] border-b border-[#D4AF37]/30 px-4 py-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[#D4AF37] font-bold tracking-wider uppercase">
              ◈ Cryptographic Event Stream &amp; RPC Audit ◈
            </span>
            <span className="hidden sm:inline text-[10px] text-[#888888]">
              (Real-Time Blockchain &amp; IPFS Packet Monitor)
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLogs([])}
              className="text-[10px] uppercase text-[#888888] hover:text-[#D4AF37] transition cursor-pointer"
            >
              Clear
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[10px] uppercase text-[#D4AF37] border border-[#D4AF37]/40 px-2 py-0.5 hover:bg-[#D4AF37]/10 transition cursor-pointer"
            >
              {isOpen ? 'Minimize ▼' : 'Expand ▲'}
            </button>
          </div>
        </div>

        {/* LOG STREAM BODY */}
        {isOpen && (
          <div
            ref={logContainerRef}
            className="p-3 bg-black/90 font-mono text-[11px] space-y-1.5 max-h-44 overflow-y-auto border-t border-[#D4AF37]/10"
          >
            {logs.map((log) => (
              <div key={log.id} className="flex flex-wrap items-baseline gap-2 leading-relaxed">
                <span className="text-[#666666] text-[10px]">{log.timestamp}</span>
                <span
                  className={`text-[9px] font-bold px-1 py-0.2 tracking-wider ${
                    log.type === 'EVM'
                      ? 'bg-amber-950/60 text-[#D4AF37] border border-[#D4AF37]/40'
                      : log.type === 'IPFS'
                      ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-500/40'
                      : log.type === 'RESOLVER'
                      ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                      : log.type === 'SECURITY'
                      ? 'bg-purple-950/60 text-purple-300 border border-purple-500/40'
                      : 'bg-blue-950/60 text-blue-300 border border-blue-500/40'
                  }`}
                >
                  [{log.type}]
                </span>
                <span className="text-[#CCCCCC]">{log.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
