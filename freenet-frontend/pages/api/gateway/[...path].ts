import type { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const pathArray = Array.isArray(path) ? path : [path];
  const ipfsPath = pathArray.filter(Boolean).join('/');

  if (!ipfsPath) {
    return res.status(400).send('Missing IPFS CID or path');
  }

  const pinataJwt = process.env.PINATA_JWT;
  const targetUrl = `https://gateway.pinata.cloud/ipfs/${ipfsPath}`;

  try {
    let response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 FreeNet-dHost',
        ...(pinataJwt ? { Authorization: `Bearer ${pinataJwt}` } : {}),
      },
    });

    // If root failed with 403/404 and it's a top-level CID, test common subdirectories
    if (!response.ok && pathArray.length === 1) {
      for (const sub of ['VIT', 'site', 'index.html']) {
        const subRes = await fetch(`https://gateway.pinata.cloud/ipfs/${ipfsPath}/${sub}`, {
          headers: {
            'User-Agent': 'Mozilla/5.0 FreeNet-dHost',
            ...(pinataJwt ? { Authorization: `Bearer ${pinataJwt}` } : {}),
          },
        });
        if (subRes.ok) {
          response = subRes;
          break;
        }
      }
    }

    if (!response.ok) {
      return res.status(response.status).send(`IPFS Gateway responded with ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || 'text/html';
    res.setHeader('Content-Type', contentType);
    // Allow iframe embedding from our app
    res.removeHeader('X-Frame-Options');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Rewrite internal links so clicking links in the directory listing navigates through the proxy
    if (contentType.includes('text/html')) {
      let html = await response.text();
      html = html.replaceAll('/ipfs/', '/api/gateway/');
      return res.send(html);
    }

    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error: any) {
    return res.status(500).send(`Gateway proxy error: ${error?.message}`);
  }
}