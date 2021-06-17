const { Schema, model } = require('mongoose');

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    createdDate: {
      type: Date,
      default: Date.now(),
    },
    username: {
      type: String,
    },
  },
  { timestamps: true },
);

recipeSchema.index({
  '$**': 'text',
});

module.exports = model('Recipe', recipeSchema);
