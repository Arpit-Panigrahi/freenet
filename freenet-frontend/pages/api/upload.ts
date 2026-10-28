import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import FormData from 'form-data';

export const config = {
  api: { bodyParser: false } // Required for formidable
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const form = formidable({ multiples: true });

  return new Promise<void>((resolve) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        res.status(500).json({ error: 'Form parse failed' });
        return resolve();
      }

      try {
        const pinataData = new FormData();
        const rawFile = files.file || files['file[]'] || Object.values(files)[0];
        const fileArray = Array.isArray(rawFile) ? rawFile : [rawFile];

        if (!fileArray || fileArray.length === 0 || !fileArray[0]) {
          res.status(400).json({ error: 'No files provided in upload' });
          return resolve();
        }

        // Append all files in the directory to Pinata maintaining folder structure
        fileArray.forEach((f: any) => {
          const filePath = f.filepath || f.path;
          const rawName = f.originalFilename || f.newFilename || 'index.html';
          const cleanName = rawName.replace(/^[/\\]+/, '');
          const pinataPath = cleanName.startsWith('site/') ? cleanName : `site/${cleanName}`;

          pinataData.append('file', fs.readFileSync(filePath), {
            filepath: pinataPath,
          });
        });

        pinataData.append('pinataMetadata', JSON.stringify({ name: `freenet-site-${Date.now()}` }));

        const pinataJwt = process.env.PINATA_JWT;
        if (!pinataJwt) {
          res.status(500).json({ 
            error: 'PINATA_JWT is not configured. Please set PINATA_JWT in .env.local.' 
          });
          return resolve();
        }

        const pinataRes = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${pinataJwt}`,
            ...pinataData.getHeaders(),
          },
          body: pinataData.getBuffer() as any,
        });

        const json: any = await pinataRes.json();

        let errorMsg = 'Pinata upload failed';
        if (typeof json?.error === 'string') {
          errorMsg = json.error;
        } else if (json?.error?.details || json?.error?.reason) {
          errorMsg = [json.error.reason, json.error.details].filter(Boolean).join(': ');
        } else if (json?.error?.message) {
          errorMsg = json.error.message;
        } else if (json?.message) {
          errorMsg = typeof json.message === 'string' ? json.message : JSON.stringify(json.message);
        }

        if (!pinataRes.ok) {
          res.status(pinataRes.status).json({
            error: errorMsg,
            details: json
          });
          return resolve();
        }

        res.status(200).json({ cid: json.IpfsHash });
        return resolve();
      } catch (error: any) {
        res.status(500).json({ error: error?.message || 'Pinata upload failed' });
        return resolve();
      }
    });
  });
}