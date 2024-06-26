import { evaluate } from 'mathjs';
import { EmbedBuilder } from 'discord.js';
import { createButton, getRandomString, addRow } from '../../functions/function.mjs';
import chalk from 'chalk';

/**
 * Make a calculator for your bot
 * @param {object} options - Options for the calculator
 * @param {object} options.message - The message or interaction object
 * 
 * @param {object} [options.embed] - The embed object
 * @param {string} [options.embed.title] - The title of the embed
 * @param {string} [options.embed.footer] - The footer of the embed
 * @param {boolean} [options.embed.timestamp] - The timestamp of the embed
 * 
 * @param {string} [options.disabledQuery] - The disabled query message
 * @param {string} [options.invalidQuery] - The invalid query message
 * @param {string} [options.othersMessage] - The others message
 * 
 * @returns {Promise<void>}
 * @copyright All rights Reserved. Weky Development
 */

export default async (options) => {
	const message = options.message || options.interaction;
	if (!message) {
		throw new Error(`${chalk.red('Weky Error:')} message or interaction argument was not specified.`);
	}
	if (typeof message !== 'object') {
		throw new TypeError(`${chalk.red('Weky Error:')} Invalid Discord Message or Interaction was provided.`);
	}

	if (!options.embed) options.embed = {};
	if (typeof options.embed !== 'object') {
		throw new TypeError(`${chalk.red('Weky Error:')} embed must be an object.`);
	}

	if (!options.embed.title) {
		options.embed.title = 'Calculator | Weky Development';
	}
	if (typeof options.embed.title !== 'string') {
		throw new TypeError(`${chalk.red('Weky Error:')} embed title must be a string.`);
	}

	if (!options.embed.footer) {
		options.embed.footer = '©️ Weky Development';
	}
	if (typeof options.embed.footer !== 'string') {
		throw new TypeError(`${chalk.red('Weky Error:')} footer must be a string.`);
	}

	if (!options.embed.timestamp) options.embed.timestamp = true;
	if (typeof options.embed.timestamp !== 'boolean') {
		throw new TypeError(`${chalk.red('Weky Error:')} timestamp must be a boolean.`);
	}

	if (!options.disabledQuery) {
		options.disabledQuery = 'Calculator is disabled!';
	}
	if (typeof options.disabledQuery !== 'string') {
		throw new TypeError(`${chalk.red('Weky Error:')} disabledQuery must be a string.`);
	}

	if (!options.invalidQuery) {
		options.invalidQuery = 'The provided equation is invalid!';
	}
	if (typeof options.invalidQuery !== 'string') {
		throw new TypeError(`${chalk.red('Weky Error:')} invalidQuery must be a string.`);
	}

	if (!options.othersMessage) {
		options.othersMessage = 'Only <@{{author}}> can use the buttons!';
	}
	if (typeof options.othersMessage !== 'string') {
		throw new TypeError(`${chalk.red('Weky Error:')} othersMessage must be a string.`);
	}

	let str = ' ';
	let stringify = '```\n' + str + '\n```';

	const row = [];
	const rows = [];

	const button = new Array([], [], [], [], []);
	const buttons = new Array([], [], [], [], []);

	const text = [
		'(',
		')',
		'^',
		'%',
		'AC',
		'7',
		'8',
		'9',
		'÷',
		'DC',
		'4',
		'5',
		'6',
		'x',
		'⌫',
		'1',
		'2',
		'3',
		'-',
		'\u200b',
		'.',
		'0',
		'=',
		'+',
		'\u200b',
	];

	let cur = 0;
	let current = 0;

	for (let i = 0; i < text.length; i++) {
		if (button[current].length === 5) current++;
		button[current].push(
			createButton(text[i], false, getRandomString),
		);
		if (i === text.length - 1) {
			for (const btn of button) row.push(addRow(btn));
		}
	}

	const embed = new EmbedBuilder()
		.setTitle(options.embed.title)
		.setDescription(stringify)
		.setAuthor({ name: message.author?.username || message.user.username, iconURL: message.author?.displayAvatarURL() || message.user.displayAvatarURL() })
		.setFooter({ text: options.embed.footer });
	embed.setTimestamp();

	const replyOptions = {
		embeds: [embed],
		components: row,
	};

	if (message.reply) {
		await message.reply(replyOptions).then(async (msg) => {
			await handleCalculatorInteraction(msg, options);
		});
	} else if (message.deferReply) {
		await message.deferReply();
		const msg = await message.followUp(replyOptions);
		await handleCalculatorInteraction(msg, options);
	}
};

const handleCalculatorInteraction = async (msg, options) => {
	let str = ' ';
	let stringify = '```\n' + str + '\n```';

	const row = [];
	const rows = [];
	const button = new Array([], [], [], [], []);
	const buttons = new Array([], [], [], [], []);
	const text = [
		'(',
		')',
		'^',
		'%',
		'AC',
		'7',
		'8',
		'9',
		'÷',
		'DC',
		'4',
		'5',
		'6',
		'x',
		'⌫',
		'1',
		'2',
		'3',
		'-',
		'\u200b',
		'.',
		'0',
		'=',
		'+',
		'\u200b',
	];
	let cur = 0;

	for (let i = 0; i < text.length; i++) {
		if (button[cur].length === 5) cur++;
		button[cur].push(
			createButton(text[i], false, getRandomString),
		);
		if (i === text.length - 1) {
			for (const btn of button) row.push(addRow(btn));
		}
	}

	const edit = async () => {
		const _embed = new EmbedBuilder()
			.setTitle(options.embed.title)
			.setDescription(stringify)
			.setAuthor({ name: options.message.author?.username || options.message.user.username, iconURL: options.message.author?.displayAvatarURL() || options.message.user.displayAvatarURL() })
			.setFooter({ text: options.embed.footer });
		_embed.setTimestamp();

		msg.edit({
			embeds: [_embed],
			components: row,
		});
	};

	const lock = async () => {
		const _embed = new EmbedBuilder()
			.setTitle(options.embed.title)
			.setDescription(stringify)
			.setAuthor({ name: options.message.author?.username || options.message.user.username, iconURL: options.message.author?.displayAvatarURL() || options.message.user.displayAvatarURL() })
			.setFooter({ text: options.embed.footer });
		_embed.setTimestamp();
		for (let i = 0; i < text.length; i++) {
			if (buttons[cur].length === 5) cur++;
			buttons[cur].push(
				createButton(text[i], true, getRandomString),
			);
			if (i === text.length - 1) {
				for (const btn of buttons) rows.push(addRow(btn));
			}
		}

		msg.edit({
			embeds: [_embed],
			components: rows,
		});
	};

	const calc = msg.createMessageComponentCollector({
		filter: (fn) => fn,
	});

	calc.on('collect', async (btn) => {
		if (btn.user.id !== options.message.author.id) {
			return btn.reply({
				content: options.othersMessage.replace(
					'{{author}}',
					options.message.author.id,
				),
				ephemeral: true,
			});
		}
		await btn.deferUpdate();
		if (btn.customId === 'calAC') {
			str += ' ';
			stringify = '```\n' + str + '\n```';
			edit();
		} else if (btn.customId === 'calx') {
			str += '*';
			stringify = '```\n' + str + '\n```';
			edit();
		} else if (btn.customId === 'cal÷') {
			str += '/';
			stringify = '```\n' + str + '\n```';
			edit();
		} else if (btn.customId === 'cal⌫') {
			if (str === ' ' || str === '' || str === null || str === undefined) {
				return;
			} else {
				str = str.split('');
				str.pop();
				str = str.join('');
				stringify = '```\n' + str + '\n```';
				edit();
			}
		} else if (btn.customId === 'cal=') {
			if (str === ' ' || str === '' || str === null || str === undefined) {
				return;
			} else {
				try {
					str += ' = ' + evaluate(str);
					stringify = '```\n' + str + '\n```';
					edit();
					str = ' ';
					stringify = '```\n' + str + '\n```';
				} catch (e) {
					str = options.invalidQuery;
					stringify = '```\n' + str + '\n```';
					edit();
					str = ' ';
					stringify = '```\n' + str + '\n```';
				}
			}
		} else if (btn.customId === 'calDC') {
			str = options.disabledQuery;
			stringify = '```\n' + str + '\n```';
			edit();
			calc.stop();
			lock();
		} else {
			str += btn.customId.replace('cal', '');
			stringify = '```\n' + str + '\n```';
			edit();
		}
	});
};
