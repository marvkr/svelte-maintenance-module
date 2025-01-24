CREATE TABLE maintenance_stats (
    id INTEGER PRIMARY KEY,
    pending INTEGER NOT NULL,
    in_progress INTEGER NOT NULL,
    completed INTEGER NOT NULL,
    total INTEGER NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE maintenance_by_type (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL,
    count INTEGER NOT NULL
);

CREATE TABLE monthly_trends (
    id INTEGER PRIMARY KEY,
    month TEXT NOT NULL,
    count INTEGER NOT NULL,
    year INTEGER NOT NULL
);