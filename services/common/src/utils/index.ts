export * from './input-validators';
export * from './object-utils';
export * from './string-utils';
export * from './test-utils';

export const ensureJwtKeyEnvVariableSet = () => {
  if(!process.env.JWT_KEY){
    console.error('JWT_KEY environment variable must be define!');
    process.exit(1);
  }
}