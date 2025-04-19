use Pantry

create table Pantry(id INT IDENTITY(1,1) PRIMARY KEY,name VARCHAR(100),quantity INT DEFAULT 1);

select * from Pantry;