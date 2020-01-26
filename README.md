# SpeedGPS
<p align="center"><img src="https://github.com/geekzolanos/speedgps-webapp/raw/master/res/logo96.png" /></p>

## Descripcion
Monitoriza la velocidad actual mediante el uso de la Geolocation Web API.

SpeedGPS es una Aplicacion inicialmente desarrollada para la antigua Firefox Marketplace, portada a navegadores web modernos como una PWA y aplicacion nativa bajo Apache Cordova.

La implementacion actual busca conservar la mayor parte del codigo base de la aplicacion, incluyendo unicamente lo necesario para la implementacion de un Build System, soporte de Cordova y PWA. Por lo que se incluyen librerias que podrian ser potencialmente sustituidas mediante soluciones del estandar en curso.

## Caracteristicas
- Diseñado a partir de Building Blocks de Gaia, diseño predeterminado en Firefox OS.
- Conversion de Unidades.
- Manejo de preferencias.
- Soporte de notificaciones (Solo PWA)
- Soporte de Modernizr y manejo de Polyfills.

## Ver Aplicacion
**PWA**: https://geekzolanos.github.io/webapps/speedgps

**Play Store**: *En Espera de aprobación*

## Development
### Dependencias
- NodeJS y NPM (https://nodejs.org/)
- Cordova CLI instalado de forma global (https://cordova.apache.org/)
- Gulp instalado de forma global (https://gulpjs.com/)

#### Para Android
- Android SDK y SDK Platform 28 (https://developer.android.com/studio)
- Gradle 4.10.3 (https://gradle.org/)

## Como compilar
- Clone este repositorio: `git clone https://github.com/geekzolanos/speedgps-webapp`

- Acceda a la carpeta de proyecto: `cd ./speedgps-webapp`

- Instale dependencias: `npm i`

- Ejecute tareas de preparacion: `npm run build`

Luego de ello, se generará una carpeta `www` donde estaran los recursos base de la aplicacion. A partir de este punto, las instrucciones varian en funcion a la plataforma que desee implementar:

### Instrucciones para Android
- Conecte el dispositivo con el modo de desarrollo activado.
- Asegurese de establecer a Android SDK y Gradle en el Path de su OS.
- Agrege la plataforma al proyecto: `cordova platform add android`
- Compile e instale: `cordova run android`

### Instrucciones para PWA
- Agrege la plataforma al proyecto: `cordova platform add browser`
- Compile y inicie el servidor de desarrollo: `cordova run browser`