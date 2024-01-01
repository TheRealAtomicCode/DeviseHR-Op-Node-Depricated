// if (urlToken) {
//   const decodedUrlToken = (await verify(
//     urlToken.toString().replace('Bearer ', ''),
//     process.env.JWT_REFRESH_SECRET!
//   )) as DecodedToken;

//   if (decodedUrlToken) {
//     decode = decodedUrlToken;
//   }
// }
// if (cookieToken) {
//   const decodedCookieToken = (await verify(
//     cookieToken.toString().replace('Bearer ', ''),
//     process.env.JWT_REFRESH_SECRET!
//   )) as DecodedToken;

//   if (decodedCookieToken) {
//     decode = decodedCookieToken;
//   }
// }
