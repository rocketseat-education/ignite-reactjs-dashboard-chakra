export class RefreshTokenError extends Error {
  constructor() {
    super('Error while refreshing token.');
  }
}