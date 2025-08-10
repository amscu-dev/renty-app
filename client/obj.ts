const fetchAuthSession = {
  credentials: null,
  identityId: null,
  tokens: {
    accessToken: {
      payload: {
        auth_time: 1754736775,
        client_id: "4uur8k042u3ehga49tid3lpaqj",
        event_id: "545f9084-e44d-4001-9241-45a6c762317c",
        exp: 1754740375,
        iat: 1754736775,
        iss: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_KkrQqZ3v8",
        jti: "dc7504aa-037f-4739-a18d-f500a30de1da",
        origin_jti: "52372561-0803-458a-9ca7-8c0afdb2bea3",
        scope: "aws.cognito.signin.user.admin",
        sub: "c00c29ac-d0f1-7015-3677-2050463f38a6",
        token_use: "access",
        username: "pinenat995",
      },
      tokenString: "<JWT_ACCESS_TOKEN>",
    },
    idToken: {
      payload: {
        aud: "4uur8k042u3ehga49tid3lpaqj",
        auth_time: 1754736775,
        "cognito:username": "pinenat995",
        "custom:role": "tenant",
        email: "pinenat995@blaxion.com",
        email_verified: true,
        event_id: "545f9084-e44d-4001-9241-45a6c762317c",
        exp: 1754740375,
        iat: 1754736775,
        iss: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_KkrQqZ3v8",
        jti: "2912ef9c-5713-4ef9-bbb7-40a999d69945",
        origin_jti: "52372561-0803-458a-9ca7-8c0afdb2bea3",
        sub: "c00c29ac-d0f1-7015-3677-2050463f38a6",
        token_use: "id",
      },
      tokenString: "<JWT_ID_TOKEN>",
    },
    signInDetails: {
      authFlowType: "USER_SRP_AUTH",
      loginId: "pinenat995",
    },
  },
  userSub: "c00c29ac-d0f1-7015-3677-2050463f38a6",
};

const getCurrentUser = {
  signInDetails: {
    authFlowType: "USER_SRP_AUTH",
    loginId: "pinenat995",
  },
  userId: "c00c29ac-d0f1-7015-3677-2050463f38a6",
  username: "pinenat995",
};

/*
Observații utile
accessToken.payload conține informații de autorizare (scope, grupuri, username).
idToken.payload conține datele de profil și custom attributes (e.g. custom:role, email).
tokenString este valoarea JWT brută obținută prin idToken.toString() sau accessToken.toString().
signInDetails vine din getCurrentUser() și îți arată metoda de autentificare (USER_SRP_AUTH) și username-ul folosit.
userSub: "c00c29ac-d0f1-7015-3677-2050463f38a6" este Cognito User ID-ul unic (UUID) generat de Amazon Cognito atunci când utilizatorul a fost creat în User Pool.
*/

const idToken = {
  sub: "c00c29ac-d0f1-7015-3677-2050463f38a6",
  email_verified: true,
  iss: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_KkrQqZ3v8",
  "cognito:username": "pinenat995",
  origin_jti: "52372561-0803-458a-9ca7-8c0afdb2bea3",
  aud: "4uur8k042u3ehga49tid3lpaqj",
  event_id: "545f9084-e44d-4001-9241-45a6c762317c",
  token_use: "id",
  auth_time: 1754736775,
  exp: 1754740375,
  "custom:role": "tenant",
  iat: 1754736775,
  jti: "2912ef9c-5713-4ef9-bbb7-40a999d69945",
  email: "pinenat995@blaxion.com",
};

const AccessToken = {
  sub: "c00c29ac-d0f1-7015-3677-2050463f38a6",
  iss: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_KkrQqZ3v8",
  client_id: "4uur8k042u3ehga49tid3lpaqj",
  origin_jti: "52372561-0803-458a-9ca7-8c0afdb2bea3",
  event_id: "545f9084-e44d-4001-9241-45a6c762317c",
  token_use: "access",
  scope: "aws.cognito.signin.user.admin",
  auth_time: 1754736775,
  exp: 1754740375,
  iat: 1754736775,
  jti: "dc7504aa-037f-4739-a18d-f500a30de1da",
  username: "pinenat995",
};
