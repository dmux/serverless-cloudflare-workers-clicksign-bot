function base64ToUint8Array(base64: string) {
	return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
}

async function verifySignature(body: string | undefined, signature: string) {
	const secretBuf = base64ToUint8Array(SECRET);
	const sigBuf = base64ToUint8Array(signature ? signature.slice(5) : '');
	const msgBuf = new TextEncoder().encode(body);
	const key = await crypto.subtle.importKey('raw', secretBuf, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);

	return await crypto.subtle.verify('HMAC', key, sigBuf, msgBuf);
}

export { base64ToUint8Array, verifySignature };
