import React, { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureBriefingModal({ isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'paradigm' | 'pillars' | 'flow' | 'components'>('paradigm');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="bg-[#0E0E0E] text-[#F2F0E4] border border-[#D4AF37]/50 max-w-5xl w-full rounded-none shadow-2xl relative my-8 flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          boxShadow: '0 0 35px rgba(212, 175, 55, 0.15), 0 0 0 1px rgba(212, 175, 55, 0.3)'
        }}
      >
        {/* MODAL HEADER */}
        <div className="border-b border-[#D4AF37]/30 bg-[#141414] px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border border-[#D4AF37] rotate-45 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#D4AF37]"></div>
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-[0.2em] text-[#D4AF37] uppercase font-display">
                System Architecture &amp; Technical Briefing
              </h2>
              <p className="text-[11px] text-[#888888] tracking-wider uppercase">
                Free-Net dHost — Conceptual &amp; Technical Architecture Guide
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-[#888888] hover:text-[#D4AF37] border border-[#D4AF37]/30 hover:border-[#D4AF37] px-3 py-1 uppercase tracking-widest transition cursor-pointer"
          >
            Close [Esc] ✕
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex flex-wrap border-b border-[#D4AF37]/20 bg-[#0A0A0A] px-6">
          <button
            onClick={() => setActiveTab('paradigm')}
            className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'paradigm'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#141414]'
                : 'border-transparent text-[#888888] hover:text-[#F2E8C4]'
            }`}
          >
            1. The Paradigm Shift
          </button>
          <button
            onClick={() => setActiveTab('pillars')}
            className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'pillars'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#141414]'
                : 'border-transparent text-[#888888] hover:text-[#F2E8C4]'
            }`}
          >
            2. The 4 Core Pillars
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'flow'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#141414]'
                : 'border-transparent text-[#888888] hover:text-[#F2E8C4]'
            }`}
          >
            3. End-to-End Data Flow
          </button>
          <button
            onClick={() => setActiveTab('components')}
            className={`py-3 px-4 text-xs uppercase tracking-wider font-semibold border-b-2 transition cursor-pointer ${
              activeTab === 'components'
                ? 'border-[#D4AF37] text-[#D4AF37] bg-[#141414]'
                : 'border-transparent text-[#888888] hover:text-[#F2E8C4]'
            }`}
          >
            4. Component Walkthrough
          </button>
        </div>

        {/* MODAL CONTENT BODY */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm leading-relaxed text-[#DDD]">
          {/* TAB 1: THE PARADIGM SHIFT */}
          {activeTab === 'paradigm' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-[#141414] border-l-2 border-[#D4AF37]">
                <h3 className="text-base font-bold text-[#D4AF37] uppercase tracking-wide mb-1 font-display">
                  The Core Metaphor: Renting vs. Sovereign Ownership
                </h3>
                <p className="text-xs text-[#AAA]">
                  In Web2, developers <span className="text-[#F2E8C4] font-semibold">rent</span> their presence. In Free-Net dHost, developers <span className="text-[#D4AF37] font-semibold">own</span> their infrastructure via cryptographic deeds and decentralized storage.
                </p>
              </div>

              {/* COMPARISON GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#121212] border border-red-950/40">
                  <h4 className="text-xs uppercase tracking-widest text-red-400 font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Traditional Centralized Web (Web2)
                  </h4>
                  <ul className="text-xs space-y-2.5 text-[#AAA]">
                    <li><strong className="text-white">Single Point of Failure:</strong> Cloud host outages (AWS, Vercel) immediately take down websites.</li>
                    <li><strong className="text-white">Arbitrary Domain Censorship:</strong> Registrars (ICANN, GoDaddy) can unilaterally seize or suspend domains upon request.</li>
                    <li><strong className="text-white">Silent Data Tampering:</strong> Content stored on HTTP servers can be altered without users knowing.</li>
                    <li><strong className="text-white">Location Addressing:</strong> URLs point to physical IP addresses. If the server dies, you get Error 404.</li>
                  </ul>
                </div>

                <div className="p-4 bg-[#121212] border border-[#D4AF37]/30">
                  <h4 className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Free-Net dHost (Web3 Architecture)
                  </h4>
                  <ul className="text-xs space-y-2.5 text-[#AAA]">
                    <li><strong className="text-white">Distributed Resiliency:</strong> Hosted on IPFS peer-to-peer network nodes globally with zero central choke points.</li>
                    <li><strong className="text-white">Sovereign Domain Deeds:</strong> Domain ownership is recorded in a Solidity smart contract on Ethereum Sepolia. Only private keys can modify them.</li>
                    <li><strong className="text-white">Cryptographic Content Addressing:</strong> Every file folder produces a deterministic CID (Content ID). Changing even 1 byte changes the hash completely.</li>
                    <li><strong className="text-white">Zero-Gas Resolution:</strong> Anyone can resolve and view `.free` websites without paying gas fees or needing a wallet.</li>
                  </ul>
                </div>
              </div>

              {/* EVERYDAY ANALOGY */}
              <div className="p-4 bg-[#0A0A0A] border border-[#D4AF37]/20">
                <h4 className="text-xs uppercase tracking-widest text-[#F2E8C4] font-semibold mb-2">
                  💡 Everyday Analogy: The Library vs. The ISBN
                </h4>
                <p className="text-xs text-[#888888] leading-normal">
                  <span className="text-[#F2E8C4]">Location Addressing (Web2)</span> is like saying: <em>&quot;Go to shelf 4, row 2 in the city library.&quot;</em> If the library closes or someone moves the book, it&apos;s gone.<br />
                  <span className="text-[#D4AF37]">Content Addressing (IPFS)</span> is like saying: <em>&quot;Bring me the book with ISBN 978-0132350884.&quot;</em> It doesn&apos;t matter who delivers it or which shelf it was on; the cryptographic fingerprint ensures you get the exact, untampered book.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: THE 4 CORE PILLARS */}
          {activeTab === 'pillars' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* PILLAR 1 */}
                <div className="p-4 bg-[#141414] border border-[#D4AF37]/30">
                  <span className="text-[10px] text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 uppercase tracking-wider">Pillar 1</span>
                  <h4 className="text-sm font-bold text-[#F2E8C4] mt-2 mb-1">IPFS &amp; UnixFS DAG Storage</h4>
                  <p className="text-xs text-[#888888] mb-3">
                    Static web builds (HTML, CSS, JS) are packaged into a Merkle Directed Acyclic Graph (DAG) and pinned to the IPFS network via Pinata.
                  </p>
                  <div className="text-[11px] bg-black/60 p-2 border border-[#D4AF37]/20 font-mono text-[#D4AF37]">
                    CID: QmRnYFQc27XBSTGCkfunCY5EjABigYRbxSkxZbXTF6GitA
                  </div>
                </div>

                {/* PILLAR 2 */}
                <div className="p-4 bg-[#141414] border border-[#D4AF37]/30">
                  <span className="text-[10px] text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 uppercase tracking-wider">Pillar 2</span>
                  <h4 className="text-sm font-bold text-[#F2E8C4] mt-2 mb-1">Solidity Smart Contract Registry</h4>
                  <p className="text-xs text-[#888888] mb-3">
                    Deployed at <code className="text-[#D4AF37]">0xD561cB8E...</code> on Sepolia. Maintains a public mapping: <code className="text-[#F2E8C4]">name =&gt; (CID, Owner)</code> with strict ownership checks.
                  </p>
                  <div className="text-[11px] bg-black/60 p-2 border border-[#D4AF37]/20 font-mono text-[#F2E8C4]">
                    require(registry[_name].owner == msg.sender, &quot;Unauthorized&quot;)
                  </div>
                </div>

                {/* PILLAR 3 */}
                <div className="p-4 bg-[#141414] border border-[#D4AF37]/30">
                  <span className="text-[10px] text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 uppercase tracking-wider">Pillar 3</span>
                  <h4 className="text-sm font-bold text-[#F2E8C4] mt-2 mb-1">Zero-Gas Contract Resolver</h4>
                  <p className="text-xs text-[#888888] mb-3">
                    Reading from the blockchain via <code className="text-[#D4AF37]">resolve(name)</code> is a Solidity <code className="text-[#F2E8C4]">view</code> function. No gas fees, no wallet signatures required to browse!
                  </p>
                  <div className="text-[11px] bg-black/60 p-2 border border-[#D4AF37]/20 font-mono text-emerald-400">
                    Cost: 0 ETH | Latency: ~100ms | Auth: Public
                  </div>
                </div>

                {/* PILLAR 4 */}
                <div className="p-4 bg-[#141414] border border-[#D4AF37]/30">
                  <span className="text-[10px] text-[#D4AF37] border border-[#D4AF37]/40 px-1.5 py-0.5 uppercase tracking-wider">Pillar 4</span>
                  <h4 className="text-sm font-bold text-[#F2E8C4] mt-2 mb-1">In-App Streaming Gateway Proxy</h4>
                  <p className="text-xs text-[#888888] mb-3">
                    Public IPFS gateways block browser iframes via <code className="text-red-400">X-Frame-Options: SAMEORIGIN</code>. Our Next.js proxy strips restrictive headers and streams assets securely.
                  </p>
                  <div className="text-[11px] bg-black/60 p-2 border border-[#D4AF37]/20 font-mono text-[#D4AF37]">
                    Route: /api/gateway/[...path] | Sandbox: Enabled
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: END-TO-END DATA FLOW */}
          {activeTab === 'flow' && (
            <div className="space-y-4 animate-fadeIn">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#D4AF37]">
                Sequential Architecture Lifecycle
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-[#121212] border border-[#D4AF37]/20">
                  <span className="text-xs font-bold text-[#D4AF37] border border-[#D4AF37] px-2 py-0.5">1</span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Client Folder Selection</h4>
                    <p className="text-xs text-[#888888]">Developer selects a static build directory containing <code className="text-[#D4AF37]">index.html</code>, assets, and scripts via HTML5 <code className="text-[#F2E8C4]">webkitdirectory</code>.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#121212] border border-[#D4AF37]/20">
                  <span className="text-xs font-bold text-[#D4AF37] border border-[#D4AF37] px-2 py-0.5">2</span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Server-Side Pinata Multipart Pinning</h4>
                    <p className="text-xs text-[#888888]">Client posts FormData to Next.js API route <code className="text-[#D4AF37]">/api/upload</code>. The backend attaches secret Pinata JWT and pins the folder, returning the root CID without exposing keys to the browser.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#121212] border border-[#D4AF37]/20">
                  <span className="text-xs font-bold text-[#D4AF37] border border-[#D4AF37] px-2 py-0.5">3</span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Ethereum Sepolia Deed Notarization</h4>
                    <p className="text-xs text-[#888888]">User registers domain name (e.g. <code className="text-[#D4AF37]">coolsite.free</code>). Wagmi sends transaction to <code className="text-[#F2E8C4]">registerDomain(name, cid)</code>. The contract asserts uniqueness and permanently records owner address.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#121212] border border-[#D4AF37]/20">
                  <span className="text-xs font-bold text-[#D4AF37] border border-[#D4AF37] px-2 py-0.5">4</span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Sovereign Dashboard Management (The Vault)</h4>
                    <p className="text-xs text-[#888888]">Contract view call <code className="text-[#D4AF37]">getUserDomains(user)</code> dynamically populates the user&apos;s owned properties with instant update and view capabilities.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-[#121212] border border-[#D4AF37]/20">
                  <span className="text-xs font-bold text-[#D4AF37] border border-[#D4AF37] px-2 py-0.5">5</span>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase">Zero-Gas Resolution &amp; Sandboxed Rendering</h4>
                    <p className="text-xs text-[#888888]">Visitor searches <code className="text-[#D4AF37]">coolsite.free</code> in dBrowser. Contract instantly resolves CID at zero gas. The internal gateway streams the site into an isolated iframe sandbox.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COMPONENT WALKTHROUGH */}
          {activeTab === 'components' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-[#141414] border border-[#D4AF37]/30">
                  <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold mb-2 flex items-center gap-2">
                    <span className="border border-[#D4AF37] px-1 py-0.2">I</span> Archive Documents (IPFS)
                  </h4>
                  <p className="text-xs text-[#AAA] mb-2">
                    Accepts entire directory structures. Calculates UnixFS hash and pins persistently via Pinata Cloud API.
                  </p>
                  <p className="text-[11px] text-[#888888] font-mono">
                    Key Tech: Formidable, FormData, Pinata PinByHash / PinFileToIPFS.
                  </p>
                </div>

                <div className="p-4 bg-[#141414] border border-[#D4AF37]/30">
                  <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold mb-2 flex items-center gap-2">
                    <span className="border border-[#D4AF37] px-1 py-0.2">II</span> Register Domain (Sepolia Deed)
                  </h4>
                  <p className="text-xs text-[#AAA] mb-2">
                    Notarizes `.free` domain deed to Ethereum Sepolia. Emits <code className="text-[#D4AF37]">DomainRegistered</code> event for real-time indexed tracking.
                  </p>
                  <p className="text-[11px] text-[#888888] font-mono">
                    Key Tech: Viem, Wagmi useWriteContract, useWaitForTransactionReceipt.
                  </p>
                </div>

                <div className="p-4 bg-[#141414] border border-[#D4AF37]/30">
                  <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold mb-2 flex items-center gap-2">
                    <span className="border border-[#D4AF37] px-1 py-0.2">III</span> The Vault (My Domains)
                  </h4>
                  <p className="text-xs text-[#AAA] mb-2">
                    Personal sovereign deed portfolio. Allows updating CID to point to a new release without repurchasing domains or paying transfer fees.
                  </p>
                  <p className="text-[11px] text-[#888888] font-mono">
                    Key Tech: TanStack Query, useReadContract, updateCID function.
                  </p>
                </div>

                <div className="p-4 bg-[#141414] border border-[#D4AF37]/30">
                  <h4 className="text-xs uppercase tracking-wider text-[#D4AF37] font-bold mb-2 flex items-center gap-2">
                    <span className="border border-[#D4AF37] px-1 py-0.2">IV</span> dBrowser Directory Board
                  </h4>
                  <p className="text-xs text-[#AAA] mb-2">
                    The zero-gas search and display client. Resolves on-chain record, displays verified owner, and renders the live IPFS build in a sandboxed frame.
                  </p>
                  <p className="text-[11px] text-[#888888] font-mono">
                    Key Tech: Custom Next.js Streaming Proxy, Iframe Sandbox.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="border-t border-[#D4AF37]/20 bg-[#141414] px-6 py-3 flex flex-wrap justify-between items-center gap-2 text-xs text-[#888888]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
            <span>Free-Net dHost — Sepolia Smart Contract &amp; IPFS Registry</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-[#D4AF37]">Contract: 0xD561cB8E...9298</span>
            <button
              onClick={onClose}
              className="bg-[#D4AF37] text-black font-bold uppercase tracking-wider px-3 py-1 hover:bg-[#F2E8C4] transition"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
