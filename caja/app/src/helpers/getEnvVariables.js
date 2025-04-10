export const getEnvVariables = () => {
    const env = import.meta.env;
    console.log(env);
    return {
        ...env
    }
};