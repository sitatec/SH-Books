export * from "./input-validators";
export * from "./object-utils";
export * from "./string-utils";
export * from "./test-utils";

export const ensureEnvVariablesSet = (...envVariables: string[]) => {
  for (const envVariableName of envVariables) {
    if (!process.env[envVariableName]) {
      forceSynchronousErrorLoggin(); // Otherwise process may exit before logging completed
      console.error(`${envVariableName} environment variable must be define!`);
      process.exit(1); // TODO remove this and return boolean to let the caller choose how to handle it.
    }
  }
};

/**
 * Do **NOT** use in prod workload handler. Use it only When you need to log error
 * just before exiting node process to make sure the process won't exit before
 * error logging completed.
 */
export const forceSynchronousErrorLoggin = () => {
  const stderr: any = process.stderr;
  if (stderr._handle) {
    stderr._handle.setBlocking(true);
  }
};
