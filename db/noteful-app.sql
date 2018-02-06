SELECT CURRENT_DATE;

-- if the notes table exists, delete it
DROP TABLE IF EXISTS notes;

-- create table
CREATE TABLE notes (
    id serial PRIMARY KEY,
    title text NOT NULL,
    content text NOT NULL,
    date timestamp DEFAULT current_timestamp
);

SELECT setval('notes_id_seq', 1000);

-- insert sample data
INSERT INTO notes (title, content) VALUES
    ('Test Title 1', 'How would you know the difference between the real world, or the dream world?'),
    ('Test Title 2', 'Cat'),
    ('Test Title 3', 'How would you know the difference between the real world, or the dream world?'),
    ('Test Title 4', 'Dog'),
    ('Test Title 5', 'How would you know the difference between the real world, or the dream world?'),
    ('Test Title 6', 'Mouse'),
    ('Test Title 7', 'How would you know the difference between the real world, or the dream world?'),
    ('Test Title 8', 'Horse');

-- -- print all in table notes
-- SELECT * FROM notes;

-- -- print 5 in table notes
-- SELECT * FROM notes
--   LIMIT 5;

-- -- sort by id
-- SELECT * FROM notes
--     ORDER BY content;

-- -- notes that match string exactly
-- SELECT * FROM notes
--   WHERE title = 'Test Title 1';

-- -- notes that select string
-- SELECT * FROM notes
--   WHERE title LIKE '%3%';

-- update title and content of specific note
UPDATE notes SET
    title = 'DJ Reynolds Pub and Restaurant',
    content = 'Remix and switch',
    WHERE id = '1';

-- insert leaving info out
INSERT INTO notes (title, content) VALUES
    ('Wrong Way');

-- delete by id
DELETE from notes WHERE id = 3;

-- print all in table notes
SELECT * FROM notes;

