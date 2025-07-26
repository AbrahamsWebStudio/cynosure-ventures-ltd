-- Demo Vehicle Data for CYNOSURE VENTURES LTD

-- PSV Vehicles (Public Service Vehicles)
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 123A', 'Toyota', 'Hiace', '2020', 'PSV'),
('KCA 124B', 'Nissan', 'Urvan', '2019', 'PSV'),
('KCA 125C', 'Toyota', 'Coaster', '2021', 'PSV'),
('KCA 126D', 'Isuzu', 'NQR', '2018', 'PSV'),
('KCA 127E', 'Mitsubishi', 'Rosa', '2022', 'PSV');

-- Executive Vehicles (Luxury/High-end)
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 200A', 'Mercedes-Benz', 'S-Class', '2023', 'Executive'),
('KCA 201B', 'BMW', '7 Series', '2022', 'Executive'),
('KCA 202C', 'Audi', 'A8', '2023', 'Executive'),
('KCA 203D', 'Lexus', 'LS', '2022', 'Executive'),
('KCA 204E', 'Range Rover', 'Autobiography', '2023', 'Executive');

-- Economy Vehicles (Budget-friendly)
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 300A', 'Toyota', 'Vitz', '2021', 'Economy'),
('KCA 301B', 'Suzuki', 'Swift', '2020', 'Economy'),
('KCA 302C', 'Honda', 'Fit', '2021', 'Economy'),
('KCA 303D', 'Nissan', 'March', '2020', 'Economy'),
('KCA 304E', 'Mazda', 'Demio', '2022', 'Economy');

-- Standard Vehicles (Mid-range)
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 400A', 'Toyota', 'Corolla', '2022', 'Standard'),
('KCA 401B', 'Honda', 'Civic', '2021', 'Standard'),
('KCA 402C', 'Nissan', 'Sentra', '2022', 'Standard'),
('KCA 403D', 'Mazda', '3', '2021', 'Standard'),
('KCA 404E', 'Subaru', 'Impreza', '2022', 'Standard'),
('KCA 405F', 'Toyota', 'Camry', '2023', 'Standard'),
('KCA 406G', 'Honda', 'Accord', '2022', 'Standard'),
('KCA 407H', 'Nissan', 'Altima', '2021', 'Standard');

-- Additional PSV vehicles for more variety
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 128F', 'Toyota', 'Hilux', '2020', 'PSV'),
('KCA 129G', 'Isuzu', 'D-Max', '2021', 'PSV'),
('KCA 130H', 'Mitsubishi', 'L300', '2019', 'PSV');

-- Additional Executive vehicles
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 205F', 'Mercedes-Benz', 'E-Class', '2023', 'Executive'),
('KCA 206G', 'BMW', '5 Series', '2022', 'Executive'),
('KCA 207H', 'Audi', 'A6', '2023', 'Executive');

-- Additional Economy vehicles
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 305F', 'Toyota', 'Passo', '2021', 'Economy'),
('KCA 306G', 'Suzuki', 'Alto', '2020', 'Economy'),
('KCA 307H', 'Daihatsu', 'Mira', '2021', 'Economy');

-- Vehicle details with more specific information
UPDATE vehicles SET 
  make = 'Toyota',
  model = 'Hiace Commuter',
  year = '2020'
WHERE registration = 'KCA 123A';

UPDATE vehicles SET 
  make = 'Mercedes-Benz',
  model = 'S-Class 450',
  year = '2023'
WHERE registration = 'KCA 200A';

UPDATE vehicles SET 
  make = 'BMW',
  model = '730i',
  year = '2022'
WHERE registration = 'KCA 201B';

-- Add some vehicles with more detailed specifications
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 500A', 'Toyota', 'Land Cruiser V8', '2023', 'Executive'),
('KCA 501B', 'Mercedes-Benz', 'G-Class', '2023', 'Executive'),
('KCA 502C', 'Range Rover', 'Sport', '2022', 'Executive'),
('KCA 503D', 'Lexus', 'LX', '2023', 'Executive'),
('KCA 504E', 'BMW', 'X7', '2023', 'Executive');

-- Add some premium PSV options
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 131I', 'Mercedes-Benz', 'Sprinter', '2022', 'PSV'),
('KCA 132J', 'Ford', 'Transit', '2021', 'PSV'),
('KCA 133K', 'Volkswagen', 'Crafter', '2022', 'PSV');

-- Add some hybrid/electric options for Standard
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 408I', 'Toyota', 'Prius', '2023', 'Standard'),
('KCA 409J', 'Honda', 'Insight', '2022', 'Standard'),
('KCA 410K', 'Nissan', 'Leaf', '2023', 'Standard');

-- Add some compact SUVs for Economy
INSERT INTO vehicles (registration, make, model, year, class) VALUES
('KCA 308I', 'Toyota', 'Rush', '2022', 'Economy'),
('KCA 309J', 'Suzuki', 'Vitara', '2021', 'Economy'),
('KCA 310K', 'Honda', 'HR-V', '2022', 'Economy');

-- Display the inserted data
SELECT 
  registration,
  make,
  model,
  year,
  class,
  created_at
FROM vehicles 
ORDER BY class, registration; 