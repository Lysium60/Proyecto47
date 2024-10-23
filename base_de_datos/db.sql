CREATE OR REPLACE TABLE usuarios (
    id_usuario BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario TEXT NOT NULL,
    contraseña TEXT NOT NULL,
    ocupacion TEXT NOT NULL CHECK (ocupacion IN ('profesor', 'estudiante')),
    identidad TEXT UNIQUE,
    apellido TEXT,
    email TEXT UNIQUE,
    fecha_nacimiento DATE
);

CREATE OR REPLACE TABLE materias (
    id_materia BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre TEXT UNIQUE NOT NULL
);

CREATE OR REPLACE TABLE ocupacion (
    id_ocupacion BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre TEXT CHECK (nombre IN ('profesor', 'estudiante', 'admin'))
);

CREATE OR REPLACE TABLE usuario_materia_ocu (
    id_usuario_materia_ocu BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_usuario BIGINT,
    id_materia BIGINT,
    id_ocupacion BIGINT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_materia) REFERENCES materias(id_materia),
    FOREIGN KEY (id_ocupacion) REFERENCES ocupacion(id_ocupacion)
);

CREATE OR REPLACE TABLE prof_alumnos_class (
    id_prof_alumnos_class BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_profesor BIGINT,
    id_materia BIGINT,
    alumnos TEXT,
    FOREIGN KEY (id_profesor) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (id_materia) REFERENCES materias(id_materia) ON DELETE CASCADE
);
INSERT INTO usuarios (
    nombre_usuario,
    contraseña,
    ocupacion,
    identidad,
    apellido,
    email,
    fecha_nacimiento
) VALUES
('juanperez', 'password123', 'profesor', '12345678A', 'Pérez', 'juan.perez@example.com', '1980-05-15'),
('mariagomez', 'securepass', 'estudiante', '87654321B', 'Gómez', 'maria.gomez@example.com', '1995-11-23'),
('carloslopez', 'mypassword', 'profesor', '11223344C', 'López', 'carlos.lopez@example.com', '1975-02-10'),
('lauradiaz', 'laurapass', 'estudiante', '44332211D', 'Díaz', 'laura.diaz@example.com', '2000-07-30'),
('anaruiz', 'anapass', 'profesor', '55667788E', 'Ruiz', 'ana.ruiz@example.com', '1985-09-05');

INSERT IGNORE INTO materias (nombre) VALUES
('Matemáticas'),
('Física'),
('Química'),
('Biología'),
('Historia');

INSERT INTO ocupacion (nombre) VALUES
('profesor'),
('estudiante'),
('admin');

INSERT INTO usuario_materia_ocu (id_usuario, id_materia, id_ocupacion) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 1),
(4, 4, 2),
(5, 5, 1);

INSERT INTO prof_alumnos_class (id_profesor, id_materia, alumnos) VALUES
(1, 1, '2,3'),
(2, 2, '4,5'),
(3, 3, '1,2'),
(4, 4, '3,5'),
(5, 5, '1,4');

DELIMITER $$

CREATE OR REPLACE PROCEDURE obtener_prof_alumnos_class()
BEGIN
    DECLARE done INT DEFAULT FALSE;
    DECLARE v_profesor BIGINT;
    DECLARE v_materia BIGINT;
    DECLARE v_alumnos TEXT;

    DECLARE v_profesor_cursor CURSOR FOR 
        SELECT um.id_usuario, um.id_materia
        FROM usuario_materia_ocu um
        JOIN usuarios u ON um.id_usuario = u.id_usuario
        WHERE u.ocupacion = 'profesor';

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- Limpiamos los registros anteriores
    DELETE FROM prof_alumnos_class;

    -- Abrimos el cursor
    OPEN v_profesor_cursor;
    read_loop: LOOP
        FETCH v_profesor_cursor INTO v_profesor, v_materia;
        IF done THEN
            LEAVE read_loop;
        END IF;

        -- Obtenemos los estudiantes relacionados con la materia del profesor
        SELECT GROUP_CONCAT(u.id_usuario SEPARATOR ',') INTO v_alumnos
        FROM usuario_materia_ocu um
        JOIN usuarios u ON um.id_usuario = u.id_usuario
        WHERE um.id_materia = v_materia
        AND u.ocupacion = 'estudiante';

        -- Insertamos la información en la tabla 'prof_alumnos_class'
        INSERT INTO prof_alumnos_class (id_profesor, id_materia, alumnos)
        VALUES (v_profesor, v_materia, v_alumnos);
    END LOOP;

    -- Cerramos el cursor
    CLOSE v_profesor_cursor;
END$$

DELIMITER ;

CREATE OR REPLACE TABLE classrooms (
    id_classroom INT AUTO_INCREMENT PRIMARY KEY,
    id_prof_alumnos_class BIGINT,
    FOREIGN KEY (id_prof_alumnos_class) REFERENCES prof_alumnos_class(id_prof_alumnos_class) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE tablones (
    id_tablon INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tablon VARCHAR(100),
    id_classroom INT,
    FOREIGN KEY (id_classroom) REFERENCES classrooms(id_classroom) ON DELETE CASCADE
);

CREATE OR REPLACE TABLE archivos (
    id_archivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_archivo VARCHAR(100),
    id_tablon INT,
    FOREIGN KEY (id_tablon) REFERENCES tablones(id_tablon),
    direccion_archivo VARCHAR(500)
);

CREATE OR REPLACE TABLE trabajos (
    id_trabajo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_trabajo VARCHAR(100),
    id_tablon INT,
    FOREIGN KEY (id_tablon) REFERENCES tablones(id_tablon),
    fecha_limite DATE,
    descripcion VARCHAR(255)
);

CREATE OR REPLACE TABLE trabajos_alumnos (
    id_trabajo_alumno INT AUTO_INCREMENT PRIMARY KEY,
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    nota DECIMAL(5,2) CHECK (nota >= 0 AND nota <= 100),
    id_trabajo INT,
    id_usuario_materia_ocu BIGINT,
    FOREIGN KEY (id_trabajo) REFERENCES trabajos(id_trabajo),
    FOREIGN KEY (id_usuario_materia_ocu) REFERENCES usuario_materia_ocu(id_usuario_materia_ocu)
);

CREATE OR REPLACE TABLE calificaciones (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    id_trabajo_alumno INT,
    nota_final DECIMAL(5,2) CHECK (nota_final >= 0 AND nota_final <= 100),
    FOREIGN KEY (id_trabajo_alumno) REFERENCES trabajos_alumnos(id_trabajo_alumno)
);

CREATE OR REPLACE TABLE blogs (
    id_blog INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100),
    descripcion VARCHAR(255),
    contenido VARCHAR(3000),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario_materia_ocu BIGINT,
    FOREIGN KEY (id_usuario_materia_ocu) REFERENCES usuario_materia_ocu(id_usuario_materia_ocu)
);

CREATE OR REPLACE TABLE blog_imagenes (
    id_blog INT,
    id_blog_imagen INT AUTO_INCREMENT PRIMARY KEY,
    FOREIGN KEY (id_blog) REFERENCES blogs(id_blog),
    url_imagen VARCHAR(500)
);

CREATE OR REPLACE TABLE etiquetas (
    id_etiqueta INT AUTO_INCREMENT PRIMARY KEY,
    nombre_etiqueta VARCHAR(255)
);

CREATE OR REPLACE TABLE blogs_etiquetas (
    id_blog INT,
    id_etiqueta INT,
    FOREIGN KEY (id_blog) REFERENCES blogs(id_blog),
    FOREIGN KEY (id_etiqueta) REFERENCES etiquetas(id_etiqueta),
    PRIMARY KEY (id_blog, id_etiqueta)
);

DELIMITER $$

CREATE OR REPLACE PROCEDURE calcular_promedio_notas_alumno(IN p_id_usuario BIGINT)
BEGIN
    DECLARE v_id_trabajo_alumno INT;
    DECLARE v_nota_final DECIMAL(5,2);
    DECLARE done INT DEFAULT FALSE;
    DECLARE cur CURSOR FOR 
        SELECT ta.id_trabajo_alumno, AVG(ta.nota) AS promedio_nota
        FROM trabajos_alumnos ta
        JOIN usuario_materia_ocu umo ON ta.id_usuario_materia_ocu = umo.id_usuario_materia_ocu
        WHERE umo.id_usuario = p_id_usuario
        GROUP BY ta.id_trabajo_alumno;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO v_id_trabajo_alumno, v_nota_final;
        IF done THEN
            LEAVE read_loop;
        END IF;

        INSERT INTO calificaciones (id_trabajo_alumno, nota_final)
        VALUES (v_id_trabajo_alumno, v_nota_final);
    END LOOP;

    CLOSE cur;
END$$

DELIMITER ;

INSERT INTO classrooms (id_prof_alumnos_class) VALUES
(1),
(2),
(3),
(4),
(5);


INSERT INTO tablones (nombre_tablon, id_classroom) VALUES
('Tablón Matemáticas', 1),
('Tablón Física', 2),
('Tablón Química', 3),
('Tablón Biología', 4),
('Tablón Historia', 5);


INSERT INTO archivos (nombre_archivo, id_tablon, direccion_archivo) VALUES
('archivo1.txt', 1, 'C:\\ruta\\archivo1.txt'),
('archivo2.txt', 2, 'C:\\ruta\\archivo2.txt'),
('archivo3.txt', 3, 'C:\\ruta\\archivo3.txt'),
('archivo4.txt', 4, 'C:\\ruta\\archivo4.txt'),
('archivo5.txt', 5, 'C:\\ruta\\archivo5.txt');


INSERT INTO trabajos (nombre_trabajo, id_tablon, fecha_limite, descripcion) VALUES
('Trabajo de Matemáticas', 1, '2024-12-15', 'Descripción del trabajo de Matemáticas'),
('Trabajo de Física', 2, '2024-12-16', 'Descripción del trabajo de Física'),
('Trabajo de Química', 3, '2024-12-17', 'Descripción del trabajo de Química'),
('Trabajo de Biología', 4, '2024-12-18', 'Descripción del trabajo de Biología'),
('Trabajo de Historia', 5, '2024-12-19', 'Descripción del trabajo de Historia');


INSERT INTO trabajos_alumnos (nota, id_trabajo, id_usuario_materia_ocu) VALUES
(85.00, 1, 1),
(90.50, 2, 2),
(77.75, 3, 3),
(88.00, 4, 4),
(92.25, 5, 5);

INSERT INTO calificaciones (id_trabajo_alumno, nota_final) VALUES
(1, 85.00),
(2, 90.50),
(3, 77.75),
(4, 88.00),
(5, 92.25);

INSERT INTO blogs (titulo, descripcion, contenido, id_usuario_materia_ocu) VALUES
('Blog sobre Matemáticas', 'Descripción del blog sobre Matemáticas', 'Contenido del blog sobre Matemáticas', 1),
('Blog sobre Física', 'Descripción del blog sobre Física', 'Contenido del blog sobre Física', 2),
('Blog sobre Química', 'Descripción del blog sobre Química', 'Contenido del blog sobre Química', 3),
('Blog sobre Biología', 'Descripción del blog sobre Biología', 'Contenido del blog sobre Biología', 4),
('Blog sobre Historia', 'Descripción del blog sobre Historia', 'Contenido del blog sobre Historia', 5);

INSERT INTO blog_imagenes (id_blog, url_imagen) VALUES
(1, 'https://example.com/image1.jpg'),
(2, 'https://example.com/image2.jpg'),
(3, 'https://example.com/image3.jpg'),
(4, 'https://example.com/image4.jpg'),
(5, 'https://example.com/image5.jpg');

INSERT INTO etiquetas (nombre_etiqueta) VALUES
('Matemáticas'),
('Física'),
('Química'),
('Biología'),
('Historia');

INSERT INTO blogs_etiquetas (id_blog, id_etiqueta) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

INSERT INTO usuario_materia_ocu (id_usuario, id_materia, id_ocupacion) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 1),
(4, 4, 2),
(5, 5, 1);



