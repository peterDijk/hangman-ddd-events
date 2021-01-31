export class InvalidCommandException extends Error {
  constructor(message?: string) {
    super(message);
  }
}

export class InvalidGameException extends Error {
  constructor(message?: string) {
    super(`Invalid game data ${message ? `- ${message}` : ''}`);
  }
}
