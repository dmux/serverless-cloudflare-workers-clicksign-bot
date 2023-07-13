async function clicksignGetDocumentsPending() {
	let page = 1;
	let total_pages = 1;
	let documents: any[] = [];
	let data: any[] = [];

	while (page <= total_pages) {
		await fetch(`${CLICKSIGN_API_URL}/v1/documents?page=${page}&access_token=${CLICKSIGN_ACCESS_TOKEN}`, {}).then(async (res) => {
			let json: any = await res.json();

			total_pages = json.total_pages;
			documents = documents.concat(json.documents);
		});
	}

	const documentsDraft = documents.filter((document) => document.status == 'draft');
	const documentsPending = documents.filter((document) => document.status == 'running');

	data.push({ draft: documentsDraft });
	data.push({ pending: documentsPending });

	return data;
}

export { clicksignGetDocumentsPending };
