const config = require('./config.json');
const Discord = require('discord.js');
const fs = require('fs');

//set up for recording influences
var MattF = './Matt.json';
const Matt = require(MattF);

var BenF = './Ben.json';
const Ben = require(BenF);

var OrionF = './Orion.json';
const Orion = require(OrionF);

//create the bot
const bot = new Discord.Client();

// when the client is ready, run this code
// this event will only trigger one time after logging in
bot.once('ready', () => {
    console.log('Ready!');
});

//When a message is sent, if it starts with the prefix '!', do some action
bot.on('message', message => {
	if(!message.content.startsWith(config.prefix || message.author.bot)) return;
	
	var args = message.content.slice(config.prefix.length).split(' ');
	var cmd = args.shift().toLowerCase();
	
	for(var i = 0; i < args.length; i++) {
		console.log('args ' + i + ': ' + args[i]);
	}
	
	if(cmd === 'ping') {									//TODO: convert to switch
		message.channel.send('Piong').then((msg)=>{
			setTimeout(function(){
				msg.edit('Pong!');
			}, 1000)});
	} else
	if(cmd === 'clear') {
		var count = parseInt(args[0]) + 1;
		if(!count) {
			count = 6;
		}
		message.channel.bulkDelete(count).then(messages => {
			console.log('Deleted ' + messages.size + ' messages.');
		});
	} else
	if(cmd === 'check') {				//check influences of a character
		message.channel.send(
		args[0] + '\'s Influence\n' +
		'-----------------------\n')
		switch(args[0]) {
			case 'Matt':
				message.channel.send(Matt.influence.has);
				message.channel.send(Matt.influence.over);
			break;
			case 'Orion':
				message.channel.send(Orion.influence.has);
				message.channel.send(Orion.influence.over);
			break;
			case 'Ben':
				message.channel.send(Ben.influence.has);
				message.channel.send(Ben.influence.over);
			break;
		}
	} else
	if (cmd === 'pool') {				//manage the team pool
		var loops = parseInt(args[1]);
		
		switch(args[0]) {
			case 'reset':
				message.channel.fetchPinnedMessages().then(msg => {
					msg = (msg.array())[0];
					
					msg.edit(
						'**Team Pool**\n' +
						'--------------\n' +
						'-> 1 Team Point(s)'
					)
				})
			break;
			case 'add':
				for(var i = 0; i < args[1]; i++) {
					message.channel.fetchPinnedMessages()
					.then(pin => {
						pin = (pin.array())[0];
			
						console.log(pin.content);
		
						var divided = pin.content.split(' ');
					
						var teamInt = parseInt(divided[2]);						//COREY LOOK HERE
						teamInt = teamInt + 1;									//Want to use args[1] here instead of 1
						divided[2] = teamInt.toString();
					
						pin.edit(
							'**Team Pool**\n' +
							'--------------\n' +
							'-> ' + teamInt + ' Team Point(s)');
					})
					.catch(console.error);
				}
			break;
			case 'remove':
				for(var i = 0; i < args[1]; i++) {
					message.channel.fetchPinnedMessages()
					.then(pin => {
						pin = (pin.array())[0];
				
						console.log(pin.content);
			
						var divided = pin.content.split(' ');
						
						var teamInt = parseInt(divided[2]);
						teamInt = teamInt - 1;
						divided[2] = teamInt.toString();
						
						pin.edit(
							'**Team Pool**\n' +
							'--------------\n' +
							'-> ' + teamInt + ' Team Point(s)');
					})
					.catch(console.error);
				}
			break;
		}
	}
	if(cmd === 'setup') {
		message.channel.send(
			'**Team Pool**\n' +
			'--------------\n' +
			'-> 1 Team Point(s)'
		).then(message => message.pin()).catch(console.error);
	}
	
	for(var i = 0; i < args.length;) {
		args.pop();
	}
});

// login to Discord with app's token
bot.login(config.token);