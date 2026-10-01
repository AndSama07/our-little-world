const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

function crc32(buf) {
  let table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    table[i] = c;
  }
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const chunk = Buffer.alloc(len + 12);
  chunk.writeUInt32BE(len, 0);
  chunk.write(type, 4);
  data.copy(chunk, 8);
  const crc = crc32(chunk.subarray(4, len + 8));
  chunk.writeUInt32BE(crc, len + 8);
  return chunk;
}

function generateIconPNG(size) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc((width * 4 + 1) * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    rawData[rowOffset] = 0; // Filter byte: None

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;
      
      // Normalized coordinates [-1, 1]
      const nx = (x - width / 2) / (width / 2);
      const ny = (y - height / 2) / (height / 2);

      // Squircle distance for app icon corners
      const cornerPower = 4.2;
      const squircleDist = Math.pow(Math.abs(nx), cornerPower) + Math.pow(Math.abs(ny), cornerPower);

      let r = 11, g = 15, b = 25, a = 255;

      if (squircleDist > 1.0) {
        // Transparent outside squircle
        a = 0;
      } else {
        // Base dark background gradient with night blues
        const bgGrad = (ny + 1) / 2;
        r = Math.round(18 - bgGrad * 8);
        g = Math.round(26 - bgGrad * 12);
        b = Math.round(44 - bgGrad * 20);

        // Rose glow from top left
        const roseDist = Math.hypot(nx + 0.35, ny + 0.3);
        const roseFactor = Math.max(0, 1 - roseDist * 1.15);
        r = Math.min(255, Math.round(r + roseFactor * 90));
        g = Math.min(255, Math.round(g + roseFactor * 20));
        b = Math.min(255, Math.round(b + roseFactor * 45));

        // Soft blue glow from bottom right
        const blueDist = Math.hypot(nx - 0.45, ny - 0.4);
        const blueFactor = Math.max(0, 1 - blueDist * 1.2);
        r = Math.min(255, Math.round(r + blueFactor * 20));
        g = Math.min(255, Math.round(g + blueFactor * 70));
        b = Math.min(255, Math.round(b + blueFactor * 110));

        // Central Heart Shape
        // Invert y so positive is up, scale and shift
        const hx = nx * 1.6;
        const hy = - (ny * 1.6 - 0.22);
        const heartEq = Math.pow(hx * hx + hy * hy - 0.45, 3) - (hx * hx) * Math.pow(hy, 3);

        if (heartEq <= 0.08) {
          // Heart color (rose #f43f5e) with gradient
          const heartGrad = (hy + 0.6) / 1.2;
          r = Math.min(255, Math.round(244 + heartGrad * 10));
          g = Math.min(255, Math.round(63 + heartGrad * 45));
          b = Math.min(255, Math.round(94 + heartGrad * 50));

          // Inner highlight
          if (heartEq < -0.12) {
            r = Math.min(255, r + 25);
            g = Math.min(255, g + 35);
            b = Math.min(255, b + 40);
          }
        }

        // Golden Spark at top of heart
        const sparkDist = Math.hypot(nx, ny + 0.35);
        if (sparkDist < 0.12) {
          const sparkFactor = (1 - sparkDist / 0.12);
          r = Math.min(255, Math.round(r + sparkFactor * 251));
          g = Math.min(255, Math.round(g + sparkFactor * 191));
          b = Math.min(255, Math.round(b + sparkFactor * 36));
        }

        // Border stroke near edge of squircle
        if (squircleDist > 0.94 && squircleDist <= 1.0) {
          const borderAlpha = (1 - Math.abs(squircleDist - 0.97) / 0.03) * 0.35;
          r = Math.round(r * (1 - borderAlpha) + 255 * borderAlpha);
          g = Math.round(g * (1 - borderAlpha) + 255 * borderAlpha);
          b = Math.round(b * (1 - borderAlpha) + 255 * borderAlpha);
        }
      }

      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idatData = zlib.deflateSync(rawData);
  const header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', idatData);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

const iconsDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate 192x192
const p192 = generateIconPNG(192);
fs.writeFileSync(path.join(iconsDir, 'icon-192.png'), p192);
console.log('Generated icons/icon-192.png (' + p192.length + ' bytes)');

// Generate 512x512
const p512 = generateIconPNG(512);
fs.writeFileSync(path.join(iconsDir, 'icon-512.png'), p512);
console.log('Generated icons/icon-512.png (' + p512.length + ' bytes)');
