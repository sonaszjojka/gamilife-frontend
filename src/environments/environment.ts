const callbackUri = 'oauth2/callback';

export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api/v1',
  googleClientId:
    '886417696654-ocac0ev9b6b00kcs5gn1gakeg3ujhg5p.apps.googleusercontent.com',
  callbackUri,
  googleRedirectUri: `http://localhost:4200/oauth2/callback`,
  wsUrl: 'ws://localhost:8080/ws/websocket',
};
