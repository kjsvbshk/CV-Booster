const https = require('https');
const http = require('http');
const { URL } = require('url');

const BACKEND_URL = 'https://cv-booster-backend.onrender.com';

export default async function handler(req, res) {
  // Configurar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Manejar preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Construir la URL del backend
    const backendUrl = new URL(req.url.replace('/api', ''), BACKEND_URL);
    
    // Configurar las opciones de la petición
    const options = {
      hostname: backendUrl.hostname,
      port: backendUrl.port || (backendUrl.protocol === 'https:' ? 443 : 80),
      path: backendUrl.pathname + backendUrl.search,
      method: req.method,
      headers: {
        ...req.headers,
        host: backendUrl.hostname,
        origin: BACKEND_URL,
        referer: BACKEND_URL,
      }
    };

    // Remover headers que pueden causar problemas
    delete options.headers['x-forwarded-for'];
    delete options.headers['x-forwarded-proto'];
    delete options.headers['x-forwarded-host'];

    // Crear la petición al backend
    const proxyReq = (backendUrl.protocol === 'https:' ? https : http).request(options, (proxyRes) => {
      // Copiar headers de respuesta
      Object.keys(proxyRes.headers).forEach(key => {
        res.setHeader(key, proxyRes.headers[key]);
      });

      // Configurar CORS headers en la respuesta
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      res.statusCode = proxyRes.statusCode;
      proxyRes.pipe(res);
    });

    // Manejar errores
    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.status(500).json({ 
        error: 'Proxy error', 
        message: err.message 
      });
    });

    // Enviar el body de la petición si existe
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      req.pipe(proxyReq);
    } else {
      proxyReq.end();
    }

  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error', 
      message: error.message 
    });
  }
}
