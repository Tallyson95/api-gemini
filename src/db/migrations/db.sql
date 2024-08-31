CREATE TABLE customers (
    customer_code VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE measures (
    uuid UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_code VARCHAR(50) REFERENCES customers(customer_code),
    measure_datetime TIMESTAMP NOT NULL,
    measure_type VARCHAR(10) NOT NULL CHECK (measure_type IN ('WATER', 'GAS')),
    measure_value INTEGER NOT NULL,
    has_confirmed BOOLEAN DEFAULT FALSE,
    image_url TEXT NOT NULL
);
