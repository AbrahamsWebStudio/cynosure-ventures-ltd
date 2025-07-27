-- Update Product Prices with Diverse Price Ranges
-- Run this in your Supabase SQL Editor

-- First, let's see the current products
SELECT title, price, stock FROM products ORDER BY title;

-- Update prices with realistic, diverse ranges based on product types
UPDATE products SET price = 1450 WHERE title = 'icing sugar';
UPDATE products SET price = 120 WHERE title = 'fresh gum';
UPDATE products SET price = 2060 WHERE title = 'BEEF MCHUZI MIX';
UPDATE products SET price = 1300 WHERE title = 'JUS 4 EVER SACHET';
UPDATE products SET price = 3900 WHERE title = 'BIG GIANT ASSORTED/PASSION/';
UPDATE products SET price = 150 WHERE title = 'fresh gum peppermint';
UPDATE products SET price = 150 WHERE title = 'fresh gum menthol';
UPDATE products SET price = 150 WHERE title = 'fresh gum fruity';
UPDATE products SET price = 200 WHERE title = 'fresh gum menthol xl';
UPDATE products SET price = 200 WHERE title = 'fresh gum excel fruity';
UPDATE products SET price = 100 WHERE title = 'lotto mint drop';
UPDATE products SET price = 500 WHERE title = 'big giant lollipop';
UPDATE products SET price = 135 WHERE title = 'Lotto butterscotch toffee';
UPDATE products SET price = 135 WHERE title = 'lotto carammela';
UPDATE products SET price = 135 WHERE title = 'lotto chocco cream';
UPDATE products SET price = 135 WHERE title = 'looto fruit youghurt';
UPDATE products SET price = 750 WHERE title = 'magic ball jumbo';
UPDATE products SET price = 250 WHERE title = 'zing extra';
UPDATE products SET price = 800 WHERE title = 'zing extra jar';
UPDATE products SET price = 750 WHERE title = 'magic jumbo';
UPDATE products SET price = 200 WHERE title = 'fresh drop';
UPDATE products SET price = 150 WHERE title = 'fruit drops';
UPDATE products SET price = 135 WHERE title = 'lotto toffee';
UPDATE products SET price = 1200 WHERE title = 'assorted toffee jar';
UPDATE products SET price = 800 WHERE title = 'creamy yoghurt assorted';
UPDATE products SET price = 300 WHERE title = 'sparky assorted';
UPDATE products SET price = 4000 WHERE title = 'big giant ultra';

-- Verify the updated prices
SELECT title, price, stock FROM products ORDER BY price DESC;

-- Price ranges summary:
-- Premium products (3000-4000): big giant ultra, big giant assorted
-- Mid-range products (800-2000): zing extra jar, creamy yoghurt assorted, assorted toffee jar
-- Standard products (200-750): magic ball jumbo, magic jumbo, fresh gum menthol xl, fresh gum excel fruity
-- Budget products (100-200): fresh gum variants, fruit drops, fresh drop
-- Basic products (100-150): lotto candies, sparky assorted 