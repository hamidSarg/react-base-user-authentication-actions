import React, { createContext, useContext } from 'react';
import HttpService from "../../network/http";

const networkService = new HttpService('https://reqres.in/api');

const NetworkServiceContext = createContext<HttpService | undefined>(undefined);

export const NetworkServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <NetworkServiceContext.Provider value={networkService}>
            {children}
        </NetworkServiceContext.Provider>
    );
};

export const useHttpService = (): HttpService => {
    const context = useContext(NetworkServiceContext);
    if (!context) {
        throw new Error('useNetworkService must be used within a NetworkServiceProvider');
    }
    return context;
};
