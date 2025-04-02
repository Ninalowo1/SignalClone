import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import {TokenCache} from '@clerk/clerk-expo/dist/cache'

const createTokenCache = (): TokenCache => {
return {
    getToken: async (key: string) => {

        try{
            const item = await SecureStore.getItemAsync(key);
            if (item) {
                console.log(`${key} was used 🔐\n`)
                
        } else {
            console.log('No value stored under key:', key);
        }
        return item
    }catch (error) {
console.error('securee store get item erros: ', error)
await SecureStore.deleteItemAsync(key)
return null
}

},

saveToken:(key: string, token: string) => {
    return SecureStore.setItemAsync(key, token)
},
}
}

export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined