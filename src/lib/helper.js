export function encodeSessionId(sessionId) {
    return sessionId
        .replace(/\+/g, '_PLUS_')
        .replace(/-/g, '_DASH_')
        .replace(/=/g, '_EQUAL_')
        .replace(/#/g, '_HASH_')
        .replace(/%/g, '_PERCENT_')
        .replace(/\//g, '_SLASH_');
}

export function decodeSessionId(encodedSessionId) {
    return encodedSessionId
        .replace(/_PLUS_/g, '+')
        .replace(/_DASH_/g, '-')
        .replace(/_EQUAL_/g, '=')
        .replace(/_HASH_/g, '#')
        .replace(/_PERCENT_/g, '%')
        .replace(/_SLASH_/g, '/');
}

