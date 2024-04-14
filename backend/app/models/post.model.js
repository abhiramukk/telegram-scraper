module.exports = (sequelize, Sequelize) => {
    const Post = sequelize.define("post", {
    channel: {
        type: Sequelize.TEXT
      },
      text: {
        type: Sequelize.TEXT
      },
      postDate: {
        type: Sequelize.DATE
      },
      author: {
        type: Sequelize.TEXT
      },
      media: {
        type: Sequelize.TEXT
      },
      reactions: {
        type: Sequelize.JSONB
      }
    });
  
    return Post;
  };