module.exports = Object.freeze({
  OK: 200, /* General success(Eg. update,delete) */
  CREATED: 201, /* Try to create something and succeed...DUH */
  ACCEPTED: 202, /* The request has been accepted for processing */
  NO_CONTENT: 204, /* No Content in response body */
  MULTI_STATUS: 207, /* Used in POST, PUT, DELETE, Some succeed, and some failed */
  MOVED_PERMANENTLY: 301, /* Not used yet */
  NOT_MODIFIED: 304, /* Try to modify and failed....DUH */
  BAD_REQUEST: 400, /* General error - (
                      Eg. Parameter missing, wrong password, wrong something, whatever wrong) */
  UNAUTHORIZED: 401, /* Unauthorized access...DUH */
  FORBIDDEN: 403, /* It is there for a reason
                    but nobody should be seeing this content or page or whatever */
  NOT_FOUND: 404, /* This is Not Found for endpoints. Not contents.  */
  NOT_ALLOWED: 405, /* Not Allowed.  */
  GONE: 410, /* Endpoint no longer exists. It used to be....or may be....never did.... */
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500, /* Someone breaks the code.... =.=" */
  NOT_IMPLEMENTED: 501 /* if Feature is not yet implemented */
});

/*
  ---------------------REFERENCE--------------------
  https://www.restapitutorial.com/httpstatuscodes.html
  ------------------------END-----------------------
*/
