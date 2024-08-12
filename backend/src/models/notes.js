import { DataTypes, Op, fn, col, where } from 'sequelize';
import { sequelize } from '../config/db.js';

/**
 * Notes Model.
 *
 * Sequelize ORM to interact with the database.
 *
 * fields:
 *   id: Integer ID.
 *   title: Title of the note.
 *   description: Description of the note.
 *   favorite: boolean to mark as favorite.
 *   createdAt: CreatedAt timestamps.
 *   updatedAt: UpdatedAt timestamps.
 *
 */
const Notes = sequelize.define('Notes', {
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
  search: {
    type: DataTypes.TSVECTOR,
    allowNull: false,
  },
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['search'],
      using: 'gist',
    },
  ],
  defaultScope: {
    attributes: { exclude: ['search'] },
  },
});

Notes.addHook('beforeValidate', (note) => {
  note.search = sequelize.fn('to_tsvector', `${note.title} ${note.description}`);
});

Notes.searchNotes = async function(term) {
  return await Notes.findAll({
    where: {
      [Op.or]: [
        where(
          col('search'),
          '@@',
          fn('plainto_tsquery', 'english', term)
        ),
        {
          description: {
            [Op.iLike]: `%${term}%`
          }
        },
        {
          title: {
            [Op.iLike]: `%${term}%`
          }
        }
      ]
    }
  });
};

export default Notes;
