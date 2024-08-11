import { strict as assert } from 'node:assert';
import { describe, it, beforeEach } from 'node:test';
import Note from '../../src/models/notes.js';
import { sequelize } from '../../src/config/db.js';

describe('Note Model', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true }); // Reset database before tests
  });

  it('should create a note with valid data', async () => {
    const note = await Note.create({ title: 'Test Note', description: 'This is a test', favorite: true });
    assert.equal(note.title, 'Test Note');
    assert.equal(note.description, 'This is a test');
    assert.equal(note.favorite, true);
  });

  it('should enforce title length validation', async () => {
    await assert.rejects(
      async () => {
        await Note.create({ title: '', description: 'This is a test', favorite: false });
      },
      (err) => {
        assert.strictEqual(err.name, 'SequelizeValidationError');
        assert.strictEqual(err.message,
          'Validation error: Validation notEmpty on title failed,' +
          '\nValidation error: Title must be between 1 and 255 characters long');
        return true;
      },
    );
  });

  it('should enforce maximun title length validation', async () => {
    await assert.rejects(
      async () => {
        await Note.create({ title: 't'.repeat(256), description: 'This is a test', favorite: false });
      },
      (err) => {
        assert.strictEqual(err.name, 'SequelizeValidationError');
        assert.strictEqual(err.message,
          'Validation error: Title must be between 1 and 255 characters long');
        return true;
      },
    );
  });

  it('should enforce description length validation', async () => {
    await assert.rejects(
      async () => {
        await Note.create({ title: 'This is a test', description: '', favorite: false });
      },
      (err) => {
        assert.strictEqual(err.name, 'SequelizeValidationError');
        assert.strictEqual(err.message, 'Validation error: Description must be between 1 and 10000 characters long');
        return true;
      },
    );
  });

  it('should enforce maximun description length validation', async () => {
    await assert.rejects(
      async () => {
        await Note.create({ title: 'This is a test', description: 'd'.repeat(100001), favorite: false });
      },
      (err) => {
        assert.strictEqual(err.name, 'SequelizeValidationError');
        assert.strictEqual(err.message, 'Validation error: Description must be between 1 and 10000 characters long');
        return true;
      },
    );
  });

  it('should update a note', async () => {
    const note = await Note.create({ title: 'Test Note', description: 'This is a test', favorite: true });
    assert.equal(note.title, 'Test Note');
    assert.equal(note.description, 'This is a test');
    assert.equal(note.favorite, true);

    note.title = 'Updated Note';
    note.description = 'Updated Description';
    note.favorite = false;

    await note.save();

    const updatedNote = await Note.findByPk(note.id);

    assert.equal(updatedNote.title, 'Updated Note');
    assert.equal(updatedNote.description, 'Updated Description');
    assert.equal(updatedNote.favorite, false);
  });

  it('should update a note\'s title', async () => {
    const note = await Note.create({ title: 'Test Note', description: 'This is a test', favorite: true });
    assert.equal(note.title, 'Test Note');
    assert.equal(note.description, 'This is a test');
    assert.equal(note.favorite, true);

    note.title = 'Updated Note';

    await note.save();

    const updatedNote = await Note.findByPk(note.id);

    assert.equal(updatedNote.title, 'Updated Note');
    assert.equal(updatedNote.description, 'This is a test');
    assert.equal(updatedNote.favorite, true);
  });

  it('should update a note\'s description', async () => {
    const note = await Note.create({ title: 'Test Note', description: 'This is a test', favorite: true });
    assert.equal(note.title, 'Test Note');
    assert.equal(note.description, 'This is a test');
    assert.equal(note.favorite, true);

    note.description = 'Updated description';

    await note.save();

    const updatedNote = await Note.findByPk(note.id);

    assert.equal(updatedNote.title, 'Test Note');
    assert.equal(updatedNote.description, 'Updated description');
    assert.equal(updatedNote.favorite, true);
  });

  it('should update a note\'s favorite', async () => {
    const note = await Note.create({ title: 'Test Note', description: 'This is a test', favorite: true });
    assert.equal(note.title, 'Test Note');
    assert.equal(note.description, 'This is a test');
    assert.equal(note.favorite, true);

    note.favorite = false;

    await note.save();

    const updatedNote = await Note.findByPk(note.id);

    assert.equal(updatedNote.title, 'Test Note');
    assert.equal(updatedNote.description, 'This is a test');
    assert.equal(updatedNote.favorite, false);
  });

  it('shouldn\'t update to a empty title', async () => {
    const note = await Note.create({ title: 'Test Note', description: 'This is a test', favorite: true });
    assert.equal(note.title, 'Test Note');
    assert.equal(note.description, 'This is a test');
    assert.equal(note.favorite, true);

    note.title = '';

    await assert.rejects(
      async () => {
        await note.save();
      },
      (err) => {
        assert.strictEqual(err.name, 'SequelizeValidationError');
        assert.strictEqual(err.message,
          'Validation error: Validation notEmpty on title failed,' +
          '\nValidation error: Title must be between 1 and 255 characters long');
        return true;
      },
    );
  });

  it('shouldn\'t update to an invalid title', async () => {
    const note = await Note.create({ title: 'Test Note', description: 'This is a test', favorite: true });
    assert.equal(note.title, 'Test Note');
    assert.equal(note.description, 'This is a test');
    assert.equal(note.favorite, true);

    note.title = 't'.repeat(256);

    await assert.rejects(
      async () => {
        await note.save();
      },
      (err) => {
        assert.strictEqual(err.name, 'SequelizeValidationError');
        assert.strictEqual(err.message, 'Validation error: Title must be between 1 and 255 characters long');
        return true;
      },
    );
  });

  it('shouldn\'t update to a empty description', async () => {
    const note = await Note.create({ title: 'Test Note', description: 'This is a test', favorite: true });
    assert.equal(note.title, 'Test Note');
    assert.equal(note.description, 'This is a test');
    assert.equal(note.favorite, true);

    note.description = '';

    await assert.rejects(
      async () => {
        await note.save();
      },
      (err) => {
        assert.strictEqual(err.name, 'SequelizeValidationError');
        assert.strictEqual(err.message, 'Validation error: Description must be between 1 and 10000 characters long');
        return true;
      },
    );
  });

  it('shouldn\'t update to an invalid description', async () => {
    const note = await Note.create({ title: 'Test Note', description: 'This is a test', favorite: true });
    assert.equal(note.title, 'Test Note');
    assert.equal(note.description, 'This is a test');
    assert.equal(note.favorite, true);

    note.description = 'd'.repeat(10001);

    await assert.rejects(
      async () => {
        await note.save();
      },
      (err) => {
        assert.strictEqual(err.name, 'SequelizeValidationError');
        assert.strictEqual(err.message, 'Validation error: Description must be between 1 and 10000 characters long');
        return true;
      },
    );
  });

  it('should find a collections of notes', async () => {
    const note1 = await Note.create({ title: 'Note 1', description: 'desc 1', favorite: true });
    const note2 = await Note.create({ title: 'Note 2', description: 'desc 2', favorite: true });

    const notes = await Note.findAll();

    assert.ok(notes.every(n => n.id == note1.id || n.id == note2.id));
    assert.equal(notes.length, 2);
  });

  it('should get a single note', async () => {
    const note = await Note.create({ title: 'Note 1', description: 'desc 1', favorite: true });

    const findedNote = await Note.findByPk(note.id);

    assert.equal(note.title, findedNote.title);
    assert.equal(note.description, findedNote.description);
    assert.equal(note.favorite, findedNote.favorite);
  });

  it('shouldn\'t find a single note', async () => {
    const findedNote = await Note.findByPk(-1);
    assert.equal(findedNote, null);
  });

  it('should delete a note', async () => {
    const note = await Note.create({ title: 'Note 1', description: 'desc 1', favorite: true });

    await note.destroy();

    const findedNote = await Note.findByPk(note.id);
    assert.equal(findedNote, null);
  });
});
