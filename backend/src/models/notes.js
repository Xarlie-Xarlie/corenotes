import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js'; // Assuming you export your sequelize instance

const Note = sequelize.define('Note', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: {
        args: [1, 255],
        msg: 'Title must be between 1 and 255 characters long'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    validate: {
      len: {
        args: [1, 10000],
        msg: 'Description must be between 1 and 10000 characters long'
      }
    }
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  timestamps: true,  // Automatically adds `createdAt` and `updatedAt` fields
});

export default Note;
