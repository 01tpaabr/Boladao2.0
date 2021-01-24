
const commands = {
    ['%Oi']: (messageObj, params) => {
        messageObj.channel.send(`Oi ${messageObj.author}`);
    },
};

module.exports = commands;
