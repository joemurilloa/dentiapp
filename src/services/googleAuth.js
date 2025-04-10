import { createGoogleDriveFolders } from './googleApi';


const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/calendar'
];

export const initializeGoogleAuth = () => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => initClient(resolve, reject);
    script.onerror = (error) => reject(new Error('Error al cargar el script de Google: ' + error));
    document.head.appendChild(script);
  });
};

const initClient = (resolve, reject) => {
  try {
    window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      callback: async (tokenResponse) => {
        if (tokenResponse.error) {
          reject(new Error('Error de autenticación: ' + tokenResponse.error));
          return;
        }
        
        // Guardar tokens de acceso
        const tokens = {
          access_token: tokenResponse.access_token,
          expires_at: Date.now() + (tokenResponse.expires_in * 1000)
        };
        localStorage.setItem('googleTokens', JSON.stringify(tokens));
        
        // Obtener información del usuario
        try {
          const userInfo = await getUserInfo(tokens.access_token);
          
          // Crear estructura de carpetas en Drive
          await createGoogleDriveFolders();
          
          resolve(userInfo);
        } catch (error) {
          reject(error);
        }
      }
    });
    
    // Verificar si hay tokens guardados y aún son válidos
    const savedTokens = JSON.parse(localStorage.getItem('googleTokens') || '{}');
    if (savedTokens.access_token && savedTokens.expires_at > Date.now()) {
      getUserInfo(savedTokens.access_token)
        .then(resolve)
        .catch(() => resolve(null)); // Si falla, resolver como null para mostrar login
    } else {
      resolve(null); // No hay tokens válidos, resolver como null
    }
  } catch (error) {
    reject(error);
  }
};

const getUserInfo = async (accessToken) => {
  try {
    const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!response.ok) throw new Error('Error al obtener información del usuario');
    
    const data = await response.json();
    return {
      id: data.sub,
      name: data.name,
      email: data.email,
      picture: data.picture
    };
  } catch (error) {
    throw new Error('Error al obtener información del usuario: ' + error.message);
  }
};

export const loginWithGoogle = () => {
  return new Promise((resolve, reject) => {
    try {
      window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES.join(' '),
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            reject(new Error('Error de autenticación: ' + tokenResponse.error));
            return;
          }
          
          // Guardar tokens de acceso
          const tokens = {
            access_token: tokenResponse.access_token,
            expires_at: Date.now() + (tokenResponse.expires_in * 1000)
          };
          localStorage.setItem('googleTokens', JSON.stringify(tokens));
          
          // Obtener información del usuario
          try {
            const userInfo = await getUserInfo(tokens.access_token);
            
            // Crear estructura de carpetas en Drive
            await createGoogleDriveFolders();
            
            resolve(userInfo);
          } catch (error) {
            reject(error);
          }
        }
      }).requestAccessToken();
    } catch (error) {
      reject(error);
    }
  });
};

export const logoutFromGoogle = async () => {
  localStorage.removeItem('googleTokens');
  // Google OAuth2 no tiene un método explícito de logout
  return Promise.resolve();
};

export const refreshGoogleTokenIfNeeded = async () => {
  const savedTokens = JSON.parse(localStorage.getItem('googleTokens') || '{}');
  
  // Si no hay tokens o están a punto de expirar (menos de 5 minutos de validez)
  if (!savedTokens.access_token || savedTokens.expires_at < (Date.now() + 5 * 60 * 1000)) {
    return new Promise((resolve, reject) => {
      try {
        window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES.join(' '),
          callback: (tokenResponse) => {
            if (tokenResponse.error) {
              reject(new Error('Error al refrescar token: ' + tokenResponse.error));
              return;
            }
            
            const tokens = {
              access_token: tokenResponse.access_token,
              expires_at: Date.now() + (tokenResponse.expires_in * 1000)
            };
            localStorage.setItem('googleTokens', JSON.stringify(tokens));
            resolve(tokens.access_token);
          }
        }).requestAccessToken();
      } catch (error) {
        reject(error);
      }
    });
  }
  
  return Promise.resolve(savedTokens.access_token);
};