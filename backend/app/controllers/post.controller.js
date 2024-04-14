const db = require("../models");
const Post = db.posts;
const Op = db.Sequelize.Op;

const getPagination = (page, size) => {
  const limit = size ? +size : 5;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: posts } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, posts, totalPages, currentPage };
};


// Retrieve all Posts from the database.
exports.findAll = (req, res) => {
  const { page, size, startDate, endDate } = req.query;
  let condition = null;
  if(startDate && endDate){
    condition = { postDate: { [Op.between]: [startDate, endDate] } }
  }
  else if (startDate){
    condition = { postDate: { [Op.between]: [startDate, Date.now()] } }
  }
  
  const { limit, offset } = getPagination(page, size);

  Post.findAndCountAll({ where: condition, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving posts."
      });
    });
};

// Find a single Post with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Post.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Post with id=" + id
      });
    });
};


// Delete a Post with the specified id in the request
// exports.delete = (req, res) => {
//   const id = req.params.id;

//   Post.destroy({
//     where: { id: id }
//   })
//     .then(num => {
//       if (num == 1) {
//         res.send({
//           message: "Post was deleted successfully!"
//         });
//       } else {
//         res.send({
//           message: `Cannot delete Post with id=${id}. Maybe Post was not found!`
//         });
//       }
//     })
//     .catch(err => {
//       res.status(500).send({
//         message: "Could not delete Post with id=" + id
//       });
//     });
// };

// Delete all Posts from the database.
exports.deleteAll = (req, res) => {
  Post.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Posts were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all posts."
      });
    });
};

