import { Router } from 'express';
import multer from 'multer';
import pinataSDK from '@pinata/sdk';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Initialize Pinata
const pinata = new pinataSDK({
  pinataApiKey: process.env.PINATA_API_KEY,
  pinataSecretApiKey: process.env.PINATA_SECRET_API_KEY
});

// Test connection on startup
pinata.testAuthentication().then(result => {
  console.log('✅ Pinata connected:', result.authenticated);
}).catch(err => {
  console.error('❌ Pinata connection failed:', err);
});

// Upload single image
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const result = await pinata.pinFileToIPFS(req.file.buffer, {
      pinataMetadata: {
        name: `auction-${Date.now()}`,
        keyvalues: {
          type: 'auction-image',
          timestamp: Date.now().toString()
        }
      },
      pinataOptions: {
        cidVersion: 1
      }
    });

    res.json({
      success: true,
      ipfsHash: result.IpfsHash,
      url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
      size: req.file.size
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Upload multiple images
router.post('/images', upload.array('images', 5), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploads = await Promise.all(files.map(async (file, index) => {
      const result = await pinata.pinFileToIPFS(file.buffer, {
        pinataMetadata: {
          name: `auction-${Date.now()}-${index}`,
          keyvalues: {
            type: 'auction-image',
            index: index.toString(),
            timestamp: Date.now().toString()
          }
        }
      });
      
      return {
        ipfsHash: result.IpfsHash,
        url: `https://gateway.pinata.cloud/ipfs/${result.IpfsHash}`,
        filename: file.originalname,
        size: file.size
      };
    }));

    res.json({
      success: true,
      uploads
    });

  } catch (error) {
    console.error('Batch upload error:', error);
    res.status(500).json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete/unpin image (optional)
router.delete('/image/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    await pinata.unpin(hash);
    res.json({ success: true, message: 'File unpinned' });
  } catch (error) {
    res.status(500).json({ error: 'Unpin failed' });
  }
});

export default router;
