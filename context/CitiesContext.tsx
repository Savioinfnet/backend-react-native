import Cidade from "@/models/Cidade";
import { ReactNode, createContext, useReducer, useState } from "react";

export interface CitiesContextState {
    cities: Array<Cidade>
    city: Cidade | null,
};

export const CitiesContext = createContext<CitiesContextState | null>(null);
export const CitiesDispatchContext = createContext<any>(null);

export default function CitiesContextProvider(props: { children: ReactNode }) {
    const { children } = props;
    const [cities, dispatch] = useReducer(
        CitiesReducer,
        require('@/assets/mock.json')
    );

    const [city, setCity] = useState<Cidade | null>(null);

    return (
        <CitiesContext.Provider value={{cities, city}}>
            <CitiesDispatchContext.Provider value={dispatch}>
                {children}
            </CitiesDispatchContext.Provider>
        </CitiesContext.Provider>
    );
}

function CitiesReducer(cities: Array<Cidade>, action: { type: string, city: Cidade }) {
    const { type, city } = action;
    switch (type) {
        case 'added': {
            return [...cities, city];
        }
        case 'changed': {
            return cities.map(t => {
                if (t.id === city.id) {
                    return city;
                } else {
                    return t;
                }
            });
        }
        case 'deleted': {
            return cities.filter(t => t.id !== city.id);
        }
        default: {
            throw Error('Unknown action: ' + action.type);
        }
    }
}