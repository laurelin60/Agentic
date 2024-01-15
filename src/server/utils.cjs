class Utils {
    static debugLog(message) {
        console.log(message);
    }

    static compactJsonStringify(obj) {
        for (let key in obj) {
            // Check if the property is a string and valid JSON
            if (typeof obj[key] === 'string') {
                try {
                    // Parse and recursively process the JSON string
                    obj[key] = JSON.parse(obj[key]);
                    obj[key] = Utils.compactJsonStringify(obj[key]);
                }
                catch (e) {
                    // Not a JSON string, ignore
                }
            }
        }
        // Convert the object to a string and remove quotes from keys
        return JSON.stringify(obj)
            .replace(/\"([^(\")"]+)\":/g, "$1:")
            .replace(/"(\w+)"(\s*:\s*)/g, '$1$2');
    }
}

module.exports = {
    Utils
};