class LocalStorageService {
    /**
     * Save an item to localStorage
     * @param key - The key under which the value is stored
     * @param value - The value to store (can be an object or primitive)
     */
    static set<T>(key: string, value: T): void {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(key, serializedValue);
        } catch (error) {
            console.error(`Error saving to localStorage: ${error}`);
        }
    }

    /**
     * Get an item from localStorage
     * @param key - The key of the item to retrieve
     * @returns The parsed value or `null` if the key does not exist
     */
    static get<T>(key: string): T | null {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error(`Error retrieving from localStorage: ${error}`);
            return null;
        }
    }

    /**
     * Remove an item from localStorage
     * @param key - The key of the item to remove
     */
    static remove(key: string): void {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error(`Error removing from localStorage: ${error}`);
        }
    }
}

export default LocalStorageService;
