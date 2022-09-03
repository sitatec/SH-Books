expect.extend({
  // TODO test
  toContainObject(received, argument) {
    const pass = this.equals(
      received,
      expect.arrayContaining([expect.objectContaining(argument)])
    );

    const message = `expected ${this.utils.printReceived(
      received
    )} not to contain object ${this.utils.printExpected(argument)}`;

    if (pass) {
      return {
        message: () => message,
        pass: true,
      };
    } else {
      return {
        message: () => message,
        pass: false,
      };
    }
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toContainObject(expected: any): { message: () => string; pass: boolean };
    }
  }
}

export {};
