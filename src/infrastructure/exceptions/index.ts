export class InvalidCommandException extends Error {
  constructor(message?: string) {
    super(message);
    this.name = 'InvalidCommandException';
  }
}

export class InvalidGameException extends Error {
  constructor(message?: string) {
    super(`Invalid game data ${message ? `: ${message}` : ''}`);
    this.name = 'InvalidGameException';
  }
}
