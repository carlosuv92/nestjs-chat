export const formatMessage = messages => {
  const finalMessages = messages.map(message => {
    const reactions = message.reactions.map(reaction => {
      const counter = reaction.users.length;
      const users = reaction.users.map(user => {
        return {
          user_id: user._id,
          name: user['name'],
          reaction: reaction.reaction_id['name'],
        };
      });
      return {
        reaction_id: {
          _id: reaction.reaction_id._id,
          name: reaction.reaction_id['name'],
          counter,
        },
        users,
      };
    });
    return {
      _id: message._id,
      message: message.message,
      sender_id: message.sender_id,
      quote: message.quote,
      forward: message.forward,
      reactions: reactions,
      created_at: message.created_at,
      edited: message.edited,
      read: message.read,
      canHaveReactions: false,
      isReacting: false,
      openReactionList: false,
    };
  });
  return finalMessages;
};
