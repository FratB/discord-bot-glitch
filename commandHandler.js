const prefix = process.env.prefix;
const berkayID = process.env.berkayID;

module.exports = (message, command) => {
  
  if (message.author.bot || message.author.id == berkayID) return;

  const content = message.content;

  if (!content.startsWith(`${prefix}`)) return;
  
  command.aliases.forEach(item => {
    const aliaes = `${prefix}${item}`;
    
    if (content.startsWith(`${aliaes} `) || content == aliaes) {
         // console.log(`Running the command: ${aliaes}.`);
         command.handler(message);
      }
  });
}