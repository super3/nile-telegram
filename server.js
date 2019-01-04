const axios = require('axios');
const Nile = require('nile');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');

const nile = new Nile('big.chat');

async function handleUpdate(update) {
	const { message } = update;

	if(typeof message === 'object') {
		await nile.pushChunk('telegram', message.text);
	}
}

(async () => {
	const app = new Koa();
	app.use(bodyParser());

	app.use(async ctx => {
		await handleUpdate(ctx.request.body);

		ctx.body = "{}";
	});

	app.listen(3000);

	await axios.get(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/setWebhook`, {
		params: {
			url: process.env.URL
		}
	});
})();
