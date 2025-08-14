export const getSystemEnv = async () => {
    const env = await window.envBridge.getEnv();
    return env;
};