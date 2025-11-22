USE NorthWindDB;
GO

CREATE TRIGGER TR_UpdateStock_OnOrderDetail_Insert
ON OrderDetails
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Verificar que exista stock suficiente
    IF EXISTS (
        SELECT 1
        FROM inserted i
        JOIN Products p ON p.ProductId = i.ProductId
        WHERE p.Stock < i.Quantity
    )
    BEGIN
        RAISERROR('No hay stock suficiente para completar la orden.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END;

    -- Actualizar stock
    UPDATE p
    SET p.Stock = p.Stock - i.Quantity
    FROM Products p
    INNER JOIN inserted i ON p.ProductId = i.ProductId;
END;
GO

INSERT INTO Products (Name, UnitPrice, Stock) VALUES 
('Camiseta Básica Negra', 12.50, 45),
('Jeans Rectos Clásicos', 38.00, 28),
('Zapatillas Casual Urbanas', 55.80, 30),
('Chaqueta Denim Azul', 45.90, 22),
('Sandalias Plateadas Noche', 35.40, 18),
('Vestido Rojo Cocktail', 52.80, 15),
('Tacones Nude Medianos', 39.75, 25),
('Suéter de Algodón Básico', 28.75, 35),
('Zapatos Oxford Negro', 68.60, 16),
('Falda Midi Floral', 32.40, 20),
('Botas Chelsea Marrón', 65.30, 18),
('Polo Rayas Blancas', 22.60, 38),
('Chanclas Deportivas', 12.90, 50),
('Shorts Vaqueros', 18.25, 42),
('Mocasines Marrón Cuero', 45.50, 20),
('Abrigo Corto Lana', 82.30, 10),
('Zapatillas Running Pro', 89.20, 15),
('Blusa Manga Larga', 34.90, 24),
('Botas de Trabajo', 72.75, 14),
('Bikini Estampado Flores', 28.45, 26),
('Alpargatas Tiras', 18.80, 35),
('Pantalones Chino Beige', 42.00, 30),
('Zapatos Trail Running', 67.90, 18),
('Sudadera Con Cremallera', 35.75, 32),
('Ballet Flats Doradas', 29.95, 28),
('Camisa Formal Blanca', 48.50, 25),
('Jeans Boyfriend Rotos', 42.00, 20),
('Zapatillas Bambas Clásicas', 32.80, 40),
('Chaqueta Bomber Negra', 55.90, 18),
('Sandalias Oro Elegantes', 42.40, 22),
('Vestido Largo Verano', 38.80, 20),
('Tacones Rojos Pasarela', 58.75, 12),
('Suéter Cuello Alto', 45.75, 24),
('Zapatos Derby Marrón', 62.60, 14),
('Falda Corta Cuero', 48.40, 16),
('Botas Agua Impermeables', 85.30, 10),
('Polo Manga Corta', 16.60, 45),
('Chanclas EVA Color', 6.90, 65),
('Shorts Lino Verano', 22.25, 38),
('Zapatos Conductor', 52.50, 20),
('Parka Invierno', 95.30, 8),
('Zapatillas Baloncesto', 78.20, 16),
('Blusa Volantes', 42.90, 19),
('Zapatos Chef Antidesliz', 54.75, 15),
('Bañador Hombre', 26.45, 30),
('Alpargatas Cuña', 25.80, 28),
('Pantalones Jogger', 35.00, 35),
('Zapatos Ciclismo', 88.90, 12),
('Hoodie Gris Oversize', 32.75, 40),
('Flats Con Lazo', 34.95, 26);

INSERT INTO Customers (CustomerId, FirstName, LastName, Address, PhoneNumber, Email) VALUES 
('1805704416', 'Kevin', 'Palate', 'Av. Confraternidad 123, Pelileo', '0985249640', 'kevin.palate@email.com'),
('1800000002', 'Ana', 'Andrade', 'Calle Sucre 456, Cuenca', '0991234567', 'ana.andrade@email.com'),
('1800000003', 'David', 'Palate', 'Urb. Santa Ana, Mz 8, Ambato', '0978912345', 'david.palate@email.com'),
('1800000004', 'Laura', 'Vásquez', 'Av. del Estudiante 789, Loja', '0967891234', 'laura.vasquez@email.com'),
('1800000005', 'Javier', 'Torres', 'Sauces 8, Mz 15, Guayaquil', '0956789123', 'javier.torres@email.com'),
('1800000006', 'Elena', 'Salazar', 'Calle Flores 234, Riobamba', '0945678912', 'elena.salazar@email.com'),
('1800000007', 'Miguel', 'Córdova', 'Av. de los Shyris 567, Quito', '0934567891', 'miguel.cordova@email.com'),
('1800000008', 'Isabel', 'Paredes', 'Urb. Los Olivos, Mz 22, Cuenca', '0923456789', 'isabel.paredes@email.com'),
('1800000009', 'Kevin', 'Zambrano', 'Calle 10 de Agosto 890, Machala', '0912345678', 'kevin.zambrano@email.com'),
('1800000010', 'Carlos', 'Benítez', 'Av. Boyacá 111, Guayaquil', '0901234567', 'carlos.benitez@email.com'),
('1800000011', 'Ana', 'Mendoza', 'Calle Rocafuerte 222, Ambato', '0984567890', 'ana.mendoza@email.com'),
('1800000012', 'David', 'Andrade', 'Urb. La Pradera, Mz 33, Loja', '0995678901', 'david.andrade@email.com'),
('1800000013', 'Lizeth', 'Palate', 'Av. del Ejército 444, Riobamba', '0976789012', 'lizeth.palate@email.com'),
('1800000014', 'Javier', 'Vásquez', 'Sauces 3, Mz 18, Quito', '0967890123', 'javier.vasquez@email.com'),
('1800000015', 'Elena', 'Torres', 'Calle Bolívar 555, Cuenca', '0958901234', 'elena.torres@email.com'),
('1800000016', 'Miguel', 'Salazar', 'Av. de la Cultura 666, Guayaquil', '0949012345', 'miguel.salazar@email.com'),
('1800000017', 'Isabel', 'Córdova', 'Urb. Bellavista, Mz 7, Ambato', '0930123456', 'isabel.cordova@email.com'),
('1800000018', 'Kevin', 'Paredes', 'Calle Colón 777, Loja', '0921234567', 'kevin.paredes@email.com'),
('1800000019', 'Carlos', 'Zambrano', 'Av. del Maestro 888, Riobamba', '0912345678', 'carlos.zambrano@email.com'),
('1800000020', 'Ana', 'Benítez', 'Sauces 6, Mz 25, Machala', '0903456789', 'ana.benitez@email.com'),
('1800000021', 'David', 'Mendoza', 'Calle Olmedo 999, Quito', '0985678901', 'david.mendoza2@email.com'),
('1800000022', 'Laura', 'Andrade', 'Av. América 101, Cuenca', '0996789012', 'laura.andrade2@email.com'),
('1800000023', 'Javier', 'Palate', 'Urb. Los Álamos, Mz 11, Guayaquil', '0977890123', 'javier.palate@email.com'),
('1800000024', 'Elena', 'Vásquez', 'Calle Montúfar 202, Ambato', '0968901234', 'elena.vasquez2@email.com'),
('1800000025', 'Miguel', 'Torres', 'Av. del Parque 303, Loja', '0959012345', 'miguel.torres2@email.com');
GO

-- Order 1: 1 detalle
INSERT INTO Orders (CustomerId, ShipAddress, ShipCity, ShipCountry, ShipPostalCode, ShippingType, DiscountType, Discount, OrderDate) 
VALUES ('1805704416', 'Av. Confraternidad 123', 'Pelileo', 'Ecuador', '180150', 3, 1, 10, GETDATE());
INSERT INTO OrderDetails (OrderId, ProductId, UnitPrice, Quantity) 
VALUES (1, 1, 14.38, 2); -- Camiseta Básica Negra (12.50 + 15%)

-- Order 2: 2 detalles
INSERT INTO Orders (CustomerId, ShipAddress, ShipCity, ShipCountry, ShipPostalCode, ShippingType, DiscountType, Discount, OrderDate) 
VALUES ('1800000002', 'Calle Sucre 456', 'Cuenca', 'Ecuador', '010101', 3, 1, 10, GETDATE());
INSERT INTO OrderDetails (OrderId, ProductId, UnitPrice, Quantity) 
VALUES 
(2, 3, 64.17, 1), -- Zapatillas Casual Urbanas (55.80 + 15%)
(2, 7, 45.71, 1); -- Tacones Nude Medianos (39.75 + 15%)

-- Order 3: 2 detalles
INSERT INTO Orders (CustomerId, ShipAddress, ShipCity, ShipCountry, ShipPostalCode, ShippingType, DiscountType, Discount, OrderDate) 
VALUES ('1800000003', 'Urb. Santa Ana, Mz 8', 'Ambato', 'Ecuador', '180202', 3, 1, 10, GETDATE());
INSERT INTO OrderDetails (OrderId, ProductId, UnitPrice, Quantity) 
VALUES 
(3, 5, 40.71, 2), -- Sandalias Plateadas Noche (35.40 + 15%)
(3, 12, 25.99, 3); -- Polo Rayas Blancas (22.60 + 15%)

-- Order 4: 5 detalles
INSERT INTO Orders (CustomerId, ShipAddress, ShipCity, ShipCountry, ShipPostalCode, ShippingType, DiscountType, Discount, OrderDate) 
VALUES ('1800000004', 'Av. del Estudiante 789', 'Loja', 'Ecuador', '110101', 3, 1, 10, GETDATE());
INSERT INTO OrderDetails (OrderId, ProductId, UnitPrice, Quantity) 
VALUES 
(4, 2, 43.70, 1),  -- Jeans Rectos Clásicos (38.00 + 15%)
(4, 8, 33.06, 2),  -- Suéter de Algodón Básico (28.75 + 15%)
(4, 15, 52.33, 1), -- Mocasines Marrón Cuero (45.50 + 15%)
(4, 20, 32.72, 1), -- Bikini Estampado Flores (28.45 + 15%)
(4, 25, 34.44, 1); -- Ballet Flats Doradas (29.95 + 15%)

-- Order 5: 5 detalles
INSERT INTO Orders (CustomerId, ShipAddress, ShipCity, ShipCountry, ShipPostalCode, ShippingType, DiscountType, Discount, OrderDate) 
VALUES ('1800000005', 'Sauces 8, Mz 15', 'Guayaquil', 'Ecuador', '090101', 3, 1, 10, GETDATE());
INSERT INTO OrderDetails (OrderId, ProductId, UnitPrice, Quantity) 
VALUES 
(5, 10, 37.26, 1), -- Falda Midi Floral (32.40 + 15%)
(5, 17, 102.58, 1), -- Zapatillas Running Pro (89.20 + 15%)
(5, 22, 48.30, 2), -- Pantalones Chino Beige (42.00 + 15%)
(5, 30, 48.76, 1), -- Sandalias Oro Elegantes (42.40 + 15%)
(5, 35, 55.66, 1); -- Falda Corta Cuero (48.40 + 15%)
GO

-- Customer = (CustomerId, FirstName, LastName, Address, PhoneNumber, Email)
-- Products = (ProductId, Name, UnitPrice, Stock)
-- Orders = (Id, CustomerId, ShipAddress, ShipCity, ShipCountry, ShipPostalCode, ShippingType, DiscountType, Discount, OrderDate)
-- OrderDetails = (OrderId, ProductId, UnitPrice, Quantity)
USE NorthWindDB;
GO
SELECT * FROM Customers;
SELECT * FROM Products;
SELECT * FROM Orders;
SELECT * FROM OrderDetails;

INSERT INTO Products (Name, UnitPrice, Stock) VALUES 
('Chompa Azul TESTING', 10.50, 100);

delete from Products where ProductId = 62;

SELECT CAST(IDENT_CURRENT('Orders') + 1 AS INT)

