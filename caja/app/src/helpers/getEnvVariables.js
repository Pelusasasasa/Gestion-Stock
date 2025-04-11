import { getSystemEnv } from "./getSystemEnv";

export const getEnvVariables = async () => {

    const systemEnv = await getSystemEnv();


    const env = {
        ...systemEnv,
        ...import.meta.env
    };
    return env
};