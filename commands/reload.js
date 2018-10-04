

exports.run = (bot, message, args, ops) => {
  if(message.author.id !== ops.ownerId) return message.channel.send('only PowerminsYT himself can use this command!')

  try{
    delete require.cache[require.resolve(`./${args[0]}.js`)]
  }catch(e){
    return message.channel.send(`could not reload ${args[0]}`)
  }

  message.channel.send(`reloaded ${args[0]}`)
}
