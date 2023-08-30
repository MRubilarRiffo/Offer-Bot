### README.md

---

# ESCRAPER Y BOT DE PROMOCIONES EN TIENDAS (Offer-Bot)
### Sep. 2023 - Actualidad

## Descripción

**Offer-Bot** es una aplicación diseñada para escanear y recopilar datos de productos de diversas tiendas y supermercados. Su principal funcionalidad es identificar productos en promoción y, automáticamente, difundirlos en un canal de Telegram dedicado.

## Características Principales

1. **Scraping Inteligente:** Recopilación de datos de múltiples tiendas y supermercados.
2. **Detección de Promociones:** Identificación y categorización de productos en oferta.
3. **Difusión Automática:** Canalización de promociones hacia un canal de Telegram.

## Tecnologías

- **Backend:** Express y Sequelize.
- **Base de Datos:** PostgreSQL.
- **Bot:** Python, que consume la API y envía la información a Telegram.

## Instalación y Uso

**Nota:** Las siguientes instrucciones son un ejemplo general. Puede ser necesario adaptarlas según las particularidades de tu sistema.

1. **Clonar el Repositorio**:
   ```
   git clone https://github.com/MRubilarRiffo/Offer-Bot.git
   ```

2. **Instalar Dependencias**:
   ```
   cd Offer-Bot
   npm install
   ```

3. **Configurar Variables de Entorno**:
   - Crear un archivo `.env` en la raíz del proyecto.
   - Añadir las variables de entorno necesarias (por ejemplo, credenciales de la base de datos, token del bot de Telegram, etc.)

4. **Ejecutar el Servidor**:
   ```
   npm start
   ```

5. **Configurar y Ejecutar el Bot de Python**:
   - Asegúrate de tener Python instalado en tu máquina.
   - Instala las dependencias con `pip install -r requirements.txt`.
   - Ejecuta el bot con `python bot_script.py`.
