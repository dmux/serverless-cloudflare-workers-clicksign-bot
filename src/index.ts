import { Router } from 'itty-router';
import { clicksignGetDocumentsPending } from './clicksign';
import { verifySignature } from './utils';

const router = Router();

router.get('/', () => {
	const data = {
		hello: ':)',
	};

	const json = JSON.stringify(data, null, 2);

	return new Response(json, {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
	});
});

router.get('/ping', () => {
	const json = JSON.stringify({ ping: 'pong' }, null, 2);

	return new Response(json, {
		headers: {
			'content-type': 'application/json;charset=UTF-8',
		},
	});
});

router.post('/api/bot/chat', async (req) => {
	let body = await req.text();
	let signature = req.headers.get('authorization') || '';
	let isSignatureValid = false;

	try {
		isSignatureValid = await verifySignature(body, signature);
	} catch (e) {
		// console.log(e.stack);
		return new Response('Error', { status: 500 });
	}

	if (!isSignatureValid) {
		return new Response('invalid token', { status: 401 });
	} else {
		let json = JSON.parse(body);
		let name = json.from.name;

		json.text = json.text.toLowerCase();

		switch (true) {
			case json.text.indexOf('info') != -1:
				return new Response(`{"type": "message","text": "Olá ${name}, eu sou um bot de automações para a Clicksign"}`, {});
			case json.text.indexOf('pendentes') != -1:
				const documents = await clicksignGetDocumentsPending();

				return new Response(
					`{"type": "message","text": "Olá ${name}, existem ${documents[0].draft.length} documentos em rascunho e ${documents[1].pending.length} documentos pendentes"}`,
					{}
				);
			default:
				return new Response(`{"type": "message","text": "Olá ${name}, meus comandos disponíveis são: pendentes, info "}`, {});
		}
	}
});

router.all('*', () => new Response('404, not found!', { status: 404 }));

addEventListener('fetch', (e) => {
	e.respondWith(router.handle(e.request));
});
