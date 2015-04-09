module Dropbox where

type alias Client = {
  -- QUESTION: what should the error type be here? RawError from Http.send? Something else?
  signOut : Task RawError Client

  authenticate : Task RawError Client

  isAuthenticated : Task RawError Bool

  writeFile : String -> String -> Task RawError ()
}

writeFile client filename contents = ...

clientFor key : String -> Client

type APIError =
  -- If you're using elm-dropbox, the only cause behind this error is that
  -- the user token expired.
  -- Get the user through the authentication flow again.
  InvalidToken

  -- The file or folder you tried to access is not in the user's Dropbox.
  -- Handling this error is specific to your application.
  | NotFound

  -- The user is over their Dropbox quota.
  -- Tell them their Dropbox is full. Refreshing the page won't help.
  | OverQuota

  -- Too many API requests. Tell the user to try again later.
  -- Long-term, optimize your code to use fewer API calls.
  | RateLimited

  -- An error occurred at the XMLHttpRequest layer.
  -- Most likely, the user's network connection is down.
  -- API calls will not succeed until the user gets back online.
  | NetworkError

  -- Caused by a bug in elm-dropbox, in your application, or in Dropbox.
  -- Tell the user an error occurred, and ask them to refresh the page.
  | InvalidParam
  | OAuth Error
  | InvalidMethod
  | UnknownError