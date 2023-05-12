const { Telegraf } = require("telegraf");
const { Configuration, OpenAIApi } = require("openai");
const { config } = require("dotenv");
config();

const messages = require("./messages.json");

const bot = new Telegraf(process.env.BOT_TOKEN);
const OpenAI = new OpenAIApi(
  new Configuration({
    apiKey: process.env.GPT_API_KEY,
  })
);

bot.start((ctx) => ctx.reply(messages.startMessage));
bot.help((ctx) => ctx.reply(messages.helpMessage));

bot.on("message", async (ctx) => {
  const message = ctx.message.text;

  const gptResponse = await OpenAI.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: message }],
  });
  const response = gptResponse.data.choices[0].message.content;

  ctx.reply(response);
});

bot.launch();
