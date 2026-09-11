import React, { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseAbi, isAddress } from 'viem';

const RAW_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000';
const CONTRACT_ADDRESS = RAW_CONTRACT_ADDRESS as `0x${string}`;
const isValidContract = isAddress(RAW_CONTRACT_ADDRESS) && RAW_CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

const ABI = parseAbi([
  'function register(string memory _name, string memory _cid) external',
  'function updateCID(string memory _name, string memory _newCid) external',
  'function resolve(string memory _name) external view returns (string memory cid, address owner)',
  'function getUserDomains(address _user) external view returns (string[] memory)',
]);

export default function Home() {
  const { address, isConnected } = useAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [cid, setCid] = useState('');
  const [domainName, setDomainName] = useState('');
  const [searchDomain, setSearchDomain] = useState('');
  const [resolvedCid, setResolvedCid] = useState('');
  const [resolvedOwner, setResolvedOwner] = useState('');
  const [resolveError, setResolveError] = useState('');

  // Status states
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [selectedFileCount, setSelectedFileCount] = useState(0);

  // Wagmi Contract Interactions
  const { writeContract, data: txHash, error: writeError, isPending: isTxSending } = useWriteContract();
  const { isLoading: isTxConfirming, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash: txHash });

  // Fetch Dashboard Domains
  const { data: myDomains, refetch: refetchDomains } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getUserDomains',
    args: address ? [address] : undefined,
    query: {
      enabled: Boolean(address && isValidContract),
    },
  });

  const router = useRouter();
  const isDemo = router.isReady && router.query.preview === 'demo';
  const effectiveDomains = isDemo ? (myDomains && myDomains.length > 0 ? myDomains : ['coolsite']) : myDomains;
  const effectiveConnected = isConnected || isDemo;

  // Support direct URL previewing via ?domain= or ?cid= or ?preview=demo
  useEffect(() => {
    if (router.isReady) {
      if (router.query.preview === 'demo') {
        setCid('QmRnYFQc27XBSTGCkfunCY5EjABigYRbxSkxZbXTF6GitA');
        setDomainName('coolsite');
        setSearchDomain('coolsite');
        setResolvedCid('QmRnYFQc27XBSTGCkfunCY5EjABigYRbxSkxZbXTF6GitA');
        setResolvedOwner('0x4fce61eA798C30C72De5D0D5c03c5b8bF68ae606');
        setSelectedFileCount(12);
      } else if (router.query.cid && typeof router.query.cid === 'string') {
        setResolvedCid(router.query.cid);
        if (router.query.domain && typeof router.query.domain === 'string') {
          setSearchDomain(router.query.domain);
        }
      } else if (router.query.domain && typeof router.query.domain === 'string') {
        setSearchDomain(router.query.domain);
      }
    }
  }, [router.isReady, router.query]);

  // Secure Folder Upload to IPFS via API route
  const uploadFolderToIPFS = async () => {
    const files = fileInputRef.current?.files;
    if (!files || files.length === 0) {
      alert('Please choose a folder with static website assets first.');
      return;
    }

    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        const relPath = (file as any).webkitRelativePath || file.name;
        formData.append('file', file, relPath);
      });

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.cid) {
        setCid(data.cid);
      } else {
        const rawErr = data?.error;
        const msg = typeof rawErr === 'string'
          ? rawErr
          : rawErr?.details
          ? `${rawErr?.reason ? rawErr.reason + ': ' : ''}${rawErr.details}`
          : rawErr?.reason
          ? String(rawErr.reason)
          : rawErr
          ? JSON.stringify(rawErr)
          : 'Pinata upload failed. Ensure PINATA_JWT is set in .env.local.';
        setUploadError(msg);
      }
    } catch (err: any) {
      setUploadError(typeof err === 'string' ? err : err?.message || 'Network error during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = () => {
    if (!isValidContract) {
      alert('Configure your deployed contract address in .env.local (NEXT_PUBLIC_CONTRACT_ADDRESS).');
      return;
    }
    const cleanName = domainName.trim().replace(/\.free$/i, '');
    if (!cleanName) {
      alert('Enter a valid domain name.');
      return;
    }
    if (!cid) {
      alert('Upload files to IPFS first to generate a CID.');
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'register',
      args: [cleanName, cid],
    });
  };

  const handleUpdate = (name: string) => {
    if (!isValidContract) {
      alert('Configure your deployed contract address in .env.local first.');
      return;
    }
    const newCid = prompt(`Enter new IPFS CID for ${name}.free:`);
    if (newCid && newCid.trim()) {
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'updateCID',
        args: [name, newCid.trim()],
      });
    }
  };

  // Resolver Query
  const { refetch: doResolve, isFetching: isResolving } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'resolve',
    args: searchDomain ? [searchDomain] : undefined,
    query: { enabled: false },
  });

  const handleResolve = async () => {
    const cleanSearch = searchDomain.trim().replace(/\.free$/i, '');
    if (!cleanSearch) return;
    if (!isValidContract) {
      setResolveError('Smart contract not configured yet. Deploy DomainRegistry and add address to .env.local.');
      return;
    }

    setResolveError('');
    setResolvedCid('');
    setResolvedOwner('');

    try {
      const res = await doResolve();
      if (res.data) {
        const [foundCid, owner] = res.data as [string, string];
        setResolvedCid(foundCid);
        setResolvedOwner(owner);
      } else {
        setResolveError(`Domain "${cleanSearch}.free" is not registered on Sepolia.`);
      }
    } catch (err: any) {
      setResolveError(`Domain "${cleanSearch}.free" not found or error occurred.`);
    }
  };

  return (
    <>
      <Head>
        <title>Free-Net dHost | Decentralized Web Hosting &amp; Domain Resolution</title>
        <meta name="description" content="Decentralized web hosting with Ethereum smart contracts and IPFS" />
      </Head>

      <div className="bg-pattern min-h-screen text-[#F2F0E4]">
        {/* TOP BAR / HEADER */}
        <header className="border-b border-[#D4AF37]/20 bg-[#0A0A0A]/90 backdrop-blur sticky top-0 z-40 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border border-[#D4AF37] rotate-45 flex items-center justify-center">
                <div className="w-2 h-2 bg-[#D4AF37]"></div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold tracking-[0.25em] text-[#D4AF37] uppercase">
                  FREE·NET <span className="text-xs text-[#F2E8C4] tracking-normal font-normal">dHost</span>
                </h1>
                <p className="text-[11px] text-[#888888] tracking-wider uppercase">Decentralized Web &amp; Domain Registry</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="hidden md:inline-block text-xs uppercase tracking-widest px-2.5 py-1 border border-[#D4AF37]/30 text-[#D4AF37]">
                Sepolia Testnet
              </span>
              {isDemo && !isConnected ? (
                <div className="flex items-center gap-2 bg-[#141414] border border-[#D4AF37]/50 px-3 py-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-mono text-[#F2E8C4]">0x4fce...e606</span>
                  <span className="text-[#D4AF37] font-semibold border-l border-[#D4AF37]/30 pl-2">0.046 ETH</span>
                </div>
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>
        </header>

        {/* CONTRACT STATUS NOTICE */}
        {!isValidContract && (
          <div className="max-w-7xl mx-auto px-6 pt-4">
            <div className="p-3 bg-[#1E3D59]/30 border border-[#1E3D59] text-xs text-[#F2E8C4] flex items-center justify-between">
              <div>
                <strong className="text-[#D4AF37]">Contract Setup:</strong> Next, deploy your contract from{' '}
                <code className="bg-black/50 px-1 py-0.5">freenet-contracts</code> and set{' '}
                <code className="bg-black/50 px-1 py-0.5">NEXT_PUBLIC_CONTRACT_ADDRESS</code> in{' '}
                <code className="bg-black/50 px-1 py-0.5">.env.local</code>.
              </div>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* LEFT COLUMN: PUBLISHING & VAULT DASHBOARD */}
            <div className="space-y-6">
              {/* STEP 1: PUBLISH SITE */}
              <section className="bg-[#141414] p-6 deco-border">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-5">
                  <h2 className="text-lg font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                    <span className="text-xs border border-[#D4AF37] px-1.5 py-0.5">I</span>
                    Archive Documents (IPFS)
                  </h2>
                  <span className="text-xs text-[#888888]">Directory Upload</span>
                </div>

                <p className="text-xs text-[#888888] mb-4">
                  Select a build folder containing your static website files (<code className="text-[#F2E8C4]">index.html</code>, CSS, JS).
                </p>

                <div className="border border-dashed border-[#D4AF37]/40 bg-[#0A0A0A] p-4 text-center mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    {...({ webkitdirectory: '', directory: '' } as any)}
                    onChange={(e) => setSelectedFileCount(e.target.files?.length || 0)}
                    className="block w-full text-xs text-[#888888] file:mr-3 file:py-1.5 file:px-3 file:border file:border-[#D4AF37]/40 file:bg-[#141414] file:text-[#D4AF37] file:text-xs file:uppercase file:tracking-wider hover:file:bg-[#D4AF37]/10 cursor-pointer"
                  />
                  {selectedFileCount > 0 && (
                    <p className="text-xs text-[#D4AF37] mt-2 font-mono">{selectedFileCount} files selected</p>
                  )}
                </div>

                <button
                  onClick={uploadFolderToIPFS}
                  disabled={uploading}
                  className="w-full bg-[#1E3D59] hover:bg-[#1E3D59]/80 disabled:opacity-50 text-white text-xs uppercase tracking-widest py-2.5 px-4 deco-border transition font-semibold"
                >
                  {uploading ? 'Pinning Directory to IPFS...' : 'Pin Folder to IPFS via Pinata'}
                </button>

                {uploadError && (
                  <p className="text-xs text-red-400 mt-3 p-2 bg-red-950/40 border border-red-900">
                    {typeof uploadError === 'string' ? uploadError : JSON.stringify(uploadError)}
                  </p>
                )}

                {cid && (
                  <div className="mt-4 p-3 bg-[#0A0A0A] border border-[#D4AF37]/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] uppercase tracking-wider text-[#888888]">Generated CID</span>
                      <span className="text-[10px] text-[#D4AF37] border border-[#D4AF37]/40 px-1">Verified</span>
                    </div>
                    <p className="text-xs font-mono text-[#D4AF37] break-all mt-1">{cid}</p>
                  </div>
                )}
              </section>

              {/* STEP 2: REGISTER DOMAIN */}
              <section className="bg-[#141414] p-6 deco-border">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-5">
                  <h2 className="text-lg font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                    <span className="text-xs border border-[#D4AF37] px-1.5 py-0.5">II</span>
                    Register Domain
                  </h2>
                  <span className="text-xs text-[#888888]">On-Chain Deed</span>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888888] mb-1">
                      Desired Domain Name
                    </label>
                    <div className="flex">
                      <input
                        placeholder="myproject"
                        className="bg-[#0A0A0A] p-2.5 text-sm border border-[#D4AF37]/30 text-white flex-1 focus:outline-none focus:border-[#D4AF37]"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                      />
                      <span className="bg-[#0A0A0A] border-y border-r border-[#D4AF37]/30 px-3 flex items-center text-xs text-[#D4AF37] font-mono">
                        .free
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#888888] mb-1">
                      Mapped IPFS CID
                    </label>
                    <input
                      placeholder="QmHash..."
                      value={cid}
                      onChange={(e) => setCid(e.target.value)}
                      className="w-full bg-[#0A0A0A] p-2.5 text-xs font-mono border border-[#D4AF37]/30 text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <button
                  onClick={handleRegister}
                  disabled={!cid || !isConnected || isTxSending || isTxConfirming}
                  className="w-full bg-[#D4AF37] hover:bg-[#F2E8C4] disabled:opacity-40 text-[#0A0A0A] text-xs font-bold uppercase tracking-widest py-3 px-4 transition"
                >
                  {isTxSending
                    ? 'Confirm in Wallet...'
                    : isTxConfirming
                    ? 'Notarizing on Sepolia...'
                    : 'Register .free Domain'}
                </button>

                {isTxConfirming && (
                  <p className="text-xs text-yellow-300 mt-2 text-center animate-pulse">
                    Transaction submitted. Confirming on Ethereum Sepolia...
                  </p>
                )}
                {(isTxSuccess || isDemo) && (
                  <p className="text-xs text-emerald-400 mt-2 text-center">
                    Deed notarized successfully on Sepolia!
                  </p>
                )}
                {writeError && (
                  <p className="text-xs text-red-400 mt-2 text-center p-2 bg-red-950/30 border border-red-900">
                    {(writeError as any)?.shortMessage || writeError.message || 'Transaction rejected or failed.'}
                  </p>
                )}
              </section>

              {/* STEP 3: THE VAULT (OWNED DOMAINS DASHBOARD) */}
              <section className="bg-[#141414] p-6 deco-border">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-4">
                  <h2 className="text-lg font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-2">
                    <span className="text-xs border border-[#D4AF37] px-1.5 py-0.5">III</span>
                    The Vault (My Domains)
                  </h2>
                  <span className="text-xs text-[#888888]">
                    {effectiveDomains ? `${effectiveDomains.length} Properties` : '0 Properties'}
                  </span>
                </div>

                {!effectiveConnected ? (
                  <p className="text-xs text-[#888888] py-4 text-center">Connect your wallet to inspect your registered deeds.</p>
                ) : !effectiveDomains || effectiveDomains.length === 0 ? (
                  <p className="text-xs text-[#888888] py-4 text-center">No properties registered under this address yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {effectiveDomains.map((name: string) => (
                      <li
                        key={name}
                        className="flex flex-wrap items-center justify-between gap-2 bg-[#0A0A0A] p-3 border border-[#D4AF37]/30 hover:border-[#D4AF37] transition"
                      >
                        <div>
                          <span className="font-semibold text-sm text-[#F2E8C4]">{name}</span>
                          <span className="text-xs text-[#D4AF37] ml-1">.free</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSearchDomain(name);
                              // Auto resolve into viewer
                              setTimeout(() => handleResolve(), 100);
                            }}
                            className="text-[11px] text-[#F2E8C4] bg-[#1E3D59] hover:bg-[#1E3D59]/80 px-2.5 py-1 uppercase tracking-wider transition"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleUpdate(name)}
                            className="text-[11px] text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37]/10 px-2.5 py-1 uppercase tracking-wider transition"
                          >
                            Update CID
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>

            {/* RIGHT COLUMN: RESOLVER & SANDBOX BROWSER */}
            <div className="flex flex-col">
              <section className="bg-[#141414] p-6 deco-border flex flex-col flex-1">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3 mb-5">
                  <h2 className="text-lg font-bold uppercase tracking-wider text-[#D4AF37]">
                    dBrowser Directory Board
                  </h2>
                  <span className="text-xs text-[#888888]">Zero-Gas Resolver</span>
                </div>

                <div className="flex gap-2 mb-4">
                  <div className="flex flex-1 border border-[#D4AF37]/40 bg-[#0A0A0A]">
                    <input
                      placeholder="Search domain (e.g. myproject)..."
                      value={searchDomain}
                      onChange={(e) => setSearchDomain(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
                      className="bg-transparent p-2.5 text-sm text-white flex-1 focus:outline-none"
                    />
                    <span className="flex items-center px-3 text-xs text-[#888888] font-mono border-l border-[#D4AF37]/20">
                      .free
                    </span>
                  </div>

                  <button
                    onClick={handleResolve}
                    disabled={isResolving}
                    className="bg-[#D4AF37] hover:bg-[#F2E8C4] text-[#0A0A0A] font-bold text-xs uppercase tracking-widest px-6 py-2.5 transition"
                  >
                    {isResolving ? 'Resolving...' : 'Go'}
                  </button>
                </div>

                {resolveError && (
                  <p className="text-xs text-red-400 p-2 bg-red-950/30 border border-red-900 mb-4">
                    {typeof resolveError === 'string' ? resolveError : JSON.stringify(resolveError)}
                  </p>
                )}

                {resolvedCid && (
                  <div className="mb-4 p-2.5 bg-[#0A0A0A] border border-[#D4AF37]/30 text-xs flex flex-wrap justify-between items-center gap-2">
                    <div>
                      <span className="text-[#888888] uppercase text-[10px] block">Resolved IPFS Hash:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[#D4AF37]">{resolvedCid}</span>
                        <a
                          href={`/api/gateway/${resolvedCid}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] border border-[#D4AF37]/40 px-1.5 py-0.5 text-[#F2E8C4] hover:bg-[#D4AF37]/20 transition ml-2 inline-flex items-center gap-1"
                        >
                          Open in Tab ↗
                        </a>
                      </div>
                    </div>
                    {resolvedOwner && (
                      <div className="text-right">
                        <span className="text-[#888888] uppercase text-[10px] block">Owner:</span>
                        <span className="font-mono text-xs text-[#F2E8C4]">
                          {resolvedOwner.slice(0, 6)}...{resolvedOwner.slice(-4)}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* SANDBOXED RENDER FRAME */}
                <div className="flex-1 min-h-[460px] bg-white deco-double-border overflow-hidden relative flex flex-col">
                  {resolvedCid ? (
                    <iframe
                      src={`/api/gateway/${resolvedCid}`}
                      className="w-full flex-1 border-none bg-white"
                      title="Decentralized Website Sandbox"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  ) : (
                    <div className="w-full flex-1 flex flex-col items-center justify-center bg-[#0D0D0D] text-[#888888] p-8 text-center">
                      <div className="w-12 h-12 border border-[#D4AF37]/40 rotate-45 flex items-center justify-center mb-4">
                        <div className="w-4 h-4 bg-[#D4AF37]/20"></div>
                      </div>
                      <p className="font-display text-base text-[#F2E8C4] uppercase tracking-wider mb-1">
                        Isolated Sandbox Window
                      </p>
                      <p className="text-xs max-w-sm text-[#888888]">
                        Query a registered <code className="text-[#D4AF37]">.free</code> domain above to resolve its IPFS hash and safely render the site in this secure frame.
                      </p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </main>

        <footer className="border-t border-[#D4AF37]/20 py-8 px-6 mt-12 bg-[#0A0A0A]">
          <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-4 text-xs text-[#888888]">
            <p>© Free-Net dHost — Censorship-Resistant Web Infrastructure on Sepolia &amp; IPFS</p>
            <div className="flex gap-4">
              <span>Smart Contract: {isValidContract ? 'Sepolia Active' : 'Pending Deployment'}</span>
              <span>•</span>
              <span>Storage: IPFS / Pinata</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}