class OAuthClient {
  constructor(args) {
    this.id = args.id;
    this.getRedirectUri = args.getRedirectUri;
    this.secret = args.secret;
  }
}

module.exports = OAuthClient;
