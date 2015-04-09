Elm.Native.Dropbox = {};
Elm.Native.Dropbox.make = function(localRuntime) {
  localRuntime.Native = localRuntime.Native || {};
  localRuntime.Native.Dropbox = localRuntime.Native.Dropbox || {};

  if (localRuntime.Native.Dropbox.values) {
    return localRuntime.Native.Dropbox.values;
  }

  function authenticate(key) {
    return Task.asyncFunction(function(callback) {
      var opts = {interactive: true};

      try {
        new Dropbox.Client({key: key}).authenticate(opts, function(error, client) {
          if (error) {
            callback(Task.fail(wrapAuthenticateError(error)));
          } else {
            callback(Task.succeed(wrapAuthenticatedClient(client)));
          }
        });
      } catch(err) {
        callback(Task.fail({ctor: 'UnknownError'}));
      }
    });
  };

  function wrapAuthenticatedClient(client) {
    // TODO
  }

  function wrapAuthenticateError(error) {
    switch (error.status) {
      case Dropbox.ApiError.INVALID_TOKEN:
        return {ctor: 'InvalidToken'};
      case Dropbox.ApiError.NOT_FOUND:
        return {ctor: 'NotFound'};
      case Dropbox.ApiError.OVER_QUOTA:
        return {ctor: 'OverQuota'};
      case Dropbox.ApiError.RATE_LIMITED:
        return {ctor: 'RateLimited'};
      case Dropbox.ApiError.NETWORK_ERROR:
        return {ctor: 'NetworkError'};
      case Dropbox.ApiError.INVALID_PARAM:
        return {ctor: 'InvalidParam'};
      case Dropbox.ApiError.OAUTH_ERROR:
        return {ctor: 'OAuthError'};
      case Dropbox.ApiError.INVALID_METHOD:
        return {ctor: 'InvalidMethod'};
    }

    return {ctor: 'UnknownError'};
  }

  return localRuntime.Native.Http.values = {
    clientFor: F1(send)
  };
};